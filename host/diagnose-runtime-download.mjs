import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import { get } from "node:https";
import { spawn } from "node:child_process";
import { channel } from "node:diagnostics_channel";

const url = "https://nodejs.org/dist/v24.21.0/node-v24.21.0-win-x64.zip";
const started = Date.now();
const log = (name, value) => console.log(`[${Date.now() - started}ms] ${name}: ${value}`);
log("runtime", JSON.stringify(process.versions));
log("DNS", JSON.stringify(await lookup("nodejs.org", { all: true })));
for (const name of ["undici:client:beforeConnect", "undici:client:connected", "undici:client:connectError"]) {
  channel(name).subscribe(({ connectParams, socket, error }) => log(name, JSON.stringify({ host: connectParams?.host, address: socket?.remoteAddress, code: error?.code, message: error?.message })));
}

async function probeFetch() {
  let phase = "headers";
  let size = 0;
  const hash = createHash("sha256");
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    phase = "body";
    log("fetch headers", `${response.status}, content-length=${response.headers.get("content-length")}`);
    for await (const chunk of response.body) {
      if (!size) log("fetch", "first body bytes");
      size += chunk.length;
      hash.update(chunk);
    }
    log("fetch complete", `${size} bytes, sha256=${hash.digest("hex")}`);
  } catch (error) {
    log("fetch failure", `${phase}, ${size} bytes: ${error.stack}; cause=${error.cause?.stack}`);
  }
}

async function probeHttps(family) {
  const name = family ? "https IPv4" : "https";
  let phase = "headers";
  let size = 0;
  const hash = createHash("sha256");
  try {
    await new Promise((resolve, reject) => {
      const request = get(url, { family, signal: AbortSignal.timeout(30_000) }, (response) => {
        phase = "body";
        log(`${name} headers`, `${response.statusCode}, content-length=${response.headers["content-length"]}`);
        response.on("data", (chunk) => {
          if (!size) log(name, "first body bytes");
          size += chunk.length;
          hash.update(chunk);
        });
        response.on("end", resolve);
        response.on("error", reject);
      });
      request.on("socket", (socket) => {
        socket.on("connect", () => log(`${name} TCP`, socket.remoteAddress));
        socket.on("secureConnect", () => log(`${name} TLS`, socket.getProtocol()));
      });
      request.on("error", reject);
    });
    log(`${name} complete`, `${size} bytes, sha256=${hash.digest("hex")}`);
  } catch (error) {
    log(`${name} failure`, `${phase}, ${size} bytes: ${error.stack}`);
  }
}

async function probeCurl(ipv4) {
  const name = ipv4 ? "curl IPv4" : "curl";
  await new Promise((resolve) => {
    const child = spawn("curl.exe", ["--disable", "--silent", "--show-error", "--location", "--fail", "--max-time", "30", ...(ipv4 ? ["--ipv4"] : []), "--output", "NUL", "--write-out", "status=%{http_code} bytes=%{size_download} remote=%{remote_ip} connect=%{time_connect} tls=%{time_appconnect} headers=%{time_starttransfer} total=%{time_total}", url], { timeout: 35_000 });
    child.stdout.on("data", (chunk) => log(name, chunk.toString()));
    child.stderr.on("data", (chunk) => log(`${name} stderr`, chunk.toString()));
    child.on("error", (error) => { log(name, error.message); resolve(); });
    child.on("close", (code) => { log(`${name} exit`, code); resolve(); });
  });
}

await Promise.all([probeFetch(), probeHttps(), probeHttps(4), probeCurl(false), probeCurl(true)]);
