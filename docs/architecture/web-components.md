# Web Components

Web Components are the boundary contract between the Korporus shell and federated apps. Each app registers custom HTML elements that the shell mounts into its layout slots.

## The Three Slots

Every Korporus app can provide up to three slots:

| Slot | Tag Name Convention | Purpose |
|------|-------------------|---------|
| **titlebar** | `{app-id}-titlebar` | Fixed header area (56px height) |
| **main** | `{app-id}-main` | Primary content area (fills remaining space) |
| **settings** | `{app-id}-settings` | Optional right sidebar (slides in from the shell chrome) |

## The `registerCustomElement` Wrapper

The `@korporus/web-component-wrapper` package bridges React components to custom elements:

```typescript
import { registerCustomElement } from "@korporus/web-component-wrapper";
import { MyMain } from "./components/MyMain";

registerCustomElement("my-app-main", MyMain);
```

Under the hood this:

1. Defines a custom `HTMLElement` class
2. On `connectedCallback`, creates a React root and renders your component
3. On `disconnectedCallback`, unmounts the React root
4. Converts kebab-case HTML attributes to camelCase props
5. Uses light DOM by default (no Shadow DOM) for simpler styling

## How the Shell Mounts Slots

The shell's `AppView` component creates custom elements imperatively:

```typescript
const el = document.createElement("my-app-main");
containerRef.current.appendChild(el);
```

This triggers the `connectedCallback` and your React component mounts. When the user navigates away, the element is removed, triggering `disconnectedCallback` and cleanup.

## Shared State Across Slots

Since all three slot components live in the same JavaScript context (they're loaded from the same MF remote), they can share state via Zustand:

```typescript
// store.ts — shared by all slots
export const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

When one slot updates the store, all slots re-render.
