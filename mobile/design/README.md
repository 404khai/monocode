# MonoCode mobile design language

The desktop app is the source of truth; mobile adapts its workflows to iOS. Follow this scheme for every screen.

## Foundations

- Neutral surfaces: light canvas #F7F7F7 and text #2E2E2E; dark canvas #171717 and text #EBEBEB. These map to desktop base/content HSL tokens.
- One functional accent: desktop blue hsl(211 92% 62%), #459BF7. Reserve it for working state, selection, links, and pull requests. Amber indicates input needed; green indicates completion. No purple accents, decorative gradients, or AI-themed dashboard cards.
- System typography: titles 34pt bold; session titles 17pt medium; metadata 12pt regular. Monospaced text is for code and terminal content.
- SF Symbols for iOS controls. Provider artwork comes unchanged from desktop src/assets/providers, bundled as mobile-owned SVG data, including Codex's original purple gradient. Provider branding is the exception to the neutral/blue application palette.
- App identity uses the existing desktop MonoCode Icon Composer asset, including its black background and terminal/pixel mark. iOS applies its native icon shape; do not bake in a second rounded frame.
- Low-contrast borders, 4pt spacing increments, subtle press feedback. Respect system appearance, safe areas, Dynamic Type, reduced motion, and explicit status labels.

## Sessions home

Use a large Sessions title and project-scoped threads, not global Pinned/Recent buckets. Each project header has its desktop pixel mascot beside its name. Keep workspace/worktree identities in the model and branch metadata, without extra workspace/worktree headings on the screen. Within each project, named collapsible folders sit above a collapsible Pinned block, followed by ordinary threads. Groups use neutral rounded shells, member counts, a folder icon when collapsed and downward chevron when open, and a New session action that carries project/branch/group context into the preview composer. Folder and pinned rows use a compact title/time and branch layout; ordinary rows show the model above the title. The fixture contains exactly one Mobile folder with two chats and one pinned chat in monocode; other projects have one or two ordinary chats. The top toolbar contains Inbox and Filter (line.3.horizontal.decrease.circle), not an overflow menu. Use Expo Router NativeTabs for the operating system's liquid-glass Sessions/Settings bar and detached Search tab; do not replace it with opaque custom tab pills.

Rows show provider SVG/model and trailing state/time, a prominent two-line title, then project/branch metadata and an optional pull-request badge. Include varied provider branding rather than a Codex-only list. Working state uses the desktop TerminalSpinner's exact ten frames and 80ms cadence rendered as pixel cells, looping while visible and active unless reduced motion is enabled. Reuse desktop projectMascot's stable assignment (or an explicit saved mascot) and tabGroupColor's palette/hash in project headers; never use first-letter project logos. Titles and branches truncate independently. No host summary card, colored project tiles, or top filter chips. Project, workspace, and thread-group names are searchable; filtering expands matching hierarchy paths.

Use a nested native Stack with headerLargeTitleEnabled, automatic scroll-content insets, and scrollEdgeEffects.top set to soft. The operating system collapses the large title into the centered navigation title as the list scrolls; do not simulate this with a second text label or overlay a separate header blur. Inbox and Filter are native Stack.Toolbar items with separate glass backgrounds and a 12pt spacer. The New session bar belongs in NativeTabs.BottomAccessory, above the native tab bar rather than absolutely positioned over the screen. Keep sheet/draft state outside the accessory's regular/inline copies.

Replace the scenic reference background with the actual desktop empty-session Pacman engine, ported to mobile/src/features/arcade/model with only its imports adapted to portable provider identifiers and mascot artwork. Preserve maze generation, automatic play, ghost behavior, scoring, lives, provider pickups, and speech. Render through native SVG using the desktop 6px cells/1px gaps and sprite geometry. Bucket grid paths to avoid thousands of native elements. Pause when the app is backgrounded, the tab is unfocused, or reduced motion is enabled. Keep shared/ui/PacmanBackground.tsx as the original static SVG fallback, but use the live game on the home screen and new-session sheet.

Keep the home arcade stationary behind scrolling rows, anchored at the top of the viewport with a transparent bottom fade. Its native-driven counter-scroll transform preserves the root ScrollView required for automatic navigation-title and scroll-edge tracking. The fixture preview supports search, collapsible sections, working/needs-input/completed filters, and a native Inbox sheet. Loading, offline, and error states remain transport work.

## New session

