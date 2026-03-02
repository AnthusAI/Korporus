# App Manifest Schema

The app manifest is a JSON file that describes a Korporus application to the shell.

## Full Schema

```typescript
interface AppManifest {
  /** Unique app identifier, kebab-case (e.g. "my-app") */
  id: string;

  /** Human-readable display name */
  name: string;

  /** URL to the app icon (SVG recommended) */
  icon: string;

  /** Semver version string */
  version: string;

  /** URL to the Module Federation remote entry */
  remoteEntry: string;

  /** Map of slot names to custom element tag names */
  slots: {
    titlebar?: string;
    main?: string;
    settings?: string;
  };
}
```

## Validation Rules

- `id`: Must be a non-empty string
- `name`: Must be a non-empty string
- `icon`: Must be a non-empty string
- `version`: Must be a non-empty string
- `remoteEntry`: Must be a non-empty string
- `slots`: Must be an object with at least one key from `["titlebar", "main", "settings"]`
- Slot values must be non-empty strings (custom element tag names)

## Example

```json
{
  "id": "hello-app",
  "name": "Hello World",
  "icon": "/manifests/hello-app-icon.svg",
  "version": "1.0.0",
  "remoteEntry": "/apps/hello/remoteEntry.js",
  "slots": {
    "titlebar": "hello-app-titlebar",
    "main": "hello-app-main",
    "settings": "hello-app-settings"
  }
}
```

## TypeScript

Import the types from `@korporus/app-manifest`:

```typescript
import { type AppManifest, parseManifest, validateManifest } from "@korporus/app-manifest";
```

- `parseManifest(raw: unknown): AppManifest` — Validates and returns a typed manifest. Throws on invalid input.
- `validateManifest(raw: unknown): ValidationResult` — Returns `{ valid: true, manifest }` or `{ valid: false, errors }`.
