import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // The meta's tests import the siblings by package name, which resolves to
    // each one's dist/ — so `pnpm --filter "./packages/*" build` has to have run.
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
    },
  },
});
