import { expect, it } from "vitest";
import { mcpContextText, mcpPickerServers } from "./mcpPicker";
import type { McpConnection } from "../../settings/model/mcp";

const servers: McpConnection[] = [
  {
    provider: "cursor",
    name: "other",
    scope: "user",
    configPath: "/cursor",
    transport: "stdio",
  },
  {
    provider: "claude",
    name: "needs-login",
    scope: "user",
    configPath: "/claude",
    transport: "http",
  },
  {
    provider: "claude",
    name: "docs",
    scope: "project",
    configPath: "/repo/.mcp.json",
    transport: "stdio",
  },
];

it("prioritizes usable servers while retaining authentication and other providers", () => {
  const ranked = mcpPickerServers(
    servers,
    "claude",
    new Map([["needs-login", "Needs authentication"]]),
    "",
  );
  expect(ranked.map((server) => [server.name, server.availability])).toEqual([
    ["docs", "available"],
    ["needs-login", "authentication"],
    ["other", "unavailable"],
  ]);
  expect(
    mcpPickerServers(servers, "claude", new Map(), "cursor").map(
      (server) => server.name,
    ),
  ).toEqual(["other"]);
});

it("adds only selected server names to outgoing context", () => {
  expect(mcpContextText([servers[2]], "Find the docs")).toContain(
    '"docs" (claude)',
  );
  expect(mcpContextText([], "Find the docs")).toBe("Find the docs");
});
