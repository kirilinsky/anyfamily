<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyfamily/main/packages/anylocale/logo.png" alt="anylocale" width="420" />
</p>

<h1 align="center">anylocale</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anylocale"><img src="https://img.shields.io/npm/v/anylocale?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anylocale"><img src="https://img.shields.io/bundlephobia/minzip/anylocale?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anylocale?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro locale-info reader built on native <code>Intl</code>.</strong>
  <br />
  Text direction, first day of the week, weekend days, calendars and time zones — for any locale.
</p>

<p align="center">
  <a href="https://anyfamily.site/anylocale">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anylocale">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Real CLDR answers. Any locale. ~1kb gzip. Zero dependencies.**

Everyone hardcodes this and everyone gets it wrong. Your runtime already ships
the correct table for 200+ locales — anylocale is the thin reader. No language
lists, no data files, no config.

```ts
import { anylocale } from "anylocale";

anylocale("ar-EG").direction;  // "rtl"
anylocale("en-GB").weekStart;  // 1 — Monday
anylocale("en-US").weekStart;  // 7 — Sunday, same language
anylocale("fa-IR").weekend;    // [5] — Friday only, not a pair
anylocale("ar-EG").timeZones;  // ["Africa/Cairo"]
```

---

## install

```bash
npm install anylocale
```

---

## usage

```ts
anylocale(tag);
anylocale([tag, fallback]);
```

`tag` is a BCP 47 locale tag, or an array used as a fallback chain — the first
tag the runtime actually has data for wins.

Fields are computed on access, so reading `direction` never asks the runtime for
calendars or time zones. The record still spreads and serialises like a plain
object.

```ts
const { direction, weekStart } = anylocale(navigator.language);

JSON.stringify(anylocale("en-US"));
// {"tag":"en-US","direction":"ltr","weekStart":7,…}
```

