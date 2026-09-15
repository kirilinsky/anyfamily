/**
 * The pitch for each package, written for a reader deciding in thirty
 * seconds — a person skimming, or an agent that was handed the URL. One
 * source for the demo page's "about" block, the per-package `/<id>/llms.txt`
 * and the structured data. Keep every field honest against the README; the
 * README is the long form, this is the elevator.
 */
export interface Pitch {
  /** One sentence: what goes in, what comes out. */
  does: string;
  /** The native `Intl` API underneath — the reason it needs no data. */
  wraps: string;
  /** The case, in one paragraph: what breaks by hand, what the alternatives cost. */
  why: string;
  /** Three to seven lines of the API with real output in the comments. */
  usage: string;
  /** What it deliberately is not — so nobody installs it for the wrong job. */
  notFor: string;
  /** Runtime floor, and the flag to branch on where there is one. */
  runtime: string;
}

export const PITCH: Record<string, Pitch> = {
  anywhen: {
    does:
      "Formats a date as the string a reader expects — \"yesterday, 2:35 PM\", \"3 hours ago\", \"5 Feb 2016\" — choosing the form from how far away the date is.",
    wraps: "Intl.DateTimeFormat + Intl.RelativeTimeFormat",
    why:
      "Relative time by hand is a threshold table plus a per-locale plural mess; dayjs and date-fns ship locale files and a hundred functions to get one string. anywhen is one call, ~1.4 kB, every locale the runtime knows, and SSR-stable when you pin `now`.",
    usage: `anywhen(date)                                        // "yesterday, 2:35 PM"
anywhen(date, { mode: "relative" })                  // "3 hours ago"
anywhen(date, { mode: "absolute", locale: "ja" })    // "2016年2月5日"
anywhen(date, { locale: "en", now: requestTime })    // SSR-safe: fixed anchor
anywhen.parts(date, { mode: "relative" })            // [{ type: "integer", value: "3", unit: "hour" }, …]
anywhen.range(from, to, { format: { day: "numeric", month: "short" } }) // "Sep 12 – 15"`,
    notFor:
      "Parsing dates, date arithmetic, or custom pattern strings like DD/MM/YYYY — use a date library for those and hand the result here.",
    runtime: "Node 18+, every modern browser, Deno, Bun, edge runtimes.",
  },
  anyamount: {
    does:
      "Formats a number the way the locale writes it — compact (\"1.2M\"), money (\"€1,999.00\"), units (\"3.2 GB\") — and reads a typed amount back into a number.",
    wraps: "Intl.NumberFormat",
    why:
      "toFixed and hand-placed separators break outside en-US; numeral.js is 20 kB and English-first. anyamount is one call over the formatter the runtime already has — any currency, any sanctioned unit, bigint — plus parse() for the input field, the direction Intl never covered.",
    usage: `anyamount(1234567)                                             // "1.2M"
anyamount(1999, { mode: "currency", currency: "EUR" })         // "€1,999.00"
anyamount(3.2, { mode: "unit", unit: "gigabyte" })             // "3.2 GB"
anyamount(1234, { compact: true })                             // "1.2K" — badges; compact: false never abbreviates
anyamount.range(10, 20, { mode: "currency", currency: "EUR" }) // "€10.00 – 20.00"
anyamount.parse("1.999,50", { locale: "de" })                  // 1999.5 — NaN when it is not a number
anyamount.symbol("USD")                                        // "$"`,
    notFor:
      "Money arithmetic, exchange rates, decimal precision — do the maths in minor units or a decimal library, then format the result here.",
    runtime: "Node 18+, every modern browser, Deno, Bun, edge runtimes.",
  },
  anymany: {
    does:
      "Joins items into a sentence the way the locale does — \"a, b, and c\", \"a, b или c\" — sorted with the locale's collation and capped with a \"+N\" overflow.",
    wraps: "Intl.ListFormat, with Intl.Collator for sorting",
    why:
      "array.join(\", \") has no \"and\", no localized conjunction and no Oxford-comma logic, and sort() puts \"Öl\" after \"Zebra\". anymany does the list, the sort and the overflow in one call, ~0.7 kB, from any iterable.",
    usage: `anymany(["banana", "apple", "cherry"])                          // "banana, apple, and cherry"
anymany(["S", "M", "L"], { type: "disjunction" })               // "S, M, or L"
anymany(["Öl", "Zebra", "Apfel"], { sort: true, locale: "de" }) // "Apfel, Öl und Zebra"
anymany(tags, { max: 3 })                                       // "x, y, z, and +4"
anymany(new Set(["read", "write"]))                             // "read and write"`,
    notFor:
      "Comparing, deduplicating or searching strings — it returns one joined string and nothing else.",
    runtime: "Node 18+, every modern browser, Deno, Bun, edge runtimes.",
  },
  anyaround: {
    does:
      "Turns a region, language, script, currency or calendar code into its localized name — \"US\" → \"United States\", \"Соединенные Штаты\" — with the flag emoji when it is a country.",
    wraps: "Intl.DisplayNames",
    why:
      "Country and language name tables are hundreds of kilobytes and go stale; the runtime already has every name in 200+ locales. anyaround adds what Intl lacks — flags from Regional Indicator Symbols, detection of what kind of code it was given, a clear miss signal — in ~0.9 kB.",
    usage: `anyaround("US")                             // "United States"
anyaround("US", { display: "flag-name" })   // "🇺🇸 United States"
anyaround("de", { locale: "fr" })           // "allemand"
anyaround("EUR")                            // "Euro"
anyaround("Cyrl")                           // "Cyrillic"
anyaround.info("QZ", { mode: "region" })    // { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }`,
    notFor:
      "Listing every country (Intl cannot enumerate them — bring your own code list), cities and subdivisions, or looking a code up from its name.",
    runtime: "Node 18+, every modern browser, Deno, Bun, edge runtimes.",
  },
  anylong: {
    does:
      "Writes a duration down — \"2 hr, 30 min\", \"2:30:00\", \"2 часа 30 минут\" — from milliseconds, seconds, an ISO 8601 string, shorthand like \"2h 30m\", a record, or two Dates.",
    wraps: "Intl.DurationFormat",
    why:
      "Duration strings by hand are a pile of pluralised ifs that only work in English; humanize-duration bundles its own languages. anylong accepts every reasonable input, formats natively in any locale, and refuses ambiguous input like \"1:30\" instead of guessing.",
    usage: `anylong(9_000_000)                                        // "2 hr, 30 min"
anylong("PT2H30M", { locale: "ru" })                      // "2 ч 30 мин"
anylong("2 hours 30 minutes", { style: "long" })          // "2 hours, 30 minutes"
anylong({ hours: 2, minutes: 30 }, { style: "digital" })  // "2:30:00"
anylong(startedAt, finishedAt)                            // between two Dates, order-independent
anylong.supported                                         // false where Intl.DurationFormat is missing`,
    notFor:
      "Calendar arithmetic such as months between two dates, countdowns that tick, or negative durations.",
    runtime:
      "Node 23+, Chrome 129+, Firefox 132+, Safari 16.4+ (Baseline 2025) — branch on anylong.supported for older engines.",
  },
  anyplural: {
    does:
      "Picks the right plural form for a count and formats the two together — \"1 item\", \"5 items\", \"5 лет\", \"3rd\".",
    wraps: "Intl.PluralRules, with Intl.NumberFormat for the count",
    why:
      "n === 1 ? \"item\" : \"items\" is wrong in most languages — Russian has three forms, Arabic six, ordinals differ again. anyplural asks the runtime for the category, falls back along CLDR's own chain, and formats the number in the same locale. ~0.7 kB.",
    usage: `anyplural(5, { one: "item", other: "items" })                            // "5 items"
anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" })  // "5 лет"
anyplural(0, { zero: "no mail", one: "letter", other: "letters" })       // "no mail"
anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" }) // "3rd"
anyplural(1500, { other: "items" }, { locale: "en" })                     // "1,500 items"`,
    notFor:
      "Full message formatting with placeholders (ICU MessageFormat) — this is one number and one word.",
    runtime: "Node 18+, every modern browser, Deno, Bun, edge runtimes.",
  },
  anyword: {
    does:
      "Splits text into words, characters or sentences the way people see them — emoji stay whole, Thai and Chinese split without spaces — and counts or truncates on those boundaries.",
    wraps: "Intl.Segmenter",
    why:
      "\"👨‍👩‍👧\".length is 8, split(\" \") finds one word in a Thai sentence, slice() cuts an emoji in half. anyword hands you the runtime's real boundaries — for counters, previews and highlights — in ~0.8 kB.",
    usage: `anyword("don't stop 世界")                                  // ["don't", "stop", "世界"]
anyword("👨‍👩‍👧 hi", { by: "grapheme" })                       // ["👨‍👩‍👧", " ", "h", "i"]
anyword.count("héllo", { by: "grapheme" })                  // 5 — what a character counter should show
anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" })         // "héllo…"
anyword.parts("世界 test")                                  // [{ segment: "世界", index: 0, isWordLike: true }, …]
anyword.supported                                           // Intl.Segmenter present?`,
    notFor: "Stemming, tokenising for search, or language detection.",
    runtime:
      "Node 16+, Chrome 87+, Safari 14.1+, Firefox 125+ — branch on anyword.supported for older engines.",
  },
  anylocale: {
    does:
      "Reads how a locale behaves — text direction, first day of the week, weekend days, calendars, time zones, hour cycle, numbering systems — as one record.",
    wraps: "Intl.Locale info (getWeekInfo, getTextInfo, getCalendars, …)",
    why:
      "Hand-kept RTL lists, week-start tables and weekend rules go stale and miss cases like fa-IR's one-day weekend. The runtime knows; anylocale exposes it as one cached record, resolves fallback chains on real data, and works across the property and method forms engines ship.",
    usage: `anylocale("ar-EG").direction         // "rtl"
anylocale("en-GB").weekStart         // 1 — Monday; en-US is 7 (ISO numbering)
anylocale("fa-IR").weekend           // [5] — Friday only
anylocale("ar-EG").timeZones         // ["Africa/Cairo"]
anylocale(["xx-Nope", "de-DE"]).tag  // "de-DE" — first tag with data wins
anylocale.supported                  // Intl Locale Info present?`,
    notFor:
      "Naming a locale (that is anyaround), translating anything, or detecting the user's locale.",
    runtime:
      "Node 18+ (property form) or any engine with the method form — branch on anylocale.supported.",
  },
  anyfamily: {
    does: "All eight any* packages behind one import.",
    wraps: "anywhen, anyamount, anymany, anyaround, anylong, anyplural, anyword, anylocale",
    why:
      "One dependency instead of eight when an app wants the whole set. It re-exports the same function objects, so it tree-shakes to what you import and adds nothing on top.",
    usage: `import { anywhen, anyamount, anymany, anyaround, anylong, anyplural, anyword, anylocale } from "anyfamily";

anywhen(date, { mode: "relative" })                       // "3 hours ago"
anyamount(1999, { mode: "currency", currency: "EUR" })    // "€1,999.00"
anyaround("DE", { display: "flag-name" })                 // "🇩🇪 Germany"`,
    notFor: "React components — anyfamily-react has the hooks and the shared locale provider.",
    runtime: "Node 18+, every modern browser; anylong, anyword and anylocale carry their own support flags.",
  },
  "anyfamily-react": {
    does:
      "Every any* function as a hook, a provider that shares one locale and per-hook defaults across the tree, relative time that keeps itself fresh, and useAnyfamily() for the whole set bound at once.",
    wraps: "the eight any* packages, behind React context",
    why:
      "Threading a locale into forty call sites and a setInterval behind every \"3 minutes ago\" is what apps end up writing by hand. The provider does it once; useAnywhen ticks (one shared timer per interval); the arrays and objects are memoized so they are safe as effect dependencies.",
    usage: `<AnyfamilyProvider locale="de-DE" defaults={{ anyamount: { mode: "currency", currency: "EUR" } }}>

const when = useAnywhen(post.createdAt, { mode: "relative" })   // "vor 3 Minuten", ticks by itself
const cost = useAnyamount(1999)                                  // "1.999,00 €" — from the defaults
const words = useAnyword(text)                                   // memoized array
const { anywhen, anyaround } = useAnyfamily()                    // all eight, bound to the provider`,
    notFor: "Server Components — every export is behind \"use client\"; format on the server with anyfamily.",
    runtime: "React 18 or 19; Node 18+ for SSR.",
  },
};
