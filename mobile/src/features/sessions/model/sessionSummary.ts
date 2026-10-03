export type SessionState = 'working' | 'needs-input' | 'done' | 'draft' | 'idle';

export type SessionProvider = 'codex' | 'claude' | 'opencode' | 'cursor';

export type SessionSummary = {
  id: string;
  title: string;
  project: string;
  projectMascot?: string;
  projectColor: string;
  branch: string;
  model: string;
  provider: SessionProvider;
  state: SessionState;
  updatedLabel: string;
  pinned?: boolean;
  linkedPullRequest?: number;
  additions?: number;
  deletions?: number;
};

export type SessionSection = {
  id: 'pinned' | 'recent';
  title: string;
  sessions: SessionSummary[];
};
