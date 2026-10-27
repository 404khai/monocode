import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionCard } from "@/features/sessions/QuestionCard";
import type { QuestionPrompt } from "@/features/workspace/types";

const workspace = vi.hoisted(() => ({
  answerQuestion: vi.fn(),
  keepQuestionOpen: vi.fn(),
  alert: vi.fn(),
}));
vi.mock("react-native", () => {
  const View = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    View,
    ScrollView: View,
    Text: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
    TextInput: ({
      value,
      onChangeText,
      placeholder,
    }: {
      value: string;
      onChangeText: (value: string) => void;
      placeholder: string;
    }) => (
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChangeText(event.target.value)}
      />
    ),
    Pressable: ({
      children,
      onPress,
      disabled,
    }: {
      children?: ReactNode;
      onPress?: () => void;
      disabled?: boolean;
    }) => (
      <button disabled={disabled} onClick={onPress}>
        {children}
      </button>
    ),
    Alert: { alert: workspace.alert },
    StyleSheet: { absoluteFill: {}, hairlineWidth: 1 },
    useWindowDimensions: () => ({ width: 390, height: 844 }),
  };
});
vi.mock("react-native-reanimated", () => ({
  default: {
    View: ({ children, onTouchStart }: { children?: ReactNode; onTouchStart?: () => void }) => (
      <section onPointerDown={onTouchStart}>{children}</section>
    ),
  },
  FadeIn: { duration: () => ({}) },
  FadeOut: { duration: () => ({}) },
}));
vi.mock("@/ui/LiquidView", () => ({ LiquidView: () => null }));
vi.mock("@/ui/Icon", () => ({ Icon: () => null }));
vi.mock("@/ui/theme", () => ({
  radii: { card: 22, row: 12, pill: 999 },
  themedStyles: () => () => new Proxy({}, { get: () => ({}) }),
  useColors: () => new Proxy({}, { get: () => "#000" }),
  useScheme: () => "dark",
}));
vi.mock("@/features/workspace/WorkspaceProvider", () => ({
  useWorkspace: () => workspace,
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const colour = {
  id: "colour",
  prompt: "Which colour?",
  multiSelect: false,
  allowCustom: true,
  options: [
    { id: "red", label: "Red", description: "Warm" },
    { id: "blue", label: "Blue" },
  ],
};
const size = {
  id: "size",
  prompt: "Which sizes?",
  multiSelect: true,
  allowCustom: false,
  options: [
    { id: "s", label: "Small" },
    { id: "l", label: "Large" },
  ],
};

describe("question card", () => {
  let host: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  const render = (prompt: QuestionPrompt) =>
    act(() => root.render(<QuestionCard conversationId="session" prompt={prompt} />));
  const button = (label: string) =>
    [...host.querySelectorAll("button")].find((element) => element.textContent === label)!;
  const press = (label: string) => act(async () => { button(label).click(); });

  beforeEach(() => {
    vi.clearAllMocks();
    workspace.answerQuestion.mockResolvedValue(undefined);
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("sends the chosen option once one is picked", async () => {
    render({ requestId: 1, questions: [colour] });
    expect(button("Send").disabled).toBe(true);
    await press("RedWarm");
    await press("Send");
    expect(workspace.answerQuestion).toHaveBeenCalledWith("session", 1, {
      kind: "answered",
      answers: { colour: ["red"] },
    });
  });

  it("steps through questions, sending only the ones answered", async () => {
    render({ requestId: 2, questions: [colour, size] });
    await press("Skip");
    await press("Small");
    await press("Large");
    await press("Small");
    await press("Send");
    expect(workspace.answerQuestion).toHaveBeenCalledWith("session", 2, {
      kind: "answered",
      answers: { size: ["l"] },
    });
  });

  it("needs words for Other before it can send them", async () => {
    render({ requestId: 3, questions: [colour] });
    await press("Other");
    expect(button("Send").disabled).toBe(true);
    const input = host.querySelector("input")!;
    await act(async () => {
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setValue.call(input, " Teal ");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await press("Send");
    expect(workspace.answerQuestion).toHaveBeenCalledWith("session", 3, {
      kind: "answered",
      answers: { colour: ["__custom__"] },
      custom: { colour: "Teal" },
    });
  });

  it("keeps a timed question open on the first touch, and says when a send fails", async () => {
    render({ requestId: 4, questions: [colour], autoResolveAt: Date.now() + 30_000 });
    const card = host.querySelector("section")!;
    act(() => card.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    act(() => card.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(workspace.keepQuestionOpen).toHaveBeenCalledTimes(1);
    expect(workspace.keepQuestionOpen).toHaveBeenCalledWith("session", 4);

    workspace.answerQuestion.mockRejectedValue(new Error("This question was already answered"));
    await press("Skip");
    expect(workspace.answerQuestion).toHaveBeenCalledWith("session", 4, { kind: "skipped" });
    expect(workspace.alert).toHaveBeenCalledWith("Answer not sent", "This question was already answered");
  });
});