`anylocale.supported` reports whether the runtime exposes Intl Locale Info at
all — see [compatibility](#compatibility).

---

## recipes

Copy, paste, move on.

```tsx
// Set document direction without a hand-kept RTL language list
document.documentElement.dir = anylocale(userLocale).direction;

// …or in React
<html lang={locale} dir={anylocale(locale).direction}>

// Order the columns of a date picker
const start = anylocale(locale).weekStart;              // 1–7, ISO
const days = Array.from({ length: 7 }, (_, i) => ((start - 1 + i) % 7) + 1);

// Highlight weekend cells — not always Saturday and Sunday
const weekend = new Set(anylocale(locale).weekend);
const isWeekend = (isoDay: number) => weekend.has(isoDay);

// 12- or 24-hour clock, per the locale rather than per the language
const use12h = anylocale(locale).hourCycles[0] === "h12";

// Offer the calendar the region actually uses
anylocale("fa-IR").calendars[0];   // "persian"
anylocale("th-TH").calendars[0];   // "buddhist"

// Suggest a default time zone from the user's locale
anylocale("ar-EG").timeZones[0];   // "Africa/Cairo"

// Degrade gracefully on runtimes without Intl Locale Info
const dir = anylocale.supported ? anylocale(locale).direction : "ltr";
```

anylocale is pure and synchronous — no clock, no state — so server and client
render identically.

---

## fields

| Field | Type | What it is |
| --- | --- | --- |
| `tag` | `string` | the canonical tag that was resolved — `"en-us"` → `"en-US"` |
| `direction` | `"ltr" \| "rtl"` | text direction of the locale's script |
| `weekStart` | `1`–`7` | first day of the week, **ISO** numbering |
| `weekend` | `number[]` | days counted as the weekend, ISO numbering |
| `minimalDays` | `number` | days of a week that must fall in a year for it to be that year's first week |
| `calendars` | `string[]` | usable calendars, preferred first |
| `timeZones` | `string[]` | IANA zones for the region; empty for language-only tags |
| `hourCycles` | `string[]` | `"h12"`, `"h23"`, … preferred first |
| `numberingSystems` | `string[]` | `"latn"`, `"arab"`, … preferred first |

**`weekStart` and `weekend` are ISO: 1 is Monday, 7 is Sunday.** JavaScript's
`Date.prototype.getDay()` is not — it returns 0 for Sunday. Convert with
`iso % 7`.

→ [Every field, with the surprising cases](https://anyfamily.site/docs/anylocale#fields)

---

## what people get wrong

Straight from the data, not from opinion:

| | `en-US` | `en-GB` | `ar-EG` | `he-IL` | `fa-IR` |
| --- | --- | --- | --- | --- | --- |
| direction | ltr | ltr | rtl | rtl | rtl |
| week starts | Sun | **Mon** | Sat | Sun | Sat |
| weekend | Sat, Sun | Sat, Sun | **Fri, Sat** | Fri, Sat | **Fri** |
| clock | h12 | **h23** | h12 | h23 | h23 |
| digits | latn | latn | **arab** | latn | arabext |

- **Same language, different week.** `en-US` starts Sunday, `en-GB` Monday. A
  table keyed on language is wrong for half the English-speaking world.
- **The weekend is not always a pair.** `fa-IR` has one day.
- **RTL does not imply Arabic digits.** `he-IL` is right-to-left and uses Latin
  numerals.
- **Nor does language decide the clock.** `en-US` is 12-hour, `en-GB` is 24.

---

## locales

Any valid BCP 47 tag. A fallback chain resolves to the first tag the runtime has
**data** for, not merely the first that parses — `"xx-Nope"` is well-formed BCP
47 and would otherwise win.

```ts
anylocale("pt-BR").tag;                  // "pt-BR"
anylocale(["xx-Nope", "de-DE"]).tag;     // "de-DE"
anylocale("en-us").tag;                  // "en-US"  — canonicalised
```

If no tag in the chain has data, the first well-formed one is used and the
runtime answers with its own defaults, rather than throwing.

---

## vs the alternatives

| | anylocale | rtl-detect | hand-kept tables |
| --- | :---: | :---: | :---: |
| gzip | **~1kb** | ~2kb | 0 (yours) |
| locale data bundled | **no** | yes | yes |
| covers | **direction, week, calendars, zones, clock, digits** | direction | whatever you wrote |
| stays current | **with the runtime's ICU** | with releases | never |
| dependencies | **0** | 0 | 0 |

anylocale answers how a locale *behaves*. For what a code is *called* —
`"US"` → `"United States"` — that is
[anyaround](https://anyfamily.site/anyaround)'s job.

---

## stability

anylocale follows [semver](https://semver.org/). The public API is a single
export — `anylocale`, with `anylocale.supported` on it — plus `AnylocaleInfo`
and the exported types. It only changes shape in a major release.

Values come from the runtime's CLDR data and can shift between ICU versions, so
test behaviour rather than exact arrays.

---

## compatibility

Intl Locale Info reached Stage 4 (ES2026). It was standardised **twice**: first
as properties (`locale.weekInfo`), then as methods (`locale.getWeekInfo()`).
Engines are split — Node 22 ships only the properties, and nothing else in the
family has to deal with two shapes of the same API. anylocale reads whichever it
finds, so you never have to.

Because support is uneven and moving, **feature-detect rather than trust a
version table**:

```ts
const dir = anylocale.supported ? anylocale(locale).direction : "ltr";
```

`anylocale.supported` is `false` on engines with neither shape, and every call
throws there. The package itself runs anywhere Node 18+ runs; the *data* is what
may be missing.

CI runs the full suite on Node 20, 22 and 24, skipping the data-dependent tests
wherever the API is absent.

---

## the any family

anylocale is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [anylong](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
| [anyplural](https://anyfamily.site/anyplural) | plurals | `Intl.PluralRules` |
| [anyword](https://anyfamily.site/anyword) | words & graphemes | `Intl.Segmenter` |
| [**anylocale**](https://anyfamily.site/anylocale) | locale behaviour | `Intl.Locale` info |

Want all of them? [`anyfamily`](https://www.npmjs.com/package/anyfamily) is one
install for the lot, and [`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)
wraps each as a hook with a shared locale provider.

```bash
npm install anyfamily
```

---

MIT © [kirilinsky](https://github.com/kirilinsky)
