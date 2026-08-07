import colors from "@/data/colors.json";

/**
 * One entry per any* package. Single source of truth for the landing sections,
 * the per-package demo routes, the docs routes and the sitemap — adding a
 * package here wires it into all four.
 *
 * Accents come from `data/colors.json`, the family palette. The standalone demo
 * sites each picked their own accent; those are deliberately dropped so a
 * package looks the same in its nav dot, its landing section, the og card and
 * its demo page.
 */
export type Pkg = {
  /** Package name, and the demo route: `/anywhen`. */
  id: string;
  /** The part after "any" — the mono half of the wordmark. */
  suffix: string;
  accent: string;
  tagline: string;
  description: string;
  tags: string[];
  npm: string;
  /** Source directory inside this monorepo — the old per-package repos are archived. */
  github: string;
  /**
   * Standalone demo site, for a package whose demo has not been folded into
   * this app yet. Every package is migrated as of 2026-07, so nothing sets it
   * — it stays as the escape hatch for a future package that ships its own
   * site first. Set it and the landing links out instead of routing inward.
   */
  legacySite?: string;
  /** Whether `/docs/<id>` exists. */
  hasDocs: boolean;
  /** Footer line on the demo page. */
  footerLine: string;
};

/** Where the landing's "demo" button goes — internal once the demo is ported. */
export function demoHref(pkg: Pkg): string {
  return pkg.legacySite ?? `/${pkg.id}`;
}

export const PACKAGES: Pkg[] = [
  {
    id: "anywhen",
    suffix: "when",
    accent: colors.anywhen,
    tagline: "dates & times",
    description:
      "Dates and times into localized strings and relative phrasing. Built on native Intl, no data files.",
    tags: ["dates", "datetimeformat", "relative"],
    npm: "https://www.npmjs.com/package/anywhen",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anywhen",
    hasDocs: true,
    footerLine: "Intl is powerful. anywhen makes it usable.",
  },
  {
    id: "anyamount",
    suffix: "amount",
    accent: colors.anyamount,
    tagline: "money & numbers",
    description:
      "Numbers, currency, and units into localized, human-readable strings. One function, three modes, any locale.",
    tags: ["currency", "numberformat", "units"],
    npm: "https://www.npmjs.com/package/anyamount",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anyamount",
    hasDocs: true,
    footerLine: "Intl is powerful. anyamount makes it usable.",
  },
  {
    id: "anymany",
    suffix: "many",
    accent: colors.anymany,
    tagline: "lists",
    description:
      "String arrays into localized lists — sort and join in any locale with the native list formatter.",
    tags: ["lists", "listformat", "sort"],
    npm: "https://www.npmjs.com/package/anymany",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anymany",
    hasDocs: true,
    footerLine: "Intl is powerful. anymany makes it usable.",
  },
  {
    id: "anyaround",
    suffix: "around",
    accent: colors.anyaround,
    tagline: "names & flags",
    description:
      "Region, language, script, currency, and calendar codes into their localized names — decorated with country flags. Any Intl locale.",
    tags: ["flags", "displaynames", "ssr"],
    npm: "https://www.npmjs.com/package/anyaround",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anyaround",
    hasDocs: true,
    footerLine: "Intl knows every name. anyaround adds the flag.",
  },
  {
    id: "anylong",
    suffix: "long",
    accent: colors.anylong,
    tagline: "durations",
    description:
      "Any duration in — a number, two Dates, an ISO 8601 string, shorthand, or a duration record — into a localized string. One function over Intl.DurationFormat.",
    tags: ["duration", "durationformat", "elapsed"],
    npm: "https://www.npmjs.com/package/anylong",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anylong",
    hasDocs: true,
    footerLine: "Intl is powerful. anylong makes it usable.",
  },
  {
    id: "anyplural",
    suffix: "plural",
    accent: colors.anyplural,
    tagline: "plurals",
    description:
      "Any count into its correct plural form — cardinal or ordinal, in any locale. One function over Intl.PluralRules, no rule tables.",
    tags: ["plurals", "pluralrules", "ordinal"],
    npm: "https://www.npmjs.com/package/anyplural",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anyplural",
    hasDocs: true,
    footerLine: "Intl knows the rules. anyplural makes them one call.",
  },
  {
    id: "anyword",
    suffix: "word",
    accent: colors.anyword,
    tagline: "words & graphemes",
    description:
      "Text into locale-correct words, graphemes and sentences — count and truncate without ripping an emoji in half. One function over Intl.Segmenter.",
    tags: ["segmenter", "grapheme", "truncate"],
    npm: "https://www.npmjs.com/package/anyword",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anyword",
    hasDocs: true,
    footerLine: "Intl knows the boundaries. anyword hands them to you.",
  },
  {
    id: "anylocale",
    suffix: "locale",
    accent: colors.anylocale,
    tagline: "locale behaviour",
    description:
      "How a locale actually behaves — text direction, first day of the week, weekend days, calendars and time zones. One function over Intl.Locale info.",
    tags: ["rtl", "week-start", "locale-info"],
    npm: "https://www.npmjs.com/package/anylocale",
    github: "https://github.com/kirilinsky/anyfamily/tree/main/packages/anylocale",
    // No /docs/anylocale yet — flip to true when the reference page lands.
    hasDocs: false,
    footerLine: "Intl knows the conventions. anylocale hands them to you.",
  },
];

export const BASE_URL = "https://anyfamily.site";

export function getPackage(id: string): Pkg {
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown any* package: ${id}`);
  return pkg;
}
