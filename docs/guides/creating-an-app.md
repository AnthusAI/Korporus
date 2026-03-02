# Creating an App

This guide covers the full process of adding a new federated app to Korporus.

## Overview

A Korporus app is a pnpm workspace package that:

1. Exposes three Web Components (titlebar, main, settings)
2. Bundles them as a Module Federation remote
3. Registers with the shell via a manifest JSON

## Step 1: Register Your Port

Before anything else, register your app in the central port registry at `packages/platform-config/src/ports.ts`:

```typescript
const PORT_REGISTRY: Record<string, PortEntry> = {
  shell:       { dev: 3000, preview: 4000 },
  "hello-app": { dev: 3001, preview: 4001 },
  "docs-app":  { dev: 3002, preview: 4002 },
  "my-app":    { dev: 3003, preview: 4003 },  // ← add your app
};
```

This is the **single source of truth** for all port assignments. The shell's dev manifest rewrite plugin will automatically discover your app — no manual wiring needed.

## Step 2: Create the Package

```bash
mkdir -p packages/my-app/src/components
```

### package.json

```json
{
  "name": "@korporus/app-my-app",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@korporus/web-component-wrapper": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@korporus/platform-config": "workspace:*",
    "@module-federation/enhanced": "^0.7.0",
    "@module-federation/vite": "^1.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "*",
    "vite": "^6.0.0"
  }
}
```

Note: no `--port` flags in dev scripts — port assignment comes from `@korporus/platform-config`.

## Step 3: Configure Vite and Module Federation

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { getPortEntry, getDevOrigin } from "@korporus/platform-config";

const APP_ID = "my-app";
const ports = getPortEntry(APP_ID);

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "my_app",           // underscores, not hyphens
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./bootstrap": "./src/bootstrap.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        zustand: { singleton: true },
      },
      dts: false,
    }),
  ],
  server: {
    port: ports.dev,
    strictPort: true,      // Fail if port taken, don't silently increment
    cors: true,
    origin: getDevOrigin(APP_ID),
  },
  preview: {
    port: ports.preview,
    cors: true,
  },
});
```

## Step 4: Write Your Components

Create your three slot components. They're just React components — no special API:

```typescript
// src/components/MyMain.tsx
export function MyMain() {
  return <div style={{ padding: 24 }}>Hello from my app!</div>;
}
```

Use Zustand for state shared across slots — see [State Management](./state-management).

## Step 5: Register as Web Components

```typescript
// src/bootstrap.ts
import { registerCustomElement } from "@korporus/web-component-wrapper";
import { MyTitlebar } from "./components/MyTitlebar";
import { MyMain } from "./components/MyMain";
import { MySettings } from "./components/MySettings";

registerCustomElement("my-app-titlebar", MyTitlebar);
registerCustomElement("my-app-main", MyMain);
registerCustomElement("my-app-settings", MySettings);
```

## Step 6: Register with the Shell

1. Create `apps/shell/public/manifests/my-app.json`:

```json
{
  "id": "my-app",
  "name": "My Application",
  "icon": "/manifests/my-app-icon.svg",
  "version": "1.0.0",
  "remoteEntry": "/apps/my-app/remoteEntry.js",
  "slots": {
    "titlebar": "my-app-titlebar",
    "main": "my-app-main",
    "settings": "my-app-settings"
  }
}
```

2. Add the manifest URL to `apps/shell/src/config/apps.ts`

That's it for the shell — the `devManifestRewritePlugin` automatically discovers all apps registered in `@korporus/platform-config`, so no manual port wiring is needed.

## Step 7: Install and Run

```bash
pnpm install
cd packages/my-app && pnpm dev   # Terminal 1
cd apps/shell && pnpm dev         # Terminal 2
```

Your app should appear on the shell's home screen.
