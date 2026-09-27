import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Settings } from "../../../shared/ui/icons";
import { useLockOverscroll } from "../../../shared/hooks/useLockOverscroll";
import { HarnessIcon } from "./HarnessIcon";
import {
  MCP_PROVIDER_LABELS,
  type McpConnection,
} from "../../settings/model/mcp";
import { mcpPickerServers } from "../model/mcpPicker";
import type { HarnessId } from "../model/session";

export function McpServerPicker({
  connections,
  harness,
  claudeStatus,
  loading,
  error,
  onPick,
  onManage,
  onDismiss,
}: {
  connections: McpConnection[];
  harness: HarnessId;
  claudeStatus: ReadonlyMap<string, string>;
  loading: boolean;
  error: string;
  onPick: (server: McpConnection) => void;
  onManage: () => void;
  onDismiss: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const search = useRef<HTMLInputElement>(null);
  const activeOption = useRef<HTMLButtonElement>(null);
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const servers = useMemo(
    () => mcpPickerServers(connections, harness, claudeStatus, query),
    [connections, harness, claudeStatus, query],
  );
  const selectable = servers.flatMap((server, index) =>
    server.availability === "available" ? [index] : [],
  );

  useEffect(() => {
    search.current?.focus();
  }, []);
  useEffect(() => {
    setActive(selectable[0] ?? 0);
  }, [query, connections, harness, claudeStatus]);
  useEffect(() => {
    activeOption.current?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  return (
    <div
      data-mcp-picker
      className="overflow-hidden rounded-lg border border-content/10 bg-background-base/95 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-content/10 px-3 py-2">
        <Search className="size-3.5 shrink-0 text-content/45" />
        <input
          ref={search}
          aria-label="Search MCP servers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onDismiss();
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (selectable.length === 0) return;
              const index = selectable.indexOf(active);
              const offset = event.key === "ArrowDown" ? 1 : -1;
              setActive(
                selectable[
                  (index + offset + selectable.length) % selectable.length
                ],
              );
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const server = servers[active];
              if (server?.availability === "available") onPick(server);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-content outline-none placeholder:text-content/40"
          placeholder="Search MCP servers…"
        />
      </div>
      <div
        ref={lockOverscroll}
        role="listbox"
        aria-label="MCP servers"
        className="max-h-[min(280px,45vh)] overflow-y-auto overscroll-none p-1"
      >
        {loading ? (
          <p className="px-2 py-2 text-[12px] text-content/50">
            Checking MCP servers…
          </p>
        ) : error ? (
          <p role="alert" className="px-2 py-2 text-[12px] text-red-400">
            {error}
          </p>
        ) : servers.length === 0 ? (
          <p className="px-2 py-2 text-[12px] text-content/50">
            {query ? "No matching MCP servers" : "No MCP servers found"}
          </p>
        ) : (
          servers.map((server, index) => {
            const available = server.availability === "available";
            return (
              <button
                key={`${server.provider}:${server.scope}:${server.configPath}:${server.name}`}
                ref={available && active === index ? activeOption : undefined}
                type="button"
                role="option"
                aria-selected={available && active === index}
                aria-disabled={!available}
                disabled={!available}
                onMouseEnter={() => {
                  if (available) setActive(index);
                }}
                onClick={() => onPick(server)}
                className={`flex min-h-10 w-full items-center gap-2 rounded-md px-2 py-1.5 text-left ${available ? (active === index ? "bg-selection text-content" : "text-content hover:bg-content/5") : "cursor-default text-content/40"}`}
              >
                <HarnessIcon
                  harness={
                    server.provider === "claude_desktop"
                      ? "claude"
                      : server.provider
                  }
                  className="size-4 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">
                    {server.name}
                  </span>
                  <span className="block truncate text-[11px] text-content/45">
                    {MCP_PROVIDER_LABELS[server.provider]} · {server.scope}
                  </span>
                </span>
                <span
                  className={`max-w-[40%] shrink-0 truncate text-[11px] ${server.availability === "authentication" ? "text-amber-400" : "text-content/45"}`}
                >
                  {server.availability === "authentication"
                    ? "Needs authentication"
                    : server.availability === "unavailable"
                      ? server.detail
                      : "Available"}
                </span>
              </button>
            );
          })
        )}
      </div>
      <button
        type="button"
        onClick={onManage}
        className="flex w-full items-center gap-2 border-t border-content/10 px-3 py-2 text-left text-[12px] text-content/65 hover:bg-content/5 hover:text-content"
      >
        <Settings className="size-3.5" />
        Manage MCP Servers…
      </button>
    </div>
  );
}
