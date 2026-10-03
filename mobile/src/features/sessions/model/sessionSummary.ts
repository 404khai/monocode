export type SessionState = 'working' | 'needs-input' | 'done' | 'draft' | 'idle';

export type SessionProvider = 'codex' | 'claude' | 'opencode' | 'cursor';

export type SessionSummary = {
  id: string;
  title: string;
  project: string;
  projectMascot?: string;
  projectColor: string;
  branch: string;
  workspace: { id: string; name: string; kind: 'checkout' | 'worktree' };
  threadGroup?: { id: string; name: string };
  pinned?: boolean;
  model: string;
  provider: SessionProvider;
  state: SessionState;
  updatedLabel: string;
  linkedPullRequest?: number;
  additions?: number;
  deletions?: number;
};
