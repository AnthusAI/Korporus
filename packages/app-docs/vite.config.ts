import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { docsPlugin } from "./src/plugins/vite-plugin-docs";

export default defineConfig({
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
  build: {
    target: "chrome89",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3002,
    cors: true,
    origin: "http://localhost:3002",
  },
  preview: {
    port: 3002,
    cors: true,
  },
});
