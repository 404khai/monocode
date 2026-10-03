// Desktop settings navigation and complete searchable row catalog, copied without its Tauri/storage imports.
export const SETTINGS_GROUPS = [
  {
    "id": "app",
    "label": "App"
  },
  {
    "id": "agents",
    "label": "Agents"
  },
  {
    "id": "workspace",
    "label": "Workspace"
  }
] as const;
export const SETTINGS_SECTIONS = [
  {
    "id": "general",
    "group": "app",
    "label": "General",
    "description": "The build you are running, how MonoCode reaches you, and the panels it shows.",
    "keywords": "version update sounds notifications notes rail"
  },
  {
    "id": "connections",
    "group": "app",
    "label": "Connections",
    "description": "Connect your machines and run agents remotely through SSH.",
    "keywords": "ssh remote host machine server environment always on"
  },
  {
    "id": "appearance",
    "group": "app",
    "label": "Appearance",
    "description": "Theme, tint, translucency, workspace layout, and conversation backgrounds.",
    "keywords": "theme dark light color accent glass blur zoom scale wallpaper rail sidebar"
  },
  {
    "id": "keybindings",
    "group": "app",
    "label": "Keybindings",
    "description": "Every shortcut the workspace handles, from the app menu and the key handler.",
    "keywords": "shortcut hotkey keyboard binding"
  },
  {
    "id": "chat",
    "group": "agents",
    "label": "Chat",
    "description": "How transcripts read, what the composer does with a follow-up, how files save, and how diffs open.",
    "keywords": "transcript composer prompt message diff review layout format save editor"
  },
  {
    "id": "providers",
    "group": "agents",
    "label": "Providers",
    "description": "Provider accounts, agent CLIs MonoCode can drive, and the model new sessions start with.",
    "keywords": "account sign in login model harness claude codex gemini cli default hooks"
  },
  {
    "id": "mcp",
    "group": "agents",
    "label": "MCP",
    "description": "Find MCP servers across providers and manage their connections.",
    "keywords": "tools servers connections oauth authenticate login claude codex cursor opencode"
  },
  {
    "id": "skills",
    "group": "agents",
    "label": "Skills",
    "description": "Discover and manage file skills from project, personal, and harness folders.",
    "keywords": "skill instructions prompt"
  },
  {
    "id": "inbox",
    "group": "workspace",
    "label": "Inbox",
    "description": "Manage Inbox services and notification preferences for each project.",
    "keywords": "github gitlab linear jira atlassian azure devops connect token integration"
  },
  {
    "id": "archive",
    "group": "workspace",
    "label": "Archive",
    "description": "Projects and conversations you have archived.",
    "keywords": "archived restore delete hidden"
  },
  {
    "id": "worktrees",
    "group": "workspace",
    "label": "Worktrees",
    "description": "Manage additional worktrees for each project.",
    "keywords": "git branch worktree working copy project create delete"
  }
] as const;
export const SETTINGS_INDEX = [
  {
    "id": "remote-machines",
    "section": "connections",
    "label": "Your machines",
    "keywords": "ssh remote connect host server environment"
  },
  {
    "id": "mcp-servers",
    "section": "mcp",
    "label": "MCP servers",
    "keywords": "claude tools connections oauth authenticate login add remove"
  },
  {
    "id": "project-worktrees",
    "section": "worktrees",
    "label": "Project worktrees",
    "keywords": "git branch working copy create delete manage"
  },
  {
    "id": "update",
    "section": "general",
    "label": "Version",
    "keywords": "update upgrade release what's new build changelog"
  },
  {
    "id": "sounds",
    "section": "general",
    "label": "Sounds",
    "keywords": "audio cue chime mute volume"
  },
  {
    "id": "notifications",
    "section": "general",
    "label": "Notifications",
    "keywords": "notify alert toast permission reminder background"
  },
  {
    "id": "notes",
    "section": "general",
    "label": "Notes",
    "keywords": "notebook markdown rail scratchpad"
  },
  {
    "id": "quick-composer",
    "section": "general",
    "label": "Quick composer",
    "keywords": "spotlight global shortcut hotkey floating prompt anywhere"
  },
  {
    "id": "working-agents",
    "section": "general",
    "label": "Working agents",
    "keywords": "live running sessions rail card"
  },
  {
    "id": "file-tabs",
    "section": "general",
    "label": "File tabs",
    "keywords": "editor open top workspace normal session pane beside chat"
  },
  {
    "id": "tab-animations",
    "section": "general",
    "label": "Tab animations",
    "keywords": "motion open close resize transition"
  },
  {
    "id": "close-to-tray",
    "section": "general",
    "label": "Close to tray",
    "keywords": "minimize background quit exit window taskbar windows"
  },
  {
    "id": "theme",
    "section": "appearance",
    "label": "Theme",
    "keywords": "dark light system appearance mode"
  },
  {
    "id": "accent-color",
    "section": "appearance",
    "label": "Accent color",
    "keywords": "highlight bubble send button tint"
  },
  {
    "id": "hue",
    "section": "appearance",
    "label": "Hue",
    "keywords": "tint color chrome"
  },
  {
    "id": "saturation",
    "section": "appearance",
    "label": "Saturation",
    "keywords": "tint color neutral grey gray"
  },
  {
    "id": "dark-lightness",
    "section": "appearance",
    "label": "Dark-mode lightness",
    "keywords": "black brightness contrast background"
  },
  {
    "id": "sidebar-opacity",
    "section": "appearance",
    "label": "Sidebar opacity",
    "keywords": "glass translucent transparency vibrancy"
  },
  {
    "id": "blur",
    "section": "appearance",
    "label": "Blur radius",
    "keywords": "glass translucent vibrancy backdrop"
  },
  {
    "id": "main-pane-glass",
    "section": "appearance",
    "label": "Main pane glass",
    "keywords": "translucent transparency body window"
  },
  {
    "id": "interface-scale",
    "section": "appearance",
    "label": "Interface scale",
    "keywords": "zoom font size bigger smaller ui"
  },
  {
    "id": "collapsed-project-rail",
    "section": "appearance",
    "label": "Collapsed project rail",
    "keywords": "sidebar compact icons hidden navigation layout"
  },
  {
    "id": "show-excluded-files",
    "section": "appearance",
    "label": "Show excluded files",
    "keywords": "explorer gitignore ignored hidden files tree"
  },
  {
    "id": "chat-background",
    "section": "appearance",
    "label": "Chat background",
    "keywords": "wallpaper image picture opacity backdrop"
  },
  {
    "id": "transcript-layout",
    "section": "chat",
    "label": "Transcript layout",
    "keywords": "full width chat bubble message"
  },
  {
    "id": "anchor-prompts",
    "section": "chat",
    "label": "Anchor prompts to top",
    "keywords": "scroll position sticky message"
  },
  {
    "id": "follow-up",
    "section": "chat",
    "label": "Follow-up behavior",
    "keywords": "queue steer interrupt send while running"
  },
  {
    "id": "model-controls",
    "section": "chat",
    "label": "Model controls",
    "keywords": "effort thinking reasoning fast service tier model picker composer"
  },
  {
    "id": "composer-mascot",
    "section": "chat",
    "label": "Composer mascot",
    "keywords": "runner animation coin fun"
  },
  {
    "id": "format-on-save",
    "section": "chat",
    "label": "Format on save",
    "keywords": "prettier quotes editor save format"
  },
  {
    "id": "diff-view",
    "section": "chat",
    "label": "Diff view",
    "keywords": "unified editor review changes working tree"
  },
  {
    "id": "empty-session-games",
    "section": "chat",
    "label": "Empty session games",
    "keywords": "pacman snake arcade grid fun"
  },
  {
    "id": "agent-clis",
    "section": "providers",
    "label": "Agent CLIs",
    "keywords": "codex opencode cursor grok pi omp fx hermes antigravity binary path"
  },
  {
    "id": "provider-accounts",
    "section": "providers",
    "label": "Provider accounts",
    "keywords": "account sign in login rename remove delete credentials profile usage limit quota exhausted"
  },
  {
    "id": "show-remaining-usage",
    "section": "providers",
    "label": "Show remaining usage",
    "keywords": "usage limit meter bar left used quota percent"
  },
  {
    "id": "mask-emails",
    "section": "providers",
    "label": "Mask account emails",
    "keywords": "email privacy blur hide screenshot account"
  },
  {
    "id": "claude-hooks",
    "section": "providers",
    "label": "Claude Code hooks",
    "keywords": "pretooluse settings.json block command notification"
  },
  {
    "id": "project-notifications",
    "section": "inbox",
    "label": "Project notifications",
    "keywords": "mute resume sounds banners reminders categories"
  },
  {
    "id": "github",
    "section": "inbox",
    "label": "GitHub",
    "keywords": "gh cli connect pull request sign in"
  },
  {
    "id": "gitlab",
    "section": "inbox",
    "label": "GitLab",
    "keywords": "token self-managed merge request connect"
  },
  {
    "id": "azuredevops",
    "section": "inbox",
    "label": "ADO",
    "keywords": "azure devops boards repos pull request pat organization connect"
  },
  {
    "id": "jira",
    "section": "inbox",
    "label": "Jira",
    "keywords": "atlassian cloud site email api token issues projects connect"
  },
  {
    "id": "linear",
    "section": "inbox",
    "label": "Linear",
    "keywords": "api key issues teams connect"
  },
  {
    "id": "show-archived",
    "section": "archive",
    "label": "Show archived in the sidebar",
    "keywords": "hidden conversations list"
  }
] as const;
export const KEYBINDINGS = [
  {
    "command": "App: Settings",
    "keys": "⌘,",
    "when": "Always"
  },
  {
    "command": "App: Search",
    "keys": "⌘K",
    "when": "Always"
  },
  {
    "command": "App: Go to File",
    "keys": "⌘P",
    "when": "Always"
  },
  {
    "command": "App: Command Palette",
    "keys": "⌘⇧P",
    "when": "Always"
  },
  {
    "command": "App: Find in Files",
    "keys": "⌘⇧F",
    "when": "Always"
  },
  {
    "command": "App: Open Project",
    "keys": "⌘O",
    "when": "Always"
  },
  {
    "command": "App: New Window",
    "keys": "⌘⇧N",
    "when": "Always"
  },
  {
    "command": "App: Quick Composer",
    "keys": "⌘⇧Space",
    "when": "Anywhere"
  },
  {
    "command": "App: Toggle Sidebar",
    "keys": "⌘B",
    "when": "Always"
  },
  {
    "command": "App: Toggle Session Sidebar",
    "keys": "⌘⇧B",
    "when": "Always"
  },
  {
    "command": "App: Switch Model",
    "keys": "⌘.",
    "when": "Always"
  },
  {
    "command": "Composer: Toggle Workspace",
    "keys": "⌘⇧G",
    "when": "Draft session composer"
  },
  {
    "command": "View: Reload",
    "keys": "⌘⇧R",
    "when": "Always"
  },
  {
    "command": "View: Zoom In",
    "keys": "⌘+",
    "when": "Always"
  },
  {
    "command": "View: Zoom Out",
    "keys": "⌘-",
    "when": "Always"
  },
  {
    "command": "View: Reset Zoom",
    "keys": "⌘0",
    "when": "Always"
  },
  {
    "command": "Tab: New",
    "keys": "⌘T",
    "when": "Always"
  },
  {
    "command": "Tab: Close Others",
    "keys": "⌘⌥T",
    "when": "Always"
  },
  {
    "command": "Tab: Close All",
    "keys": "⌘⇧W",
    "when": "Always"
  },
  {
    "command": "Tab: Next",
    "keys": "⌘⇧]",
    "when": "Always"
  },
  {
    "command": "Tab: Previous",
    "keys": "⌘⇧[",
    "when": "Always"
  },
  {
    "command": "Tab: Cycle Next",
    "keys": "⌃Tab",
    "when": "Always"
  },
  {
    "command": "Tab: Cycle Previous",
    "keys": "⌃⇧Tab",
    "when": "Always"
  },
  {
    "command": "Tab: Back",
    "keys": "⌘[",
    "when": "Always"
  },
  {
    "command": "Tab: Forward",
    "keys": "⌘]",
    "when": "Always"
  },
  {
    "command": "Tab: Activate 1–8",
    "keys": "⌘1 … ⌘8",
    "when": "Always"
  },
  {
    "command": "Tab: Activate Last",
    "keys": "⌘9",
    "when": "Always"
  },
  {
    "command": "Session: Archive",
    "keys": "⌘⇧A",
    "when": "sessionFocus && !overlay"
  },
  {
    "command": "Session: Previous",
    "keys": "⌘⇧↑",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Session: Next",
    "keys": "⌘⇧↓",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Session: Previous in Current Tab",
    "keys": "⌘↑",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Session: Next in Current Tab",
    "keys": "⌘↓",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Project: Previous",
    "keys": "⌘⇧←",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Project: Next",
    "keys": "⌘⇧→",
    "when": "!overlay && (!textFocus || emptyComposer)"
  },
  {
    "command": "Pane: Close",
    "keys": "⌘W",
    "when": "Always"
  },
  {
    "command": "Pane: Split Right",
    "keys": "⌘D",
    "when": "!editorFocus"
  },
  {
    "command": "Pane: Split Down",
    "keys": "⌘⇧D",
    "when": "!editorFocus"
  },
  {
    "command": "Pane: Focus Left",
    "keys": "⌘⌥←",
    "when": "Always"
  },
  {
    "command": "Pane: Focus Right",
    "keys": "⌘⌥→",
    "when": "Always"
  },
  {
    "command": "Pane: Focus Up",
    "keys": "⌘⌥↑",
    "when": "Always"
  },
  {
    "command": "Pane: Focus Down",
    "keys": "⌘⌥↓",
    "when": "Always"
  },
  {
    "command": "Terminal: New",
    "keys": "⌘`",
    "when": "Always"
  },
  {
    "command": "Terminal: New Tab",
    "keys": "⌘⇧`",
    "when": "Always"
  },
  {
    "command": "Terminal: Toggle Dock",
    "keys": "⌘J",
    "when": "Always"
  },
  {
    "command": "Editor: Find",
    "keys": "⌘F",
    "when": "editorFocus"
  },
  {
    "command": "Editor: Replace",
    "keys": "⌘⌥F",
    "when": "editorFocus"
  }
] as const;
export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]['id'];
