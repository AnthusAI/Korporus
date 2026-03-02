import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { getPortEntry, getDevOrigin } from "@korporus/platform-config";

const APP_ID = "hello-app";
const ports = getPortEntry(APP_ID);

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "https://awdmyggmnm.us-east-1.awsapprunner.com/apps/hello/",
  plugins: [
    react(),
    federation({
      name: "hello_app",
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
  build: {
    target: "chrome89",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: ports.dev,
    strictPort: true,
    cors: true,
    // Required for MF: makes publicPath absolute so asset URLs in mf-manifest.json
    // resolve correctly when loaded from a different origin (e.g. the shell on port 3000).
    origin: getDevOrigin(APP_ID),
  },
  preview: {
    port: ports.preview,
    cors: true,
  },
}));
