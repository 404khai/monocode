import { mentionTokenAt } from "./mentionToken";

export type ComposerMention = {
  label: string;
  path: string;
  name: string;
  isDir: boolean;
};
export type MentionPart = {
  text: string;
  file?: ComposerMention;
  start: number;
};
const PUNCTUATION = new Set([
  ",",
  ";",
  ":",
  "!",
  "?",
  ")",
  "]",
  "}",
  '"',
  "'",
  "/",
]);

/** Keep the exact native input string, including @, spaces and punctuation. */
export function composerMentionParts(
  text: string,
  files: ComposerMention[],
): MentionPart[] {
  const labels = new Map(files.map((file) => [file.label, file]));
  const parts: MentionPart[] = [];
  let cursor = 0;
  for (const match of text.matchAll(/(^|\s)@(\S+)/g)) {
    const start = match.index + match[1].length;
    if (!mentionTokenAt(text, start + 1)) continue;
    let label = match[2];
    while (label && !labels.has(label) && PUNCTUATION.has(label.at(-1)!))
      label = label.slice(0, -1);
    const file = labels.get(label);
    if (!file) continue;
    if (start > cursor)
      parts.push({ text: text.slice(cursor, start), start: cursor });
    parts.push({
      text: text.slice(start, start + 1 + label.length),
      start,
      file,
    });
    cursor = start + 1 + label.length;
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), start: cursor });
  return parts;
}
export type MentionLine = {
  text: string;
  x: number;
  y: number;
  height: number;
};

/** Measure the prefix ending at @ on its actual wrapped native text line.
 * The icon replaces the glyph visually, without changing its advance width. */
export function mentionIconPrefixes(
  text: string,
  parts: MentionPart[],
  lines: MentionLine[],
) {
  const out: {
    prefix: string;
    x: number;
    y: number;
    height: number;
    start: number;
    file: ComposerMention;
  }[] = [];
  let offset = 0;
  for (const line of lines) {
    const start = text.indexOf(line.text, offset);
    if (start < 0) continue;
    const end = start + line.text.length;
    for (const part of parts) {
      if (part.file && part.start >= start && part.start < end)
        out.push({
          prefix: text.slice(start, part.start + 1),
          x: line.x,
          y: line.y,
          height: line.height,
          start: part.start,
          file: part.file,
        });
    }
    offset = end;
  }
  return out;
}
