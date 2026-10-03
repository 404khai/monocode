# MonoCode mobile

An iOS-first reimagining of MonoCode for phones, using React Native, Expo, TypeScript, and Expo UI with SwiftUI on iOS and Jetpack Compose on Android.

## Current state

The Expo SDK 57 runtime uses Expo Router native liquid-glass tabs, Expo UI SwiftUI bottom sheets, and native iOS symbols. The fixture-backed sessions home separates threads by project, with collapsible folders above pinned chats and ordinary threads. Workspace/worktree context stays in branch metadata rather than extra headings. It follows MonoCode desktop's grayscale/blue palette with a native collapsing navigation title and soft top scroll-edge effect. Project headers use desktop pixel mascots, threads show varied provider SVGs, and working indicators loop through the desktop spinner frames. The actual desktop Pacman engine animates the home and new-session sheet. Inbox and status filtering are in the toolbar, and Settings includes the complete desktop navigation and row catalog. The new-session composer adapts the desktop layout, with expanded usage and a read-only terminal preview underneath. See [the design language](./design/README.md). Host connectivity and session submission remain preview-only.

Inbox now previews GitHub issues with search, filters, colored labels, issue details, quoted comments, and agent-draft actions. Notes and Automations have native tabs: notes are editable in memory, while automation schedules are read-only samples. GitHub comments, provider connections, and automation execution require a connected host. User-added sessions and artwork are preserved.

## Run locally

```sh
cd /Users/admin/Developer/monocode/mobile
npm install
npm run ios -- --device E5FF3AAA-2A48-428E-875B-6A7C1202572A
```

The device ID above targets the local **iPhone 17 · iOS 27.0** simulator. The first run generates the ignored native project and performs a full Xcode build; subsequent runs use Xcode's build cache.

When the development build is already installed and only JavaScript or TypeScript changed, start Metro without rebuilding native code:

```sh
cd /Users/admin/Developer/monocode/mobile
npx expo start --dev-client
```

Then press `i` in the Expo terminal to reopen the iOS app. After changing native dependencies, the app icon, or `app.json` plugins, regenerate the native configuration and rebuild:

```sh
npx expo prebuild --platform ios
npm run ios -- --device E5FF3AAA-2A48-428E-875B-6A7C1202572A
```

Expo UI's SwiftUI controls require this development build and are not available in Expo Go. Static checking is available through `npm run typecheck`; `npm run test:models` checks the ported Pacman engine at phone-sized grids and the settings catalog.

Read [AGENTS.md](./AGENTS.md) before working here.

## Layout

```text
mobile/
  AGENTS.md
  assets/                 App-owned visual assets
  design/                 Reference analysis and design decisions
  src/
    app/                  Expo Router routes and layouts
    features/             Feature-owned screens, models, hooks, and data
    fixtures/             Deterministic data for UI development
    integrations/host/    Future MonoCode host client boundary
    platform/             Device capability adapters
    shared/
      lib/                Portable utilities
      theme/              Semantic design tokens
      ui/                 Reusable native UI components
```

Create feature folders as the screens take shape, following the desktop's vocabulary where useful (for example, `projects`, `sessions`, `files`, `source-control`, and `settings`). Keep platform-specific rendering beside shared feature logic.

Mobile owns its package manifest, lockfile, and Expo configuration. The root package remains the desktop app. Generated native projects are managed through Expo prebuild and remain uncommitted.

The desktop implementation in [`../src/features/`](../src/features/) supplies workflow context. [`../host/`](../host/) and [remote access documentation](../docs/remote-access.md) supply integration context; mobile connectivity is not implemented or decided by this scaffold.
