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
  server: {
    port: 3000, // هنا نحدد البورت
    open: true, // يفتح المتصفح تلقائيًا عند التشغيل
  },
});
