import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  
  // Ensure correct asset paths when deployed to GitHub Pages project sites
  // Uses repo name as base when building in CI, defaults to "/" locally
  base: process.env.GITHUB_REPOSITORY
    ? (() => {
        const repo = process.env.GITHUB_REPOSITORY.split("/").pop() ?? "";
        // For user/org sites (<user>.github.io), base must be "/"
        if (repo.endsWith(".github.io")) return "/";
        return `/${repo}/`;
      })()
    : "/",
  server: {
    port: 3000, // هنا نحدد البورت
    open: true, // يفتح المتصفح تلقائيًا عند التشغيل
  },
});
