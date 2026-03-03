import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: "chrome89" },
  server: {
    port: 3002,
    proxy: {
      "/apps": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
