import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // The hooks import the siblings by package name, which resolves to each
    // one's dist/ — so `pnpm --filter "./packages/*" build` has to have run.
    include: ["test/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.tsx"],
    },
  },
});
