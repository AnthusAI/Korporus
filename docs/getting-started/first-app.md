# Your First App

This guide walks you through creating a new Korporus app from scratch.

## 1. Create the Package

Create a new directory in `packages/`:

```
packages/my-app/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  app-manifest.json
  icon.svg
  src/
    bootstrap.ts
    main.tsx
    store.ts
    components/
      MyTitlebar.tsx
      MyMain.tsx
      MySettings.tsx
```

## 2. Configure Module Federation

In `vite.config.ts`, set up the MF remote:

```typescript
federation({
  name: "my_app",
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
})
```

## 3. Register Web Components

In `bootstrap.ts`, register your three slot components:

```typescript
import { registerCustomElement } from "@korporus/web-component-wrapper";

registerCustomElement("my-app-titlebar", MyTitlebar);
registerCustomElement("my-app-main", MyMain);
registerCustomElement("my-app-settings", MySettings);
```

## 4. Register with the Shell

Add a manifest JSON to `apps/shell/public/manifests/my-app.json` and add it to the `MANIFEST_URLS` array in `apps/shell/src/config/apps.ts`.

See the [App Manifest Schema](../reference/app-manifest-schema) for the full manifest format.
