/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "It reads, it does not format",
    body: "anylocale hands you facts. Turning a code into a readable name — \"US\" into \"United States\" — is anyaround's job, and formatting a date with them is anywhen's.",
  },
  {
    title: "Values track the runtime's CLDR",
    body: "Everything here comes from the ICU data your engine ships. Exact calendar and time-zone lists can shift between versions, so test behaviour rather than exact arrays.",
  },
  {
    title: "Time zones need a region",
    body: "A language-only tag has no region to look up, so timeZones is empty for \"en\" and populated for \"en-GB\". That is the data, not a bug.",
  },
  {
    title: "Support is uneven and moving",
    body: "The proposal was standardised twice — properties first, then methods — and engines are split. anylocale reads either shape, but where neither exists it throws. Branch on anylocale.supported.",
  },
];
