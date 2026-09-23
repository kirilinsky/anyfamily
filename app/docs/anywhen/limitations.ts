/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "Output depends on the runtime's Intl data",
    body: "anywhen delegates all formatting to native Intl. Exact output — punctuation, spacing, abbreviated month names — may vary between Node versions, browsers, and OSes. Don't hardcode expected strings in tests; use pattern matching instead.",
  },
  {
    title: "No custom format strings",
    body: "Absolute mode accepts Intl.DateTimeFormat options, so you control the pieces. But if you need 'DD/MM/YYYY' with literal slashes — use a formatting library with explicit pattern strings instead.",
  },
  {
    title: "Smart calendar cutoff is fixed at 7 days",
    body: "Unit cutoffs (seconds → minutes → hours…) are configurable via the thresholds option since 1.0. Relative mode reads all of them, but smart mode reads only second and minute. After the first hour it uses calendar labels, and the switch from weekday ('Wednesday, 11:20') to absolute date still happens at 7 days and is not configurable.",
  },
  {
    title: "Smart mode joins label and clock with a comma",
    body: "'yesterday, 14:35' is two Intl outputs, a relative-day word and a time, joined by a literal ', '. Intl has no API that combines the two, so the separator is not localized. Pass time: false and render the clock yourself if a locale needs a different join, or use anywhen.parts and replace the literal part.",
  },
  {
    title: "Node.js < 18",
    body: "The package declares engines.node >= 18 and CI tests Node 20/22/24. Older versions down to 13 will usually work — the required Intl APIs are there — but they are unsupported and untested.",
  },
];
