# System Settings API

`@korporus/system-settings` is the shared contract for system-wide appearance settings across the shell and federated apps.

## Scope (v1)

Appearance settings only:

- `mode`: `"light" | "dark" | "system"`
- `theme`: `"neutral" | "cool" | "warm"`
- `motion`: `"full" | "reduced" | "off"`

## Canonical Type

```typescript
interface AppearanceSettingsV1 {
  schemaVersion: 1;
  mode: "light" | "dark" | "system";
  theme: "neutral" | "cool" | "warm";
  motion: "full" | "reduced" | "off";
}
```

## Primary App API

Use these helpers from `@korporus/system-settings`:

```typescript
readAppearance(): AppearanceSettingsV1
setAppearance(next: AppearanceSettingsV1 | ((prev: AppearanceSettingsV1) => AppearanceSettingsV1)): AppearanceSettingsV1
subscribeAppearance(listener: (next: AppearanceSettingsV1) => void): () => void
```

Apps should use this API instead of reading local storage directly.

## Shell Provider Contract

The shell installs this API on `window`:

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

Path: `window.korporus.systemSettings`

## Events

- Canonical event: `korporus:system-settings:appearance-changed`
  - Payload: `CustomEvent<{ appearance: AppearanceSettingsV1 }>`
- Legacy compatibility event: `korporus:appearance-change`

## Persistence

- Storage key: `korporus.appearance.v1`
- The package includes fallback behavior so standalone app hosts can still read, write, and subscribe without the shell provider.
