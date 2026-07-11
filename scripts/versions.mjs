/**
 * Refresh data/versions.json with the latest published version of each any*
 * package from the npm registry. Runs as `prebuild`, so every deploy shows
 * current versions. Falls back to the installed version (then the existing
 * file) when the registry is unreachable, so builds never fail on this.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PKGS = ["anyaround", "anyamount", "anywhen", "anymany"];
const OUT = fileURLToPath(new URL("../data/versions.json", import.meta.url));

async function installedVersion(pkg) {
  try {
    const p = fileURLToPath(
      new URL(`../node_modules/${pkg}/package.json`, import.meta.url),
    );
    return JSON.parse(await readFile(p, "utf8")).version ?? null;
  } catch {
    return null;
  }
}

async function latestVersion(pkg) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`, {
      headers: { accept: "application/vnd.npm.install-v1+json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).version ?? null;
  } catch {
    return null;
  }
}

const existing = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
const out = {};
for (const pkg of PKGS) {
  const v =
    (await latestVersion(pkg)) ??
    (await installedVersion(pkg)) ??
    existing[pkg] ??
    "";
  out[pkg] = v;
}

await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log("versions:", out);
