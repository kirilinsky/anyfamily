import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { BASE_URL, PACKAGES } from "@/lib/packages";

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

/** `/llms.txt` — the index an agent reads first: what exists, what each does, where the full text is. */
export function llmsIndex(): string {
  const core = PACKAGES.map(
    (p) =>
      `- [${p.id}](${BASE_URL}/docs/${p.id}): ${p.tagline} — ${p.description} npm: ${p.npm}. README: ${RAW}/${p.id}/README.md`,
  );
  const metas = METAS.map(
    (m) =>
      `- [${m.id}](${BASE_URL}/docs/${m.id}): ${m.tagline} — ${m.description} npm: https://www.npmjs.com/package/${m.id}. README: ${RAW}/${m.id}/README.md`,
  );
  return `# anyfamily

> The any* family: eight micro, zero-dependency JavaScript/TypeScript formatters built on the runtime's native \`Intl\` — dates, numbers and money, lists, region and language names with flags, durations, plurals, words and graphemes, and locale behaviour — in any locale, with no bundled data. Plus two meta packages: everything in one install, and React hooks.

Every package exports exactly one name. The bare call does the job; extras hang off that name (\`anywhen.parts(date)\`, \`anyword.count(text)\`, \`anylong.supported\`). Options are a plain object; \`locale\` is a BCP 47 tag or a fallback chain. ESM + CJS, TypeScript types included, SSR-safe, MIT.

Full documentation as one file: ${BASE_URL}/llms-full.txt

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
