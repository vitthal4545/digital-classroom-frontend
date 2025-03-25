import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ["crypto", "buffer", "stream", "util"] }),
    viteCommonjs(),
  ],
  define: {
    // ❌ Remove any `global: {}` here
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
});
