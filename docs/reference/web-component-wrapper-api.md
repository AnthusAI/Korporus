# Web Component Wrapper API

The `@korporus/web-component-wrapper` package provides a single function that bridges React components to HTML custom elements.

## `registerCustomElement`

```typescript
function registerCustomElement<P extends Record<string, string>>(
  tagName: string,
  Component: React.ComponentType<P>,
  options?: WrapOptions
): void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tagName` | `string` | The custom element tag name (must contain a hyphen, e.g. `"my-app-main"`) |
| `Component` | `ComponentType<P>` | The React component to render inside the custom element |
| `options` | `WrapOptions` | Optional configuration |

### Options

```typescript
interface WrapOptions {
  /** Use Shadow DOM instead of light DOM. Default: false */
  shadowDom?: boolean;
}
```

### Behavior

- **Attribute to prop mapping**: HTML attributes (kebab-case) are converted to camelCase React props. For example, `data-theme="dark"` becomes `{ dataTheme: "dark" }`.
- **All props are strings**: HTML attributes are always strings. Coerce types inside your component.
- **Idempotent**: Calling `registerCustomElement` multiple times with the same tag name is safe — subsequent calls are ignored (useful for HMR).
- **Lifecycle**: The React root is created on `connectedCallback` and unmounted on `disconnectedCallback`.

### Example

```typescript
import { registerCustomElement } from "@korporus/web-component-wrapper";

function Greeting({ name }: { name?: string }) {
  return <h1>Hello, {name ?? "World"}!</h1>;
}

registerCustomElement("my-greeting", Greeting);
```

Usage in HTML:
```html
<my-greeting name="Korporus"></my-greeting>
```
