import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";
import fs from "node:fs";
import path from "node:path";

/**
 * In dev mode, rewrite the remoteEntry URLs in served manifest JSON files
 * so that Module Federation loads remotes directly from their origin dev server
 * (not proxied). This avoids RUNTIME-008: Vite dev server remoteEntry.js files
 * contain absolute virtual-module paths (e.g. /node_modules/.vite/deps/...) that
 * only resolve correctly on the origin dev server, not when proxied.
 */
function devManifestRewritePlugin() {
  const devRemoteOrigins: Record<string, string> = {
    "hello-app": "http://localhost:3001",
  };

  return {
    name: "dev-manifest-rewrite",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/manifests/") || !req.url.endsWith(".json")) {
          return next();
        }
        const filePath = path.join(
          import.meta.dirname,
          "public",
          req.url,
        );
        let raw: string;
        try {
          raw = fs.readFileSync(filePath, "utf-8");
        } catch {
          return next();
        }
        const manifest = JSON.parse(raw);
        const origin = devRemoteOrigins[manifest.id as string];
        if (origin && typeof manifest.remoteEntry === "string") {
          // In dev mode, use the MF manifest JSON served by the hello app's Vite
          // dev server. The MF runtime uses the manifest to discover the actual
          // virtual-module entry paths, all of which resolve correctly on the
          // remote's own origin (port 3001). Using remoteEntry.js directly fails
          // because it is a virtual ESM module whose internal imports are absolute
          // paths that only exist on the remote's dev server.
          manifest.remoteEntry = `${origin}/mf-manifest.json`;
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(manifest));
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "shell",
      remotes: {},
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        zustand: { singleton: true },
      },
      dts: false,
    }),
    devManifestRewritePlugin(),
  ],
  build: {
    target: "chrome89",
  },
  server: {
    port: 3000,
  },
});
