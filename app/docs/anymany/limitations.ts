/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "Output depends on the runtime's Intl data",
    body: "anymany delegates all formatting to native Intl. Exact output — joiner words, comma placement, the Oxford comma — may vary between Node versions, browsers, and regional variants (en vs en-GB). Don't hardcode expected strings in tests; use pattern matching instead.",
  },
  {
    title: "No pluralization, by design",
    body: "Intl ships no word data, and anymany ships zero language dictionaries — that is what keeps it lightweight and correct in every locale. The overflow counter is '+N' (localized digits) instead of 'and N more'. Need words? Pass your own via the overflow callback.",
  },
  {
    title: "The overflow item is a regular list element",
    body: "With max set, the '+N' counter goes through Intl.ListFormat like any other item, so conjunction mode reads 'x, y, z, and +4'. No hidden joiner magic — combine max with type: 'unit' for a plain comma list.",
  },
  {
    title: "Node.js < 18",
    body: "The package declares engines.node >= 18 and CI tests Node 20/22/24. Older versions down to 13 will usually work — the required Intl APIs are there — but they are unsupported and untested.",
  },
];
