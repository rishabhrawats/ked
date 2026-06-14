import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/ked-shop/",
  plugins: [
    {
      name: "legacy-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id.replace(/\\/g, "/"))) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react({ include: /\.(js|jsx)$/ }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.(js|jsx)$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    outDir: "build",
    assetsDir: "static",
    sourcemap: false,
  },
});
