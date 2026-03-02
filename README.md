# Korporus

Korporus is a federated application platform — an OS-like shell that loads independently-built web applications at runtime through a standardized module contract.

## Architecture

```
korporus/
├── apps/
│   ├── shell/              # Korporus shell (React + Vite) — the OS-like host
│   ├── demo-angular/       # Angular demo app (Amplify Gen2)
│   └── demo-react/         # React/Next.js demo app (Amplify Gen2)
├── packages/
│   ├── app-hello/          # Toy "Hello World" app — validates the federated module contract
│   ├── app-manifest/       # JSON schema + TypeScript types for app manifests
│   └── web-component-wrapper/  # Utility: wraps React components as custom elements
├── infra/                  # AWS infrastructure (App Runner, ECR, Amplify)
├── Dockerfile              # Multi-stage build for the Korporus container
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

Each app exposes its views as **Web Components** via a **Module Federation 2.0** remote entry bundle. The shell (and any third-party host) loads these bundles at runtime — no build-time coupling.

## Prerequisites

- Node.js >= 22
- pnpm >= 9

## Getting started

```bash
# Install all workspace dependencies
pnpm install

# Run all apps in dev mode (parallel)
pnpm dev

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Format all files
pnpm format
```

## Running a single app

```bash
# Shell
cd apps/shell && pnpm dev

# Hello app (standalone dev mode)
cd packages/app-hello && pnpm dev
```

## App manifest contract

Every app exposes an `app-manifest.json` at its package root:

```jsonc
{
  "id": "hello-app",
  "name": "Hello World",
  "icon": "./icon.svg",
  "version": "1.0.0",
  "remoteEntry": "http://localhost:3001/remoteEntry.js",
  "slots": {
    "titlebar": "hello-app-titlebar",
    "main": "hello-app-main",
    "settings": "hello-app-settings"
  }
}
```

The `slots` object maps shell slot names to the custom element tag names exposed by the app's federated bundle.

## Project management

Tasks and issues are tracked in Kanbus. See [CONTRIBUTING_AGENT.md](./CONTRIBUTING_AGENT.md) for the workflow.
