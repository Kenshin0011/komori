import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueQueryParams",
      formats: ["es", "cjs"],
      fileName: (format) => `${format}/index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["vue", "vue-router", "zod"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          zod: "zod",
        },
      },
    },
    outDir: "dist",
  },
})
