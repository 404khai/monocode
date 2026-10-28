import { createHash, randomUUID } from "node:crypto";
import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { setTimeout as waitFor } from "node:timers/promises";

const maxAttempts = 4;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

class DownloadError extends Error {
  constructor(message, { cause, retryable = false } = {}) {
    super(message, { cause });
    this.retryable = retryable;
  }
}

async function downloadAttempt(url, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  // Keep this deadline active until the entire response body has been read.
  const timer = setTimeout(() => {
    controller.abort(
      new DOMException("Runtime download timed out", "TimeoutError"),
    );
  }, timeoutMs);
  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      // Release the failed response without waiting for its body to download.
      void response.body?.cancel().catch(() => {});
      throw new DownloadError(
        `HTTP ${response.status} ${response.statusText}`.trim(),
        {
          retryable:
            response.status === 408 ||
            response.status === 429 ||
            response.status >= 500,
        },
      );
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    if (error instanceof DownloadError) throw error;
    const detail = controller.signal.aborted
      ? `Timed out after ${timeoutMs}ms while downloading runtime (including response body)`
      : `${error.name}: ${error.message}${error.cause ? ` (${error.cause.code ?? error.cause.message})` : ""}`;
    throw new DownloadError(detail, { cause: error, retryable: true });
  } finally {
    clearTimeout(timer);
  }
}

export async function ensureRuntimeArchive(
  { archive, url, checksum },
  {
    fetchImpl = fetch,
    wait = waitFor,
    timeoutMs = 120_000,
    log = console.warn,
  } = {},
) {
  let cached;
  try {
    cached = await readFile(archive);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (cached) {
    if (sha256(cached) === checksum) return archive;
    // A restored CI cache is untrusted until checked against the pinned hash.
    await rm(archive);
    log(`Discarded Node runtime cache with checksum mismatch: ${archive}`);
  }

  let bytes;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      bytes = await downloadAttempt(url, fetchImpl, timeoutMs);
      break;
    } catch (error) {
      const message = `Node runtime download failed: ${url} (attempt ${attempt}/${maxAttempts}): ${error.message}`;
      if (!error.retryable || attempt === maxAttempts) {
        throw new Error(message, { cause: error });
      }
      const delayMs = 1_000 * 2 ** (attempt - 1);
      log(`${message}; retrying in ${delayMs}ms`);
      await wait(delayMs);
    }
  }
  const actual = sha256(bytes);
  if (actual !== checksum) {
    throw new Error(
      `Node runtime checksum mismatch: ${url}; expected ${checksum}, got ${actual}`,
    );
  }

  // Publish only complete, verified archives. Interrupted writes cannot become hits.
  const temporary = `${archive}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: "wx" });
    await rename(temporary, archive);
  } finally {
    await rm(temporary, { force: true });
  }
  return archive;
}
