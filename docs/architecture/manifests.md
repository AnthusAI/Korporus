# App Manifests

Every Korporus app has a manifest — a JSON file that tells the shell how to find and render the app.

## Schema

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

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier, kebab-case (e.g. `"my-app"`) |
| `name` | string | Yes | Human-readable display name |
| `icon` | string | Yes | URL to the app icon (SVG recommended) |
| `version` | string | Yes | Semver version string |
| `remoteEntry` | string | Yes | URL to the Module Federation remote entry |
| `slots` | object | Yes | Map of slot names to custom element tag names |

## Slot Names

The `slots` object uses these keys:

- `titlebar` — Header bar component
- `main` — Primary content component
- `settings` — Settings/search sidebar component (optional but the key must exist)

At least one slot must be defined.

## Where Manifests Live

### In the Shell

The shell serves manifests from `apps/shell/public/manifests/`. Each app gets its own JSON file and icon SVG.

### In the App

Each app also has an `app-manifest.json` in its package root. This is used for standalone development and documentation — the shell doesn't read it directly.

## Dev vs Production URLs

In development, the `devManifestRewritePlugin` in the shell's Vite config rewrites the `remoteEntry` field to point at the app's MF manifest on its own dev server. See [Module Federation](./module-federation) for details.

In production, manifests use relative URLs that resolve against the container's single origin.
