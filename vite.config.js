import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // Enable polyfills for specific Node.js modules
      include: [
        "buffer",
        "process",
        "util",
        "crypto",
        "stream",
        "events",
        "os",
        "path",
        "url",
        "querystring",
      ],
      // Exclude Node.js modules that are not needed
      exclude: ["fs"],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Protocol imports
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@features": "/src/components/features",
      "@layouts": "/src/components/layouts",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
      // Add explicit aliases for Node.js modules
      buffer: "buffer",
      process: "process/browser",
    },
  },
  define: {
    global: "globalThis",
    "process.env": "{}",
    "process.platform": '"browser"',
    "process.version": '"v18.0.0"',
    "process.versions": "{}",
    "process.nextTick": "((fn) => setTimeout(fn, 0))",
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
  server: {
    port: 5178,
    host: true,
  },
});
