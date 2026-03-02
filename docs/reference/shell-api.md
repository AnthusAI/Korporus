# Shell API

The shell provides several services and integration points for federated apps.

## Manifest Discovery

### `MANIFEST_URLS`

**File**: `apps/shell/src/config/apps.ts`

A static array of manifest JSON URLs. Add your app's manifest URL here to register it with the shell.

```typescript
export const MANIFEST_URLS: string[] = [
  "/manifests/hello-app.json",
  "/manifests/docs-app.json",
  "/manifests/settings-app.json",
];
```

### `loadManifests()`

**File**: `apps/shell/src/services/manifestLoader.ts`

Fetches all manifests in parallel, validates each one, and returns the valid set. Invalid or unreachable manifests are skipped with a console warning.

```typescript
async function loadManifests(): Promise<AppManifest[]>
```

## Module Loading

### `loadAppModule(remoteId, remoteEntry)`

**File**: `apps/shell/src/services/moduleLoader.ts`

Registers a remote with the MF runtime and dynamically imports its `./bootstrap` module.

```typescript
async function loadAppModule(remoteId: string, remoteEntry: string): Promise<void>
```

- `remoteId`: MF remote name (underscores, e.g. `"hello_app"`)
- `remoteEntry`: URL to the remote entry (absolute or relative)

### `toRemoteId(appId)`

Converts a kebab-case app ID to a valid MF remote name: `"hello-app"` → `"hello_app"`.

## Registry Store

**File**: `apps/shell/src/store/registry.ts`

Zustand store holding all discovered app manifests.

```typescript
const useRegistry: () => { apps: AppManifest[] }
const useAppManifest: (id: string) => AppManifest | undefined
```

## System Settings Provider

The shell initializes `window.korporus.systemSettings` as the canonical provider for appearance settings:

```typescript
interface KorporusSystemSettingsApi {
  getAppearance(): AppearanceSettingsV1;
  setAppearance(
    next:
      | AppearanceSettingsV1
      | ((prev: AppearanceSettingsV1) => AppearanceSettingsV1)
  ): AppearanceSettingsV1;
  subscribeAppearance(
    listener: (next: AppearanceSettingsV1) => void
  ): () => void;
}
```

Apps should consume this through `@korporus/system-settings`:

```typescript
readAppearance()
setAppearance(...)
subscribeAppearance(...)
```

## Settings Frame Contract

In settings contexts (`/app/:appId/settings` and `/app/settings-app`), the shell provides:

- Top fixed menu bar
- Bottom fixed `Cancel` / `Save` action bar
- App settings custom element in the middle content region

The shell/action bar contract uses events from `@korporus/app-shell-ui`:

- `korporus:settings:save` (shell -> app settings component)
- `korporus:settings:cancel` (shell -> app settings component)
- `korporus:settings:session-state` (app settings component -> shell)

See [Settings Session API](./settings-session-api) for payload details and hook usage.

## Help Menu Contract

In app views, the shell adds a final top-level **Help** menu with one v1 item:

- `[App Name] Help`

Selection routes to the centralized docs app with context parameters:

```text
/app/docs-app?contextAppId=<app-id>&entry=app-help
```

## Dev Manifest Rewrite Plugin

**File**: `apps/shell/vite.config.ts`

In dev mode, the `devManifestRewritePlugin` intercepts requests to `/manifests/*.json` and rewrites the `remoteEntry` field to point at the app's MF manifest on its own dev server. This is required because Vite dev server virtual modules can only be loaded from their own origin.

The plugin auto-discovers all app origins from `@korporus/platform-config`:

```typescript
import { getDevRemoteOrigins } from "@korporus/platform-config";

const devRemoteOrigins = getDevRemoteOrigins();
// { "hello-app": "http://localhost:3001", "docs-app": "http://localhost:3002", "settings-app": "http://localhost:3003" }
```

To add a new app, register it in `packages/platform-config/src/ports.ts` — the shell picks it up automatically.
