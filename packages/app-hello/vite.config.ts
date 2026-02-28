import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
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
    port: 3001,
    cors: true,
    // Required for MF: makes publicPath absolute so asset URLs in mf-manifest.json
    // resolve correctly when loaded from a different origin (e.g. the shell on port 3000).
    origin: "http://localhost:3001",
  },
  preview: {
    port: 3001,
    cors: true,
  },
});
