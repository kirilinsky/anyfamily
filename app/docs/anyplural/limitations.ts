/**
 * The docs page's "Limitations" list. Lives outside the client module so the
 * server-rendered page can also emit it as FAQPage structured data.
 */
export const LIMITATIONS: { title: string; body: string }[] = [
  {
    title: "You supply the words",
    body: "anyplural picks the category and formats the number; it ships no dictionaries, so the forms are yours to write. That is what keeps it correct in every locale and near-zero in size — but it is not a translation system. For full message catalogs with interpolation, reach for an i18n framework.",
  },
  {
    title: "Categories are not numbers",
    body: "'one' does not mean 1. Russian resolves 21 and 31 to 'one', and 0 to 'many'. Write forms per category, never per number — that is the whole point of Intl.PluralRules.",
  },
  {
    title: "A missing reachable category throws",
    body: "If the resolved category has no form and there is no 'other' to fall back to, anyplural raises a RangeError rather than guessing or rendering an empty word. Supply 'other' unless you are certain the locale can never reach it.",
  },
  {
    title: "Integers are the well-trodden path",
    body: "Intl.PluralRules also has rules for decimals, and passing a fractional count works, but the category a locale picks for 1.5 surprises people. Check the output for the locales you ship before relying on it.",
  },
];
