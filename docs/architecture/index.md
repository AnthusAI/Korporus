# Architecture

Korporus is built on three key technologies:

- **Module Federation 2.0** — Runtime loading of independently-built JavaScript bundles
- **Web Components** — The boundary contract between the shell and apps
- **The Shell** — An OS-like host that discovers, loads, and renders federated apps

## How It Works

1. The **shell** starts and fetches app manifests from a known set of URLs
2. Each manifest describes an app: its name, icon, and the Web Component tag names for its three slots (titlebar, main, settings)
3. When a user opens an app, the shell uses the **Module Federation runtime** to dynamically import the app's `remoteEntry.js`
4. The remote entry's `bootstrap` module registers the app's **Web Components** as custom elements
5. The shell creates instances of those custom elements and mounts them in the appropriate layout slots

## Sections

- [Module Federation](./module-federation) — How MF2 works in Korporus
- [Web Components](./web-components) — The slot contract
- [Shell](./shell) — Shell app internals
- [Manifests](./manifests) — App manifest schema and discovery
