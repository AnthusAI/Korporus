# Installation

## Prerequisites

- **Node.js** >= 22
- **pnpm** >= 9

## Setup

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd korporus
pnpm install
```

## Running in Development

You need two terminals — one for the shell and one for each app you want to load:

```bash
# Terminal 1: Start the shell
cd apps/shell
pnpm dev

# Terminal 2: Start an app (e.g. hello app)
cd packages/app-hello
pnpm dev
```

Open `http://localhost:3000` to see the shell with your apps.

Port assignments are managed centrally in `packages/platform-config/src/ports.ts` — no need to pass `--port` flags.

## Running All Apps at Once

From the repo root:

```bash
pnpm dev
```

This starts all workspace packages that have a `dev` script.
