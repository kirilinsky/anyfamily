import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const LIMIT = 2048;

const source = await readFile("dist/index.mjs");
const size = gzipSync(source).length;

console.log(`Bundle size: ${size} bytes gzip (limit ${LIMIT})`);

if (size > LIMIT) {
  console.error(`Bundle too large: ${size}b gzip > ${LIMIT}b`);
  process.exit(1);
}
