import next from "eslint-config-next";

/** Next.js 16 ships flat configs directly — no FlatCompat needed. */
const eslintConfig = [
  ...next,
  { ignores: [".next/**", "node_modules/**", "packages/**"] },
];

export default eslintConfig;
