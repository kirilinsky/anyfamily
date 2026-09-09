/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  { title: "No cities", body: "Intl has no city display names. Regions and countries only." },
  { title: "Names track ICU", body: "Exact strings come from the runtime's ICU version — don't snapshot across environments." },
  { title: "No reverse lookup", body: "Code → name only; name → code is not provided." },
  { title: "Flags are alpha-2 only", body: "Numeric regions and non-region kinds have no flag." },
];
