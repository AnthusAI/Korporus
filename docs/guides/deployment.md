# Deployment

Korporus runs in three different modes. Understanding the differences is essential for debugging and deployment.

## Development Mode

Each app runs its own **Vite dev server** on a separate port. The shell runs on port 3000, and each app gets its own port (3001, 3002, etc.).

### How it works

1. The shell fetches `/manifests/{app-id}.json` from its own dev server
2. The `devManifestRewritePlugin` intercepts these requests and rewrites the `remoteEntry` field from a relative URL to `http://localhost:{port}/mf-manifest.json`
3. The MF runtime fetches the manifest from the app's dev server, which tells it how to find the remote entry's virtual modules
4. All module imports resolve against the app's own origin

### Why the rewrite is needed

In Vite dev mode, `remoteEntry.js` is a virtual ESM module containing absolute import paths like `/node_modules/.vite/deps/react.js`. These paths only exist on the app's own Vite dev server. If the shell tried to proxy these requests, the internal imports would resolve against port 3000 (the shell) instead of port 3001 (the app).

The fix: bypass the proxy entirely. Point the MF runtime directly at the app's dev server so all imports resolve correctly.

### Dev server requirements

Each app's `vite.config.ts` must set:

```typescript
server: {
  port: 3001,       // Unique port
  cors: true,        // Allow cross-origin from shell
  origin: "http://localhost:3001",  // Absolute publicPath in MF manifest
}
```

The shell's `vite.config.ts` must list each app in `devRemoteOrigins`:

```typescript
const devRemoteOrigins: Record<string, string> = {
  "hello-app": "http://localhost:3001",
  "docs-app": "http://localhost:3002",
};
```

## Container Mode

A single Docker container runs **nginx** serving all apps from one origin.

### How it works

The multi-stage `Dockerfile`:

1. Builds the shell and all apps with `pnpm build`
2. Copies each app's `dist/` to nginx under `/apps/{name}/`
3. Copies the shell's `dist/` to nginx's root `/`

nginx serves everything:

```
/                        → Shell (index.html + JS)
/apps/hello/             → Hello app (remoteEntry.js + assets)
/apps/docs/              → Docs app (remoteEntry.js + assets)
/manifests/              → App manifests (JSON + icons)
/health                  → Health check endpoint
```

### No rewriting needed

Since everything is on the same origin, the manifests use relative URLs:

```json
{
  "remoteEntry": "/apps/hello/remoteEntry.js"
}
```

The MF runtime loads this directly. No proxy, no rewriting, no CORS.

### Building the container

```bash
docker build -t korporus-shell .
docker run -p 8080:8080 korporus-shell
```

## Production (AWS)

In production, the container runs on **AWS App Runner** with images stored in **ECR**.

### Infrastructure

- **ECR**: `korporus/shell` repository for container images
- **App Runner**: 0.25 vCPU / 0.5 GB, port 8080, `/health` check
- **Terraform**: Infrastructure defined in `infra/shell/`

### Deployment steps

```bash
# Build and push
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker build -t korporus-shell .
docker tag korporus-shell:latest <account>.dkr.ecr.<region>.amazonaws.com/korporus/shell:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/korporus/shell:latest

# Deploy infrastructure
cd infra/shell
terraform init
terraform apply
```

App Runner automatically picks up new image pushes and deploys them.

### Demo apps (Amplify)

The Angular and React demo apps are intended for **AWS Amplify Gen2** deployment. Each has an `amplify.yml` build spec. These are standalone hosts that load the hello app's Web Components from the App Runner container URL.
