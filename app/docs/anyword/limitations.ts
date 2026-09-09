/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "Boundaries come from the runtime's ICU data",
    body: "anyword delegates all segmentation to native Intl. Exact segment lists may vary between Node versions, browsers, and OSes — especially for CJK and Thai. Don't assert on exact arrays across environments; test behaviour, not strings.",
  },
  {
    title: "Not an NLP toolkit",
    body: "anyword does one thing: boundaries. No stemming, no stop words, no message catalogs, no tokenizer for model input. Reach for a real NLP library or i18n framework when you need those.",
  },
  {
    title: "Missing on older runtimes",
    body: "Intl.Segmenter landed late — Firefox 125, Safari 14.1. On engines without it every anyword function throws. Branch on the exported supported flag if you target them.",
  },
  {
    title: "Word mode drops separators by default",
    body: "anyword('hi, there!') returns two words — the comma and spaces are gone, so the pieces do not rejoin into the input. Pass raw: true when you need a lossless round trip.",
  },
];
