import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { getPortEntry, getDevOrigin } from "@korporus/platform-config";

const APP_ID = "settings-app";
const ports = getPortEntry(APP_ID);

export default defineConfig(({ mode }) => ({
  base:
    mode === "development"
      ? "/"
      : "/apps/settings/",
  plugins: [
    react(),
    federation({
      name: "settings_app",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./bootstrap": "./src/bootstrap.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
      dts: false,
    }),
  ],
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
