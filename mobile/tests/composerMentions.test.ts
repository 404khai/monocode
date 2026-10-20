import { expect, it } from "vitest";
import {
  composerMentionParts,
  mentionIconPrefixes,
  type ComposerMention,
} from "@/features/sessions/composerMentions";
const files: ComposerMention[] = [
  { label: "host", name: "host", path: "host", isDir: true },
  {
    label: "src/main.tsx",
    name: "main.tsx",
    path: "src/main.tsx",
    isDir: false,
  },
  { label: "main.rs", name: "main.rs", path: "src/main.rs", isDir: false },
];
it("recognizes selected folder and file tokens while preserving the input text and UTF-16 offsets", () => {
  const text = "🔍 @host @src/main.tsx, then @main.rs";
  const parts = composerMentionParts(text, files);
  expect(parts.map((part) => part.text).join("")).toBe(text);
  expect(
    parts
      .filter((part) => part.file)
      .map((part) => [part.text, part.start, part.file!.name]),
  ).toEqual([
    ["@host", 3, "host"],
    ["@src/main.tsx", 9, "main.tsx"],
    ["@main.rs", 29, "main.rs"],
  ]);
});
it("keeps email, unknown/edited labels and quoted references as ordinary text", () => {
  const text = "mail@host @host-edited @unknown\n> @host\n@host";
  const parts = composerMentionParts(text, files);
  expect(parts.filter((part) => part.file).map((part) => part.text)).toEqual([
    "@host",
  ]);
  expect(parts.map((part) => part.text).join("")).toBe(text);
});
it("locates icon prefixes on native wrapped lines without inserting attachment characters or changing text widths", () => {
  const text = "Review @host and\n@src/main.tsx now";
  const parts = composerMentionParts(text, files);
  const markers = mentionIconPrefixes(text, parts, [
    { text: "Review @host and\n", x: 0, y: 0, height: 22 },
    { text: "@src/main.tsx now", x: 0, y: 22, height: 22 },
  ]);
  expect(markers.map(({ prefix, y, file }) => [prefix, y, file.name])).toEqual([
    ["Review @", 0, "host"],
    ["@", 22, "main.tsx"],
  ]);
});
