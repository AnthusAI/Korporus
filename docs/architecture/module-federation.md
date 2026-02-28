# Module Federation

Korporus uses [Module Federation 2.0](https://module-federation.io/) (`@module-federation/vite`) to load app code at runtime without build-time coupling between the shell and apps.

## Key Concepts

### Host and Remote

- The **shell** is the MF *host* — it consumes remote modules
- Each **app** is an MF *remote* — it exposes modules for the host to import

### Remote Entry

Each app produces a `remoteEntry.js` file during build. This file is the entry point that the MF runtime loads to discover what the remote exposes.

### Shared Dependencies

React, ReactDOM, and Zustand are configured as **shared singletons**. This means the shell and all apps use the same instance of these libraries at runtime — no duplicate React or conflicting state.

```typescript
shared: {
  react: { singleton: true, requiredVersion: "^19.0.0" },
  "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
  zustand: { singleton: true },
}
```

## Dev vs Production

### Development Mode

In dev mode, each app runs its own Vite dev server on a separate port:

| Component | Port |
|-----------|------|
| Shell     | 3000 |
| Hello App | 3001 |
| Docs App  | 3002 |

The shell's Vite config includes a `devManifestRewritePlugin` that rewrites the `remoteEntry` field in manifest JSON files to point at the app's `mf-manifest.json` on its own dev server origin. This is necessary because Vite dev server remoteEntry files contain absolute virtual-module paths (like `/node_modules/.vite/deps/...`) that only resolve correctly on the app's own server.

Each app must also set `server.origin` in its Vite config so that the MF manifest's `publicPath` is absolute:

```typescript
server: {
  port: 3001,
  cors: true,
  origin: "http://localhost:3001",
}
```

### Production (Container)

In the Docker container, nginx serves everything from a single origin:

- `/` — Shell
- `/apps/hello/` — Hello app built assets
- `/apps/docs/` — Docs app built assets
- `/manifests/` — App manifests

No manifest rewriting is needed. The manifests use relative URLs like `/apps/hello/remoteEntry.js` which resolve naturally against the single origin.

## The Bootstrap Pattern

Every Korporus app exposes exactly one module: `./bootstrap`. This module is imported as a side effect — it registers the app's Web Components and then the MF runtime is done. No return value, no function to call.

```typescript
// vite.config.ts
exposes: {
  "./bootstrap": "./src/bootstrap.ts",
}
```
