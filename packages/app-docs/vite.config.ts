import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { docsPlugin } from "./src/plugins/vite-plugin-docs";
import { getPortEntry, getDevOrigin } from "@korporus/platform-config";

const APP_ID = "docs-app";
const ports = getPortEntry(APP_ID);

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/apps/docs/",
  plugins: [
    react(),
    docsPlugin(),
    federation({
      name: "docs_app",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./bootstrap": "./src/bootstrap.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        zustand: { singleton: true },
      },
      dts: false,
    }),
  ],
  define: {
    __DOCS_BASE_URL__: JSON.stringify(
      mode === "development" ? getDevOrigin(APP_ID) : "/apps/docs"
    ),
  },
  build: {
    target: "chrome89",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: ports.dev,
    strictPort: true,
    cors: true,
    origin: getDevOrigin(APP_ID),
  },
  preview: {
    port: ports.preview,
    cors: true,
  },
}));
