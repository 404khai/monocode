import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { SharedValue } from "react-native-reanimated";
import { ComposerMentionText } from "@/features/sessions/ComposerMentionText";
import { composerMentionParts } from "@/features/sessions/composerMentions";
const runtime = vi.hoisted(() => ({ scheme: "dark" }));
const flatten = (style: object | object[]) =>
  Array.isArray(style) ? Object.assign({}, ...style) : style;
vi.mock("react-native", () => ({
  StyleSheet: { create: (styles: object) => styles },
  View: ({
    children,
    style,
    pointerEvents,
    importantForAccessibility,
  }: {
    children?: ReactNode;
    style: object;
    pointerEvents?: string;
    importantForAccessibility?: string;
  }) => (
    <div
      style={flatten(style)}
      data-pointer={pointerEvents}
      data-accessibility={importantForAccessibility}
    >
      {children}
    </div>
  ),
  Text: ({
    children,
    style,
    onTextLayout,
  }: {
    children?: ReactNode;
    style: object;
    onTextLayout?: (event: object) => void;
  }) => (
    <span
      style={flatten(style)}
      data-color={flatten(style)?.color}
      data-layout={!!onTextLayout}
      onDoubleClick={(event) => {
        const value = event.currentTarget.textContent ?? "";
        const lines = value.match(/[^\n]*\n|[^\n]+$/g) ?? [];
        onTextLayout?.({
          nativeEvent: {
            lines: lines.map((text, index) => ({
              text,
              x: 0,
              y: index * 22,
              height: 22,
              width: text.trimEnd().length * 8,
            })),
          },
        });
      }}
    >
      {children}
    </span>
  ),
}));
vi.mock("react-native-reanimated", () => ({
  default: {
    View: ({ children, style }: { children?: ReactNode; style: object[] }) => (
      <div data-transform={JSON.stringify(flatten(style).transform)}>
        {children}
      </div>
    ),
  },
  useAnimatedStyle: (read: () => object) => read(),
}));
vi.mock("@/features/files/FileTypeIcon", () => ({
  FileTypeIcon: ({ name, isDir }: { name: string; isDir: boolean }) => (
    <i data-icon={name} data-dir={isDir} />
  ),
}));
vi.mock("@/ui/theme", () => ({
  useColors: () => ({ content: "#ebebeb" }),
  useScheme: () => runtime.scheme,
}));
let root: ReturnType<typeof createRoot>;
let container: HTMLDivElement;
let scrollPosition = { x: 0, y: 0 };
const scroll = { get: () => scrollPosition } as unknown as SharedValue<{
  x: number;
  y: number;
}>;
const files = [
  { label: "host", name: "host", path: "host", isDir: true },
  {
    label: "src/main.tsx",
    name: "main.tsx",
    path: "src/main.tsx",
    isDir: false,
  },
];
const render = (text = "@host\n@src/main.tsx") =>
  act(() =>
    root.render(
      <ComposerMentionText
        text={text}
        parts={composerMentionParts(text, files)}
        scroll={scroll}
      />,
    ),
  );
const measure = () =>
  act(() => {
    container
      .querySelectorAll('[data-layout="true"]')
      .forEach((span) =>
        span.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })),
      );
  });
beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  runtime.scheme = "dark";
  scrollPosition = { x: 0, y: 0 };
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
it("paints the desktop blue and positions file-type icons over @ on each wrapped line", () => {
  render();
  measure();
  measure();
  expect(
    [...container.querySelectorAll('[data-color="#38bdf8"]')].map(
      (span) => span.textContent,
    ),
  ).toEqual(["@host", "@src/main.tsx"]);
  const icons = [...container.querySelectorAll<HTMLElement>("[data-icon]")];
  expect(icons.map((icon) => icon.dataset.icon)).toEqual(["host", "main.tsx"]);
  expect(icons.map((icon) => icon.parentElement!.style.top)).toEqual([
    "4.5px",
    "26.5px",
  ]);
  expect(icons.map((icon) => icon.parentElement!.style.left)).toEqual([
    "-2.5px",
    "-2.5px",
  ]);
});
it("leaves all input touches and accessibility to TextInput and follows its native scrolling", () => {
  scrollPosition = { x: 4, y: 44 };
  render();
  expect(container.firstElementChild!.getAttribute("data-pointer")).toBe(
    "none",
  );
  expect(container.firstElementChild!.getAttribute("data-accessibility")).toBe(
    "no-hide-descendants",
  );
  expect(
    JSON.parse(
      container
        .querySelector("[data-transform]")!
        .getAttribute("data-transform")!,
    ),
  ).toEqual([{ translateX: -4 }, { translateY: -44 }]);
});
it("uses the desktop light-theme blue and removes styling/icons when a token is edited", () => {
  runtime.scheme = "light";
  render("@host");
  measure();
  measure();
  expect(container.querySelector('[data-color="#0284c7"]')?.textContent).toBe(
    "@host",
  );
  render("@host-edited");
  measure();
  expect(container.querySelector("[data-icon]")).toBeNull();
  expect(container.querySelector('[data-color="#0284c7"]')).toBeNull();
});
