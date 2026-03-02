# Styling

Korporus apps use **inline styles** for all component styling. This avoids CSS conflicts between federated apps that share the same DOM.

## Why Inline Styles?

- **No CSS conflicts**: Each app's styles are scoped to its components. No class name collisions.
- **No build config**: No CSS modules, Tailwind, or PostCSS setup needed in app packages.
- **Predictable**: What you write is what you get — no cascade surprises.

The shell itself uses Tailwind CSS, but federated apps should not depend on it.

## Pattern

```typescript
export function MyMain() {
  return (
    <div style={{
      padding: 24,
      fontFamily: "system-ui, sans-serif",
      color: "#1e293b",
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        My App
      </h1>
      <p style={{ lineHeight: 1.6 }}>
        Content goes here.
      </p>
    </div>
  );
}
```

## Color Palette

For visual consistency with the shell, use the Slate color scale:

| Use | Color |
|-----|-------|
| Primary text | `#1e293b` (slate-800) |
| Secondary text | `#475569` (slate-600) |
| Muted text | `#94a3b8` (slate-400) |
| Borders | `#e2e8f0` (slate-200) |
| Background | `#ffffff` |
| Accent | `#3b82f6` (blue-500) |

## Font

Use `system-ui, sans-serif` as the font stack to match the shell.
