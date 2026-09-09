/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "Intl.DurationFormat is the newest API in the family",
    body: "Baseline 2025, and notably missing on Node 22 and earlier — which is still a common CI and serverless default. Every anylong call throws there. Branch on the exported supported flag, or render the demo client-side only, if you target those runtimes.",
  },
  {
    title: "Records are not normalized",
    body: "A duration record you pass in comes back out exactly as given: { minutes: 120 } formats as '120 min', not '2 hr'. Only number and Date inputs get decomposed. That is Intl.DurationFormat's behaviour, kept rather than papered over.",
  },
  {
    title: "Shorthand is English-only in v1",
    body: "'2h 30m' and '2 hours 30 minutes' parse; localized shorthand does not. The output is localized in 200+ languages — the input syntax is not an i18n surface.",
  },
  {
    title: "Ambiguous input throws by design",
    body: "'1:30' could be 1h30m or 1m30s, so anylong refuses rather than guessing. Same for negatives and fractional shorthand. Every rejection names what it received and what it accepts.",
  },
];
