# State Management

Korporus apps use [Zustand](https://github.com/pmndrs/zustand) for state management. Since all three slot components (titlebar, main, settings) are loaded from the same MF remote, they share a single JavaScript context and can use the same Zustand store.

## Basic Pattern

```typescript
// src/store.ts
import { create } from "zustand";

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

## Using the Store in Slot Components

```typescript
// src/components/MyMain.tsx
import { useMyStore } from "../store";

export function MyMain() {
  const count = useMyStore((s) => s.count);
  const increment = useMyStore((s) => s.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

When `MyMain` calls `increment`, the titlebar and settings components will also re-render if they subscribe to `count`.

## Why Zustand?

- **No provider needed**: Unlike React Context, Zustand stores don't require a Provider wrapper. This matters because each slot is a separate React root — they don't share a React tree.
- **Shared singleton**: Zustand is declared as a shared singleton in the MF config, so all slots use the same store instance.
- **Simple API**: `create` + `useStore` — no boilerplate.

## State Doesn't Persist

By default, Zustand state is in-memory only. When the user navigates away from the app and back, the state resets. If you need persistence, use Zustand's `persist` middleware with `localStorage`.
