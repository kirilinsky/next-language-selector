import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
  sourcemap: false,
  dts: true,
  clean: true,
  splitting: false,
  // The component uses hooks, so the package boundary must be a client
  // boundary in the App Router. esbuild drops the directive from non-entry
  // modules (selector.tsx), so it is re-added to the bundle here.
  banner: { js: '"use client";' },
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
});
