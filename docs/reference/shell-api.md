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

## Dev Manifest Rewrite Plugin

**File**: `apps/shell/vite.config.ts`

In dev mode, the `devManifestRewritePlugin` intercepts requests to `/manifests/*.json` and rewrites the `remoteEntry` field to point at the app's MF manifest on its own dev server. This is required because Vite dev server virtual modules can only be loaded from their own origin.

The plugin auto-discovers all app origins from `@korporus/platform-config`:

```typescript
import { getDevRemoteOrigins } from "@korporus/platform-config";

const devRemoteOrigins = getDevRemoteOrigins();
// { "hello-app": "http://localhost:3001", "docs-app": "http://localhost:3002" }
```

To add a new app, register it in `packages/platform-config/src/ports.ts` — the shell picks it up automatically.
