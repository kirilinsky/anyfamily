"use client";

// Presets carry `run` functions, and app/page.tsx — a server component — hands
// them to <CodeAnimation>. Functions cannot cross that boundary as values; they
// can as references into a client module. That is the only reason this data
// file is marked "use client". Remove the directive and the build fails.

import { anyaround } from "anyaround";
import { anyamount } from "anyamount";
import { anywhen } from "anywhen";
import { anymany } from "anymany";
import { anylong } from "anylong";
import { anyplural } from "anyplural";
import { anyword } from "anyword";
import { anylocale } from "anylocale";

/**
 * A canned demo. `call` is the source shown typing out; `run` invokes the real
 * published package so the revealed output is genuine, never hardcoded. anywhen
 * presets pass a fixed `now` so relative/smart output stays deterministic.
 */
export type Preset = { call: string; run: () => string; fn?: string };

// Ordered simplest-first: the bare one-argument call leads, so the essence of
// each package reads immediately before the option-rich variants appear.
export const AROUND_PRESETS: Preset[] = [
  { call: `anyaround("US")`, run: () => anyaround("US") },
  { call: `anyaround("JPY")`, run: () => anyaround("JPY") },
  { call: `anyaround("Cyrl")`, run: () => anyaround("Cyrl") },
  { call: `anyaround("US", { display: "flag-name" })`, run: () => anyaround("US", { display: "flag-name" }) },
  { call: `anyaround("DE", { locale: "fr", display: "flag-name" })`, run: () => anyaround("DE", { locale: "fr", display: "flag-name" }) },
  { call: `anyaround("GBP", { locale: "ja" })`, run: () => anyaround("GBP", { locale: "ja" }) },
];

export const AMOUNT_PRESETS: Preset[] = [
  { call: `anyamount(1234567)`, run: () => anyamount(1234567, { locale: "en" }) },
  { call: `anyamount(9_007_199_254_740_993n)`, run: () => anyamount(BigInt("9007199254740993"), { locale: "en" }) },
  { call: `anyamount(1999.5, { mode: "currency", currency: "EUR", locale: "de" })`, run: () => anyamount(1999.5, { mode: "currency", currency: "EUR", locale: "de" }) },
  { call: `anyamount(3.2, { mode: "unit", unit: "kilometer-per-hour", style: "long" })`, run: () => anyamount(3.2, { mode: "unit", unit: "kilometer-per-hour", style: "long", locale: "en" }) },
  { call: `anyamount(2500000, { style: "long", locale: "fr" })`, run: () => anyamount(2500000, { style: "long", locale: "fr" }) },
  { call: `anyamount(1500.5, { mode: "unit", unit: "gigabyte", style: "long" })`, run: () => anyamount(1500.5, { mode: "unit", unit: "gigabyte", style: "long", locale: "en" }) },
  { call: `anyamount.range(10, 20, { mode: "currency", currency: "EUR" })`, run: () => anyamount.range(10, 20, { mode: "currency", currency: "EUR", locale: "en" }) },
  { call: `anyamount.parse("1.999,50", { locale: "de" })`, run: () => String(anyamount.parse("1.999,50", { locale: "de" })) },
  { call: `anyamount(1234, { compact: true })`, run: () => anyamount(1234, { compact: true, locale: "en" }) },
];

