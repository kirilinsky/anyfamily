// esbuild strips/warns on "use client" as a bundled-module directive, so tsup's
// own banner option hits the same guard. Prepend it to the built files directly.
import { readFileSync, writeFileSync } from "node:fs";

const BANNER = '"use client";\n';

for (const file of ["dist/index.js", "dist/index.cjs"]) {
  const contents = readFileSync(file, "utf8");
  if (!contents.startsWith(BANNER)) {
    writeFileSync(file, BANNER + contents);
  }
}
