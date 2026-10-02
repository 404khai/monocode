// @vitest-environment happy-dom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { idleRateLimits } from "../model/rateLimits";
import { AccountUsageMeters, UsageMeter } from "./ProviderAccountUsage";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it("flips the meter when another window turns on remaining usage", async () => {
  const now = Date.now();
  await act(async () =>
    root.render(
      createElement(UsageMeter, {
        title: "5h",
        now,
        window: {
          usedPercent: 23,
          windowMinutes: 300,
          resetsAt: now + 3_600_000,
        },
      }),
    ),
  );
  const bar = () => container.querySelector('[role="progressbar"]');
  expect(bar()?.getAttribute("aria-label")).toBe("5h limit used");
  expect(bar()?.querySelector("span")?.getAttribute("style")).toBe(
    "width: 23%;",
  );

  await act(async () => {
    localStorage.setItem("monocode.showRemainingUsage", "1");
    window.dispatchEvent(
      new StorageEvent("storage", { key: "monocode.showRemainingUsage" }),
    );
  });

  expect(bar()?.getAttribute("aria-label")).toBe("5h limit remaining");
  expect(bar()?.querySelector("span")?.getAttribute("style")).toBe(
    "width: 77%;",
  );
  expect(container.textContent).toContain("77% left");
});

it("renders model weekly meters after the shared weekly meter", () => {
  const now = Date.now();
  const limits = {
    ...idleRateLimits("claude"),
    weekly: { usedPercent: 20, windowMinutes: 10080, resetsAt: null },
    scopedWeekly: [
      {
        label: "Fable 5.1",
        usedPercent: 75,
        windowMinutes: 10080,
        resetsAt: now + 86400000,
      },
    ],
  };
  act(() => root.render(createElement(AccountUsageMeters, { limits, now })));
  const bars = container.querySelectorAll('[role="progressbar"]');
  expect([...bars].map((bar) => bar.getAttribute("aria-label"))).toEqual([
    "Weekly limit used",
    "Fable 5.1 limit used",
  ]);
  expect(bars[1].getAttribute("aria-valuenow")).toBe("75");
  expect(container.textContent).toContain("Fable 5.1");
  expect(container.textContent).toContain("1d");
});
