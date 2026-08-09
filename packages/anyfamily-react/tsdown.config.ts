import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  target: "es2018",
  minify: true,
  dts: true,
  outExtensions: () => ({
    dts: ".d.ts",
  }),
  clean: true,
  treeshake: true,
  // React stays a peer dependency; never inline it. rolldown keeps the
  // "use client" directive at the top of both bundles on its own, which is why
  // there is no banner step here — esbuild used to strip it and needed one.
  deps: { neverBundle: ["react", "react-dom"] },
});
