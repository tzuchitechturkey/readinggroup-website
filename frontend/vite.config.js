import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve("./src") } },
  base: "/", // custom domain => root paths
  server: { port: 3000, open: true },
});