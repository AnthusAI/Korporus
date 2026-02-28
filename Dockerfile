# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 – build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

# Enable pnpm via corepack
RUN corepack enable pnpm

WORKDIR /app

# Copy workspace manifests first so the dependency install layer is cacheable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/app-manifest/package.json        ./packages/app-manifest/
COPY packages/web-component-wrapper/package.json ./packages/web-component-wrapper/
COPY packages/app-hello/package.json            ./packages/app-hello/
COPY packages/app-docs/package.json             ./packages/app-docs/
COPY apps/shell/package.json                    ./apps/shell/

RUN pnpm install --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/shell/ ./apps/shell/
COPY docs/ ./docs/

# Build the shell (produces apps/shell/dist/)
RUN pnpm --filter @korporus/shell build

# Build the hello app (produces packages/app-hello/dist/)
RUN pnpm --filter @korporus/app-hello build

# Build the docs app (produces packages/app-docs/dist/)
RUN pnpm --filter @korporus/app-docs build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 – runtime (nginx)
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx content and config
RUN rm -rf /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Shell SPA → served at /
COPY --from=build /app/apps/shell/dist/ /usr/share/nginx/html/

# Hello app remote assets → served at /apps/hello/
COPY --from=build /app/packages/app-hello/dist/ /usr/share/nginx/html/apps/hello/

# Docs app remote assets → served at /apps/docs/
COPY --from=build /app/packages/app-docs/dist/ /usr/share/nginx/html/apps/docs/

# App manifests → served at /manifests/ (already embedded in shell dist from public/)
# The shell's public/manifests/ directory is copied into the shell dist by Vite.
# Override the remoteEntry URL to point to the container's own path via env substitution.

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