Follow assets/ios/new_session.jpeg with a native SwiftUI BottomSheet, large detent, system drag indicator, close control, and a bottom composer. The top-to-middle area contains the same live Pacman game. Center a provider mark and “What should we work on in monocode?” above the task input. Adapt the desktop composer's three rows: checkout/branch/context, multiline prompt, then attachment/model/reasoning/access controls and send. Use native glass menus and fixed-size glass icon buttons; allow controls to wrap on narrow screens. Keep keyboard avoidance and draft/configuration state across sheet presentations.

On phones, keep the bottom composer controls to attachment, model/reasoning, and send; omit the extra access picker. The model menu fits its contents with an amber shield after the effort, and send uses white-tinted glass with a dark arrow. Below the composer, use the desktop compact usage strip and Terminal action. Refresh is a small plain icon immediately beside the usage summary, not another glass button. Fade the arcade to transparent at the bottom on both the sessions home and the new-session sheet. Usage opens a native sheet with account, 5-hour/weekly limits, remaining percentages, reset times, and banked resets. Terminal opens a read-only native sheet with monospaced sample output. These are fixture previews: refreshing usage, using resets, submitting sessions, and executing host commands require a connected host and must not be simulated as successful actions.

## Inbox, Notes, and Automations

The new-session welcome sits toward the bottom of a 440pt arcade hero with 30pt text. While typing, use a 280pt hero and 26pt text to retain keyboard room. Do not autofocus the prompt on presentation: the expanded welcome should stay visible until the user chooses to type.

The composer plus opens a native SwiftUI Menu, following assets/reference/composer_add.png: Upload file, Plan mode, Operator, and Orchestrator v1 with semantic symbols and descriptions. Draft modes are mutually exclusive and can be toggled off; they survive closing the sheet and are labeled as preview. Upload and actual mode execution require a connected host. Keep the trigger a fixed 44pt square glass button, not a stretched text menu.

The project name in the new-session question is a tappable project switcher. On iOS it opens a native sheet with SwiftUI search and List rows, selected-project checkmark, desktop pixel mascots, and secondary host parent paths, following assets/reference/project_picker.png. Keep the selected project first; search names and paths. Switching projects preserves the prompt while replacing branch context and removing an unrelated folder context. Current session projects—including user additions—remain available alongside reference fixtures. New project requires a host rather than creating a folder on the phone.

Inbox follows assets/reference/inbox.png: GitHub connection header, compact search/filter/read/refresh controls, issue state/number/time, prominent title, project mascot/repository, and colored label chips. Bug is red and enhancement is blue; other labels retain validated repository hex colors, as on desktop. The fixture filter supports open, closed, bug, enhancement, unread, and text search. Read state is local to the preview; refresh and connection actions must not claim live access.

Issue detail follows issue_comments.png, issue_comments2.png, and issue_tag.png: sticky issue header, status, author/timestamps, Send to agent/Ask/GitHub actions, label chips, description sections, bordered comment cards with quotes, and a comment draft. Agent actions prefill the existing native new-session sheet; comments are not posted. Fixture author identities and conversation content are explicit samples, not fetched GitHub data.

Notes and Automations use native bottom tabs and large-title stacks. Notes provide searchable sample notes and an in-memory editor; edits are not persisted or synced. Automations show desktop-derived template names and schedule vocabulary as read-only samples, with no jobs running on the phone. Keep user-added session fixtures and artwork intact. The new-session accessory uses the same desktop-frame working pixel animation as thread rows.

## Settings catalog

Port the complete desktop settings navigation in its existing App, Agents, and Workspace groups: General, Connections, Appearance, Keybindings, Chat, Providers, MCP, Skills, Inbox, Archive, and Worktrees. The portable catalog includes all 44 indexed desktop settings and 46 shortcut reference rows, including platform-specific desktop entries. All host-managed controls are read-only references for now; do not imply desktop preferences or shortcuts apply on iOS. Preserve search, section descriptions, provider marks, and clear empty states.

## Sources

- Desktop tokens: ../src/styles/index.css
- Desktop provider artwork: ../src/assets/providers/
- Desktop arcade geometry: ../src/features/terminal/ui/TerminalGridBackground.tsx
- Desktop game: ../src/features/terminal/arcade/pacmanArcade.ts
- Desktop settings catalog: ../src/features/settings/model/settings.ts
- Desktop composer: ../src/features/sessions/ui/Composer.tsx
- Desktop usage: ../src/app/shell/UsageProviderChip.tsx
- Mobile tokens: src/shared/theme/theme.ts
- Reference: assets/ios/session_list.jpeg
- New-session reference: assets/ios/new_session.jpeg
- Usage/terminal reference: assets/reference/usage_with_terminal.png
- Expanded usage reference: assets/reference/expanded_usage.png
