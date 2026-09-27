import type { HarnessId } from "./session";
import {
  MCP_PROVIDER_LABELS,
  type McpConnection,
} from "../../settings/model/mcp";

export type McpPickerServer = McpConnection & {
  availability: "available" | "authentication" | "unavailable";
  detail: string;
};

export function mcpPickerServers(
  connections: McpConnection[],
  harness: HarnessId,
  claudeStatus: ReadonlyMap<string, string>,
  query: string,
): McpPickerServer[] {
  const search = query.trim().toLowerCase();
  const priority = { available: 0, authentication: 1, unavailable: 2 };
  return connections
    .filter((server) =>
      `${server.name} ${MCP_PROVIDER_LABELS[server.provider]} ${server.scope}`
        .toLowerCase()
        .includes(search),
    )
    .map((server) => {
      const status =
        server.provider === "claude"
          ? claudeStatus.get(server.name)
          : undefined;
      const matches = server.provider === harness;
      const authentication =
        matches &&
        status != null &&
        /auth|sign.?in|log.?in|unauthorized/i.test(status);
      const failed =
        matches &&
        status != null &&
        /failed|error|offline|unreachable|disconnected/i.test(status);
      return {
        ...server,
        availability:
          !matches || failed
            ? ("unavailable" as const)
            : authentication
              ? ("authentication" as const)
              : ("available" as const),
        detail: !matches
          ? "Different provider"
          : failed
            ? "Connection unavailable"
            : "Configured for this provider",
      };
    })
    .sort(
      (a, b) =>
        priority[a.availability] - priority[b.availability] ||
        a.name.localeCompare(b.name) ||
        a.provider.localeCompare(b.provider),
    );
}

export function mcpContextText(servers: McpConnection[], text: string): string {
  if (servers.length === 0) return text;
  const names = servers
    .map((server) => `${JSON.stringify(server.name)} (${server.provider})`)
    .join(", ");
  return `MCP context: Use the configured server${servers.length === 1 ? "" : "s"} ${names} when relevant to this request.\n\n${text}`;
}
