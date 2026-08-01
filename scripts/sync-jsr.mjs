/**
 * Mirrors every package's `package.json` version into its `jsr.json`.
 *
 * Each package used to do this itself through the `version` npm lifecycle
 * script, which `npm version` triggered. Changesets does not run `npm version`
 * — it rewrites `package.json` directly — so that hook never fires in the
 * monorepo and `jsr.json` would silently keep the old version. This runs as
 * part of `pnpm version-packages` instead.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PACKAGES = join(import.meta.dirname, "..", "packages");

let changed = 0;
for (const name of readdirSync(PACKAGES)) {
  const dir = join(PACKAGES, name);
  const jsrPath = join(dir, "jsr.json");
  const pkgPath = join(dir, "package.json");
  if (!existsSync(jsrPath) || !existsSync(pkgPath)) continue;

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const jsr = JSON.parse(readFileSync(jsrPath, "utf8"));
  if (jsr.version === pkg.version) continue;

  console.log(`${name}: jsr.json ${jsr.version} → ${pkg.version}`);
  jsr.version = pkg.version;
  writeFileSync(jsrPath, JSON.stringify(jsr, null, 2) + "\n");
  changed += 1;
}

console.log(changed ? `synced ${changed} jsr.json` : "jsr.json already in sync");