const NOW = "2026-07-11T12:00:00";
export const WHEN_PRESETS: Preset[] = [
  { call: `anywhen("2026-07-11T11:50", { mode: "relative" })`, run: () => anywhen("2026-07-11T11:50", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-11T12:10", { mode: "relative" })`, run: () => anywhen("2026-07-11T12:10", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-12T09:00", { mode: "smart" })`, run: () => anywhen("2026-07-12T09:00", { mode: "smart", now: NOW }) },
  { call: `anywhen("2026-07-14", { mode: "relative" })`, run: () => anywhen("2026-07-14", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-25", { mode: "relative" })`, run: () => anywhen("2026-07-25", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-11", { locale: "ja", format: { dateStyle: "long" } })`, run: () => anywhen("2026-07-11", { mode: "absolute", locale: "ja", format: { dateStyle: "long" } }) },
  { call: `anywhen.range("2026-07-12", "2026-07-15", { format: { day: "numeric", month: "short" } })`, run: () => anywhen.range("2026-07-12", "2026-07-15", { locale: "en", timeZone: "UTC", format: { day: "numeric", month: "short" } }) },
];

export const MANY_PRESETS: Preset[] = [
  { call: `anymany(["a", "b", "c"])`, run: () => anymany(["a", "b", "c"]) },
  { call: `anymany(["red", "green", "blue"], { type: "disjunction" })`, run: () => anymany(["red", "green", "blue"], { type: "disjunction" }) },
  { call: `anymany(["1h", "30m"], { type: "unit" })`, run: () => anymany(["1h", "30m"], { type: "unit" }) },
  { call: `anymany(["poire", "pomme"], { locale: "fr", sort: true })`, run: () => anymany(["poire", "pomme"], { locale: "fr", sort: true }) },
  { call: `anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" })`, run: () => anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" }) },
  { call: `anymany(["赤", "青"], { type: "disjunction", locale: "ja" })`, run: () => anymany(["赤", "青"], { type: "disjunction", locale: "ja" }) },
  { call: `anymany(new Set(["read", "write", "read"]))`, run: () => anymany(new Set(["read", "write", "read"])) },
];

export const LONG_PRESETS: Preset[] = [
  { call: `anylong(9_000_000)`, run: () => anylong(9_000_000, { locale: "en" }) },
  { call: `anylong("PT2H30M")`, run: () => anylong("PT2H30M", { locale: "en" }) },
  { call: `anylong("2h 30m", { style: "long" })`, run: () => anylong("2h 30m", { style: "long", locale: "en" }) },
  { call: `anylong({ hours: 2, minutes: 30 }, { style: "digital" })`, run: () => anylong({ hours: 2, minutes: 30 }, { style: "digital", locale: "en" }) },
  { call: `anylong("P1DT4H", { locale: "es", style: "long" })`, run: () => anylong("P1DT4H", { locale: "es", style: "long" }) },
  { call: `anylong(new Date("2026-01-10"), new Date("2026-03-15"))`, run: () => anylong(new Date("2026-01-10"), new Date("2026-03-15"), { largestUnit: "weeks", smallestUnit: "days", style: "long", locale: "en" }) },
];

export const PLURAL_PRESETS: Preset[] = [
  { call: `anyplural(1, { one: "item", other: "items" })`, run: () => anyplural(1, { one: "item", other: "items" }, { locale: "en" }) },
  { call: `anyplural(5, { one: "item", other: "items" })`, run: () => anyplural(5, { one: "item", other: "items" }, { locale: "en" }) },
  { call: `anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" })`, run: () => anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal", locale: "en" }) },
  { call: `anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" })`, run: () => anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" }) },
  { call: `anyplural(0, { zero: "No messages", one: "message", other: "messages" })`, run: () => anyplural(0, { zero: "No messages", one: "message", other: "messages" }, { locale: "en" }) },
  { call: `anyplural(12480, { one: "email", other: "emails" })`, run: () => anyplural(12480, { one: "email", other: "emails" }, { locale: "en" }) },
];

// anyword returns arrays, not strings — render them as the array literal a
// reader would have typed, so the segment boundaries stay visible.
const arr = (segments: string[]) =>
  `[${segments.map((s) => JSON.stringify(s)).join(", ")}]`;

export const WORD_PRESETS: Preset[] = [
  { call: `anyword("don't stop 世界")`, run: () => arr(anyword("don't stop 世界", { locale: "en" })) },
  { call: `anyword("สวัสดีตอนเช้า", { locale: "th" })`, run: () => arr(anyword("สวัสดีตอนเช้า", { locale: "th" })) },
  { call: `anyword("👨‍👩‍👧‍👦!", { by: "grapheme" })`, run: () => arr(anyword("👨‍👩‍👧‍👦!", { by: "grapheme", locale: "en" })) },
  { call: `anyword("Hi. Go now!", { by: "sentence" })`, run: () => arr(anyword("Hi. Go now!", { by: "sentence", locale: "en" })) },
  { fn: `anyword.count`, call: `anyword.count("👨‍👩‍👧‍👦", { by: "grapheme" })`, run: () => String(anyword.count("👨‍👩‍👧‍👦", { by: "grapheme", locale: "en" })) },
  { fn: `anyword.truncate`, call: `anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" })`, run: () => anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…", locale: "en" }) },
];

// anylocale returns a record, not a string — each preset shows the one field
// that makes the point, so the reveal stays a single readable value.
export const LOCALE_PRESETS: Preset[] = [
  { call: `anylocale("ar-EG").direction`, run: () => anylocale("ar-EG").direction },
  { call: `anylocale("en-US").weekStart`, run: () => String(anylocale("en-US").weekStart) },
  { call: `anylocale("en-GB").weekStart`, run: () => String(anylocale("en-GB").weekStart) },
  { call: `anylocale("fa-IR").weekend`, run: () => JSON.stringify(anylocale("fa-IR").weekend) },
  { call: `anylocale("ar-EG").timeZones`, run: () => arr(anylocale("ar-EG").timeZones) },
  { call: `anylocale("fa-IR").calendars[0]`, run: () => anylocale("fa-IR").calendars[0] ?? "—" },
];

// Meta-package tour: cycles one import + call per any* package, all from
// "anyfamily" — `fn` overrides the accent-colored prefix per preset since it
// varies (the import clause), unlike the single-package demos above.
export const FAMILY_PRESETS: Preset[] = [
  {
    fn: `import { anywhen } from "anyfamily";`,
    call: `import { anywhen } from "anyfamily";\n\nanywhen("2026-07-08", { mode: "relative" })`,
    run: () => anywhen("2026-07-08", { mode: "relative", now: NOW }),
  },
  {
    fn: `import { anyamount } from "anyfamily";`,
    call: `import { anyamount } from "anyfamily";\n\nanyamount(1999.5, { mode: "currency", currency: "USD" })`,
    run: () => anyamount(1999.5, { mode: "currency", currency: "USD" }),
  },
  {
    fn: `import { anymany } from "anyfamily";`,
    call: `import { anymany } from "anyfamily";\n\nanymany(["red", "green", "blue"], { type: "disjunction" })`,
    run: () => anymany(["red", "green", "blue"], { type: "disjunction" }),
  },
  {
    fn: `import { anyaround } from "anyfamily";`,
    call: `import { anyaround } from "anyfamily";\n\nanyaround("JPY")`,
    run: () => anyaround("JPY"),
  },
  {
    fn: `import { anylong } from "anyfamily";`,
    call: `import { anylong } from "anyfamily";\n\nanylong("PT2H30M")`,
    run: () => anylong("PT2H30M", { locale: "en" }),
  },
  {
    fn: `import { anyplural } from "anyfamily";`,
    call: `import { anyplural } from "anyfamily";\n\nanyplural(5, { one: "item", other: "items" })`,
    run: () => anyplural(5, { one: "item", other: "items" }, { locale: "en" }),
  },
  {
    fn: `import { anyword } from "anyfamily";`,
    call: `import { anyword } from "anyfamily";\n\nanyword("don't stop 世界")`,
    run: () => arr(anyword("don't stop 世界", { locale: "en" })),
  },
  {
    fn: `import { anylocale } from "anyfamily";`,
    call: `import { anylocale } from "anyfamily";\n\nanylocale("ar-EG").direction`,
    run: () => anylocale("ar-EG").direction,
  },
];

// anyfamily-react tour: cycles one hook call per any* package. `run` calls
// the plain function each hook wraps — same output, no live component tree
// needed to invoke a hook outside of React.
export const REACT_PRESETS: Preset[] = [
  {
    fn: `useAnywhen`,
    call: `useAnywhen(date, { mode: "relative" })`,
    run: () => anywhen("2026-07-08", { mode: "relative", now: NOW }),
  },
  {
    fn: `useAnyamount`,
    call: `useAnyamount(1999.5, { mode: "currency", currency: "USD" })`,
    run: () => anyamount(1999.5, { mode: "currency", currency: "USD" }),
  },
  {
    fn: `useAnymany`,
    call: `useAnymany(["red", "green", "blue"], { type: "disjunction" })`,
    run: () => anymany(["red", "green", "blue"], { type: "disjunction" }),
  },
  {
    fn: `useAnyaround`,
    call: `useAnyaround("JPY")`,
    run: () => anyaround("JPY"),
  },
  {
    fn: `useAnylong`,
    call: `useAnylong("PT2H30M")`,
    run: () => anylong("PT2H30M", { locale: "en" }),
  },
  {
    fn: `useAnyplural`,
    call: `useAnyplural(5, { one: "item", other: "items" })`,
    run: () => anyplural(5, { one: "item", other: "items" }, { locale: "en" }),
  },
  {
    fn: `useAnyword`,
    call: `useAnyword("don't stop 世界")`,
    run: () => arr(anyword("don't stop 世界", { locale: "en" })),
  },
  {
    fn: `useAnylocale`,
    call: `useAnylocale("ar-EG").direction`,
    run: () => anylocale("ar-EG").direction,
  },
  {
    fn: `useAnyfamily`,
    call: `const { anyaround } = useAnyfamily();\n\nanyaround("DE", { display: "flag-name" })`,
    run: () => anyaround("DE", { display: "flag-name", locale: "en" }),
  },
];
