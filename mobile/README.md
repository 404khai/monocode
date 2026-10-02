# MonoCode mobile

An iOS-first reimagining of MonoCode for phones, using React Native, Expo, TypeScript, and Expo UI with SwiftUI on iOS and Jetpack Compose on Android.

## Current state

Folder structure and contributor guidance only. The Expo runtime, dependencies, routes, and screens have not been initialized. There are no mobile run commands yet. The next step is to review the user's iOS references and establish a MonoCode-specific design direction before building screens.

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

Mobile will own its package manifest, lockfile, and Expo configuration when bootstrapped. The root package remains the desktop app. Generated native projects will initially be managed through Expo prebuild.

The desktop implementation in [`../src/features/`](../src/features/) supplies workflow context. [`../host/`](../host/) and [remote access documentation](../docs/remote-access.md) supply integration context; mobile connectivity is not implemented or decided by this scaffold.
