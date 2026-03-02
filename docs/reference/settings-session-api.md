# Settings Session API

`@korporus/app-shell-ui` defines the shell-to-app settings session contract.

## Events

- `korporus:settings:session-state`
- `korporus:settings:save`
- `korporus:settings:cancel`

### `korporus:settings:session-state`

Dispatched by an app settings component to the host element with current session metadata.

```ts
interface SettingsSessionState {
  dirty: boolean;
  valid: boolean;
  saving?: boolean;
}
```

Event payload:

```ts
CustomEvent<{ state: SettingsSessionState }>
```

### `korporus:settings:save`

Dispatched by the shell to the mounted settings custom element when the user clicks **Save**.

### `korporus:settings:cancel`

Dispatched by the shell to the mounted settings custom element when the user clicks **Cancel**.

## Hook: `useSettingsSessionBridge`

```ts
useSettingsSessionBridge({
  state: { dirty, valid, saving },
  onSave: async () => {
    // commit buffered settings
  },
  onCancel: () => {
    // revert draft to persisted values
  },
});
```

The hook uses `useHostElement()` from `@korporus/web-component-wrapper` to bind event listeners and dispatch session state for the current custom element host.
