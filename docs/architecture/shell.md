# Shell

The shell (`apps/shell/`) is the Korporus host application. It provides the OS-like chrome, discovers apps via manifests, and loads them at runtime using Module Federation.

## Layout

The shell uses a fixed layout:

```
┌──────────────────────────────────────┐
│            Titlebar Slot             │
├─────────────────────────┬────────────┤
│                         │  Settings  │
│       Main Slot         │   Slot     │
│                         │ (optional) │
│                         │            │
└─────────────────────────┴────────────┘
```

- **Titlebar**: Fixed 56px height, spans full width
- **Main**: Fills remaining vertical space
- **Settings**: 240px sidebar, slides in from the right via the shell chrome's settings button

## App Discovery

On startup, the shell fetches manifests from a static list of URLs defined in `src/config/apps.ts`:

```typescript
export const MANIFEST_URLS: string[] = [
  "/manifests/hello-app.json",
  "/manifests/docs-app.json",
];
```

Each manifest is validated against the `@korporus/app-manifest` schema. Valid manifests are stored in a Zustand registry at `src/store/registry.ts`.

## App Loading

When a user clicks an app icon on the home screen:

1. The shell navigates to `/app/{app-id}`
2. `AppView` calls `loadAppModule(remoteId, remoteEntry)` from `src/services/moduleLoader.ts`
3. The module loader registers the remote with the MF runtime and dynamically imports `{remote}/bootstrap`
4. The bootstrap module registers the app's Web Components as a side effect
5. `AppView` creates custom elements for each slot and mounts them into the layout

## Home Screen

The home screen (`src/pages/Home.tsx`) displays a grid of app icons from the registry. Each icon links to `/app/{app-id}`.

## Shell Chrome

`ShellChrome` wraps the app view and provides:
- A back button to return to the home screen
- A settings toggle button (gear icon) that slides in the settings panel
- The settings panel renders the app's settings slot (if defined in the manifest)
