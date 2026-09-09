/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "No byte auto-scaling yet",
    body: "anyamount(3200000000, { mode: 'unit', unit: 'byte' }) will not pick GB for you — pass the unit you want. Automatic scaling is planned for a future minor.",
  },
  {
    title: "Output depends on the runtime's Intl data",
    body: "anyamount delegates all formatting to native Intl. Exact output — separators, spacing, compact suffixes — may vary between Node versions, browsers, and OSes. Don't hardcode expected strings in tests; use pattern matching instead.",
  },
  {
    title: "Sanctioned units only",
    body: "Intl supports a fixed list of unit identifiers and -per- compounds of them. There is no way to format arbitrary custom units — that's an Intl constraint, not an anyamount one.",
  },
  {
    title: "Deliberately small",
    body: "One function, three modes, on purpose. No percent mode, no ranges, no parsing. anyamount follows semver — the 1.x API is stable, new options arrive in minors, breaking changes only in majors.",
  },
];
