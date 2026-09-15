import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

import { BASE_URL, PACKAGES } from "@/lib/packages";
import { PITCH } from "@/lib/pitch";

/** The two metas, which are not in `PACKAGES` because they have no demo route. */
export const METAS = [
  {
    id: "anyfamily",
    tagline: "the whole family in one install",
    description:
      "All eight any* packages re-exported from one dependency — for the app that wants every formatter without eight installs.",
  },
  {
    id: "anyfamily-react",
    tagline: "every formatter as a hook",
    description:
      "React hooks for the family, a shared locale provider with per-hook defaults, relative time that keeps itself fresh, and useAnyfamily() for the whole set bound at once.",
  },
] as const;

export const GITHUB = "https://github.com/kirilinsky/anyfamily";
const RAW = `${GITHUB.replace("github.com", "raw.githubusercontent.com")}/main/packages`;

/**
 * A package README as plain Markdown: the centred HTML header the npm page
 * wants (logo, badges, `<h1>`) becomes a heading and a line of text, and
 * repo-relative links are made absolute, so it reads the same anywhere.
 */
export function readme(id: string): string {
  const text = readFileSync(join(process.cwd(), "packages", id, "README.md"), "utf8");
  return text
    .replace(/<h1 align="center">(.*?)<\/h1>/, "# $1")
    .replace(/<p align="center">([\s\S]*?)<\/p>\n?/g, (_, inner: string) => {
      const plain = inner.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      return plain ? `${plain.replace(/\s*\n\s*/g, " ")}\n` : "";
    })
    .replaceAll("./logo.png", `${RAW}/${id}/logo.png`)
    .replaceAll("./LICENSE", `${GITHUB}/blob/main/LICENSE`);
}

/**
 * When the site's content last changed: the commit being built. Vercel and CI
 * both check out with history enough for this; anything else falls back to
 * the build time rather than failing.
 */
export function lastModified(): Date {
  try {
    const iso = execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return d;
  } catch {
    // no git on this host
  }
  return new Date();
}

/** Every package that has a README and a pitch, in family order. */
export const ALL_IDS = [...PACKAGES.map((p) => p.id), ...METAS.map((m) => m.id)];

/** The built bundle's gzip size, as the README quotes it; `null` before a build. */
export function packageSize(id: string): string | null {
  try {
    const raw = readFileSync(join(process.cwd(), "packages", id, "dist", "index.mjs"));
    return `${(gzipSync(raw, { level: 9 }).byteLength / 1024).toFixed(1)} kB gzip`;
  } catch {
    return null;
  }
}

/**
 * `/<id>/llms.txt` — one package for an agent that was handed its URL: the
 * pitch up top in a fixed shape, the README underneath for the detail.
 */
export function packagePitch(id: string): string {
  const pitch = PITCH[id];
  const size = packageSize(id);
  const core = PACKAGES.find((p) => p.id === id);
  const tagline = core?.tagline ?? METAS.find((m) => m.id === id)?.tagline ?? "";
  const demo = core ? `- demo: ${BASE_URL}/${id}\n` : "";
  return `# ${id} — ${tagline}

> ${pitch.does}

- wraps: ${pitch.wraps}
- install: npm install ${id}
- size: ${size ?? "about a kilobyte"}, zero dependencies, ESM + CJS, TypeScript types included
- runtime: ${pitch.runtime}
- docs: ${BASE_URL}/docs/${id}
${demo}- npm: https://www.npmjs.com/package/${id}
- source: ${GITHUB}/tree/main/packages/${id}
- family: ${BASE_URL}/llms.txt

## why

${pitch.why}

## usage

\`\`\`ts
${pitch.usage}
\`\`\`

## not for

${pitch.notFor}

---

${readme(id).trim()}
`;
}

/** `/llms.txt` — the index an agent reads first: what exists, what each does, where the full text is. */
export function llmsIndex(): string {
  const core = PACKAGES.map(
    (p) =>
      `- [${p.id}](${BASE_URL}/${p.id}/llms.txt): ${p.tagline} — ${p.description} Docs: ${BASE_URL}/docs/${p.id}. npm: ${p.npm}`,
  );
  const metas = METAS.map(
    (m) =>
      `- [${m.id}](${BASE_URL}/${m.id}/llms.txt): ${m.tagline} — ${m.description} Docs: ${BASE_URL}/docs/${m.id}. npm: https://www.npmjs.com/package/${m.id}`,
  );
  return `# anyfamily

> The any* family: eight micro, zero-dependency JavaScript/TypeScript formatters built on the runtime's native \`Intl\` — dates, numbers and money, lists, region and language names with flags, durations, plurals, words and graphemes, and locale behaviour — in any locale, with no bundled data. Plus two meta packages: everything in one install, and React hooks.

Every package exports exactly one name. The bare call does the job; extras hang off that name (\`anywhen.parts(date)\`, \`anyword.count(text)\`, \`anylong.supported\`). Options are a plain object; \`locale\` is a BCP 47 tag or a fallback chain. ESM + CJS, TypeScript types included, SSR-safe, MIT.

Each package link below is its own page for agents — pitch, usage, what it is not for, then the full README. Everything as one file: ${BASE_URL}/llms-full.txt

## Core packages

${core.join("\n")}

## Meta packages

${metas.join("\n")}

## Source and standards

- Repository: ${GITHUB}
- Package standard (the shape every package follows): ${GITHUB}/blob/main/PACKAGE-STANDARD.md
- Roadmap: ${GITHUB}/blob/main/plans.md
- Live demos: ${BASE_URL}/<package>, API reference: ${BASE_URL}/docs/<package>
`;
}

/** `/llms-full.txt` — every README, in family order, as one Markdown document. */
export function llmsFull(): string {
  const parts = [...PACKAGES.map((p) => p.id), ...METAS.map((m) => m.id)].map(
    (id) => `<!-- ${id} — ${BASE_URL}/docs/${id} -->\n\n${readme(id).trim()}`,
  );
  return `${llmsIndex().trim()}\n\n---\n\n${parts.join("\n\n---\n\n")}\n`;
}
