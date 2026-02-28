import { createElement, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";

export interface WrapOptions {
  /**
   * When true, the custom element renders into the light DOM so host-app
   * stylesheets can reach into the component. Defaults to true (Shadow DOM off).
   */
  shadowDom?: boolean;
}

/**
 * Wraps a React component as a custom element and registers it with
 * `customElements.define()`.
 *
 * Attribute changes on the custom element are forwarded as props. All
 * attribute values arrive as strings; coerce inside the React component
 * as needed.
 *
 * @param tagName  The custom element tag name (must contain a hyphen).
 * @param Component  The React component to render inside the element.
 * @param options  Optional configuration.
 */
export function registerCustomElement<P extends Record<string, string>>(
  tagName: string,
  Component: ComponentType<P>,
  options: WrapOptions = {},
): void {
  const { shadowDom = false } = options;

  if (customElements.get(tagName)) {
    // Already registered — safe to skip (happens in HMR / fast-refresh scenarios).
    return;
  }

  class KorporusElement extends HTMLElement {
    private root: Root | null = null;
    private mountPoint: HTMLElement | ShadowRoot | null = null;

    static get observedAttributes(): string[] {
      // Observe all attributes set on the element at parse time.
      // For dynamic attribute observation, consumers can call
      // `element.setAttribute(...)` after mount.
      return [];
    }

    connectedCallback() {
      this.mountPoint = shadowDom ? this.attachShadow({ mode: "open" }) : this;
      this.root = createRoot(this.mountPoint as Element);
      this.render();
    }

    disconnectedCallback() {
      this.root?.unmount();
      this.root = null;
      this.mountPoint = null;
    }

    attributeChangedCallback() {
      this.render();
    }

    private getProps(): P {
      const props: Record<string, string> = {};
      for (const attr of this.attributes) {
        // Convert kebab-case attributes to camelCase props.
        const camel = attr.name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        props[camel] = attr.value;
      }
      return props as P;
    }

    private render() {
      this.root?.render(createElement(Component, this.getProps()));
    }
  }

  customElements.define(tagName, KorporusElement);
}
