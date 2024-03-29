import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      formats: ["es"],
      entry: "src/main.ts",
      name: "proxy-land",
      fileName: "main",
    },
  },
  plugins: [dts()],
});
