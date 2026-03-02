// Allow any custom element tag name (kebab-case) in JSX.
// The shell doesn't know at build time which custom elements will be registered.
// React 19 handles custom elements natively; this augments the global JSX namespace.
declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [tagName: string]: any;
  }
}
