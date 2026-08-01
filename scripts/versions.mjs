/**
 * Refresh data/versions.json with the latest published version of each any*
 * package from the npm registry. Runs as `prebuild`, so every deploy shows
 * current versions. Falls back to the workspace version (then the existing
 * file) when the registry is unreachable, so builds never fail on this.
 *
 * The package list is read from `packages/` rather than hardcoded — a hardcoded
 * one silently lost `anyword`, which left its landing section with no version
 * badge until someone noticed.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PACKAGES = fileURLToPath(new URL("../packages", import.meta.url));
const OUT = fileURLToPath(new URL("../data/versions.json", import.meta.url));

/** Every publishable package in the workspace, by its npm name. */
async function workspacePackages() {
  const dirs = await readdir(PACKAGES, { withFileTypes: true });
  const found = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    try {
      const pkg = JSON.parse(
        await readFile(`${PACKAGES}/${d.name}/package.json`, "utf8"),
      );
      if (pkg.name && !pkg.private) found.push([pkg.name, pkg.version ?? null]);
    } catch {
      // not a package directory
    }
  }
  return found;
}

async function latestVersion(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${name}/latest`, {
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

for (const [name, local] of await workspacePackages()) {
  out[name] = (await latestVersion(name)) ?? local ?? existing[name] ?? "";
}

await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log("versions:", out);
