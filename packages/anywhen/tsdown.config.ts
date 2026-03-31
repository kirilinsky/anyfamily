import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "esnext",
  minify: true,
  dts: true,
  outExtensions: () => ({
    dts: ".d.ts",
  }),
  clean: true, 
  treeshake: true,
});
