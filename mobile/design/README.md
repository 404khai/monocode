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

Match assets/ios/session_list.jpeg structurally: large Sessions title, Pinned and Recent headers with counts, unboxed two-line rows, and a floating New session pill. The top toolbar contains Inbox and Filter (line.3.horizontal.decrease.circle), not an overflow menu. Use Expo Router NativeTabs for the operating system's liquid-glass Sessions/Settings bar and detached Search tab; do not replace it with opaque custom tab pills.

Rows contain provider logo, single-line title, trailing state/time, then a colored desktop pixel mascot/project name, branch, and optional pull-request badge. Reuse desktop projectMascot's stable assignment (or an explicit saved mascot) and tabGroupColor's palette/hash; never use first-letter project logos. Titles and branches truncate independently. No host summary card, colored project tiles, top filter chips, or grouped row containers.

Toolbar controls each use an independent 44×44pt SwiftUI host, a 12pt gap, and circular glass applied after sizing. Use an icon-only menu label so intrinsic text and padded glass button styles cannot stretch the controls. The New session bar belongs in NativeTabs.BottomAccessory, above the native tab bar rather than absolutely positioned over the screen. Keep sheet/draft state outside the accessory's regular/inline copies.

Replace the scenic reference background with the actual desktop empty-session Pacman engine, ported to mobile/src/features/arcade/model with only its imports adapted to portable provider identifiers and mascot artwork. Preserve maze generation, automatic play, ghost behavior, scoring, lives, provider pickups, and speech. Render through native SVG using the desktop 6px cells/1px gaps and sprite geometry. Bucket grid paths to avoid thousands of native elements. Pause when the app is backgrounded, the tab is unfocused, or reduced motion is enabled. Keep shared/ui/PacmanBackground.tsx as the original static SVG fallback, but use the live game on the home screen and new-session sheet.

The fixture preview supports search, collapsible sections, working/needs-input/completed filters, and a native Inbox sheet. Loading, offline, and error states remain transport work.

## New session

Follow assets/ios/new_session.jpeg with a native SwiftUI BottomSheet, large detent, system drag indicator, close control, and a bottom composer. The top-to-middle area contains the same live Pacman game. Center a provider mark and “What should we work on in monocode?” above the task input. Keep keyboard avoidance, provider choice, and a new-worktree/current-branch toggle. Draft text survives closing and reopening the sheet. Submission remains an explicit preview until a host is connected.

## Settings

Port the complete desktop settings navigation in its existing App, Agents, and Workspace groups: General, Connections, Appearance, Keybindings, Chat, Providers, MCP, Skills, Inbox, Archive, and Worktrees. The portable catalog includes all 44 indexed desktop settings and 46 shortcut reference rows, including platform-specific desktop entries. All host-managed controls are read-only references for now; do not imply desktop preferences or shortcuts apply on iOS. Preserve search, section descriptions, provider marks, and clear empty states.

## Sources

- Desktop tokens: ../src/styles/index.css
- Desktop provider artwork: ../src/assets/providers/
- Desktop arcade geometry: ../src/features/terminal/ui/TerminalGridBackground.tsx
- Desktop game: ../src/features/terminal/arcade/pacmanArcade.ts
- Desktop settings catalog: ../src/features/settings/model/settings.ts
- Mobile tokens: src/shared/theme/theme.ts
- Reference: assets/ios/session_list.jpeg
- New-session reference: assets/ios/new_session.jpeg
