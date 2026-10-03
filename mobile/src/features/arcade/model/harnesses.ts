// Portable provider identifiers from the desktop session model, without Tauri dependencies.
export const HARNESSES = ['claude','codex','cursor','grok','opencode','pi','omp','fx','hermes','antigravity'] as const;
export type HarnessId = (typeof HARNESSES)[number];
