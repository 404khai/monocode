# MonoCode mobile

These instructions apply to `mobile/` and its descendants.

## Product direction

- Build MonoCode for mobile with React Native, Expo, TypeScript, and Expo UI (`@expo/ui`): SwiftUI on iOS and Jetpack Compose on Android.
- Start with iOS. Keep platform boundaries clear so Android can follow without duplicating feature logic.
- Reimagine the desktop workflows for a phone: projects, agent sessions, composing prompts, reviewing changes, and responding to approvals. Optimize for developers doing real work on mobile.
- User-provided reference images are inspiration for interaction, hierarchy, spacing, and visual quality. Do not reproduce their layouts, branding, or decorative details wholesale. Explain how a design serves MonoCode's workflows.
- Inspect the corresponding desktop feature before implementing its mobile counterpart. Preserve useful behavior and terminology while adapting navigation and information density to touch.
- Establish the foundation first; wait for the user's iOS references before choosing the initial screen designs.

## Structure and boundaries

- `src/app/`: Expo Router route files and layouts only. Keep routes thin and compose screens from features. Do not put helpers or fixtures here.
- `src/features/<feature>/`: feature screens, components, hooks, models, and data access. Add `ui/`, `model/`, `hooks/`, and `data/` only when needed; colocate meaningful tests.
- `src/shared/ui/`: reusable native UI primitives without feature behavior. Use `.ios.tsx` and `.android.tsx` when platform implementations differ; share their props and behavior.
- `src/shared/theme/`: semantic color, typography, spacing, and motion tokens.
- `src/shared/lib/`: small platform-independent utilities.
- `src/platform/`: adapters for device capabilities and native lifecycle. Keep OS APIs out of feature models.
- `src/integrations/host/`: the future boundary to MonoCode's remote host; inspect `../host/` and `../docs/remote-access.md` before implementing a transport.
- `src/fixtures/`: deterministic sample data for UI development, with explicit loading, empty, error, offline, and populated states. Keep fixtures separate from live integrations.
- `assets/`: app-owned images, fonts, and icons. `design/`: reference notes and design decisions, not runtime assets.
- Keep mobile dependencies and configuration inside `mobile/`. Do not migrate the desktop to a workspace or refactor shared code without a concrete need.
- Do not import desktop DOM components, CSS, Tauri APIs, Node process code, or provider executables into the mobile bundle. Reuse portable domain code only after checking its dependency boundary.

## Implementation

- Verify current official Expo documentation when bootstrapping; select a compatible stable Expo SDK, React Native, React, Expo Router, and Expo UI set. Use Expo's dependency installer and commit the mobile lockfile.
- Prefer Expo UI's native controls and containers where appropriate. Consult the installed SDK's SwiftUI and Jetpack Compose APIs rather than assuming parity or inventing props.
- Use React Native for shared composition where it fits. Keep native host/layout boundaries explicit; avoid premature wrappers that erase useful platform behavior.
- Plan for native development builds. Validate Expo UI on the actual target platform, rather than treating web rendering as proof of native behavior.
- Keep generated `ios/` and `android/` directories out of version control initially; express native configuration through Expo configuration/plugins. Revisit only for a concrete native requirement.
- During UI work, use fixture-backed screens without pretending remote actions are connected. Do not assume desktop CLI execution or SSH setup can run directly on a phone.
- Make safe areas, keyboard avoidance, accessible labels, Dynamic Type/font scaling, sufficient contrast, touch targets, and reduced motion part of each screen. Preserve drafts through navigation and transient disconnection when state handling is implemented.
- Prioritize responsive scrolling for long transcripts and diffs, clear agent status, and easily reachable primary actions. Avoid shrinking desktop panes into a phone screen.

## Validation and collaboration

- Work on the mobile branch in the user's fork. Do not open an upstream PR or publish a mobile release unless requested.
- Keep this file and `README.md` aligned with implemented tooling. Do not document commands as working before the runtime exists.
- For runtime changes, run the available mobile typecheck and relevant checks; add tests for meaningful state or integration behavior. Visually verify changed screens on iOS, and Android when its implementation changes.
- Report exactly what was checked and what remains unverified. Documentation and folder-only changes need diff/structure checks, not desktop build tests.

## Official references

- Expo UI: https://docs.expo.dev/versions/latest/sdk/ui/
- SwiftUI: https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/
- Jetpack Compose: https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/
- Expo Router: https://docs.expo.dev/router/introduction/
