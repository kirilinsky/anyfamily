<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyamount/main/logo.png" alt="anyamount logo" width="420" />
</p>

<h1 align="center">anyamount</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyamount"><img src="https://img.shields.io/npm/v/anyamount?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyamount"><img src="https://img.shields.io/bundlephobia/minzip/anyamount?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyamount/actions/workflows/flow.yml"><img src="https://github.com/kirilinsky/anyamount/actions/workflows/flow.yml/badge.svg" alt="CI" /></a>
  <a href="https://codecov.io/gh/kirilinsky/anyamount"><img src="https://img.shields.io/codecov/c/github/kirilinsky/anyamount?style=flat-square&color=black" alt="coverage" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyamount?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Tiny human-readable number formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn numbers into <code>"1.2M"</code>, <code>"€1,999.00"</code>, <code>"3.2 GB"</code>, or <code>"120 km/h"</code>.
</p>

<p align="center">
  <a href="https://anyamount.vercel.app/">▸ live demo</a>
</p>

---

**One function. Smart defaults. Any locale. ~0.7kb gzip. Zero dependencies.**

`Intl.NumberFormat` is powerful. anyamount makes it usable.

Built for dashboards, feeds, pricing pages, file lists, and stats — anywhere a
raw number should read like a person wrote it. No locale files. No plugins. No
config.

```ts
import { anyamount } from "anyamount";

anyamount(1234567);
// "1.2M"  — smart mode (default)

anyamount(42);
// "42"

anyamount(1999, { mode: "currency", currency: "EUR" });
// "€1,999.00"

anyamount(3.2, { mode: "unit", unit: "gigabyte" });
// "3.2 GB"

anyamount(120, { mode: "unit", unit: "kilometer-per-hour", locale: "ru" });
// "120 км/ч"
```

---

## install

```bash
npm install anyamount
```

---

## usage

```ts
anyamount(value);
anyamount(value, options);
```

`value` is a number or a bigint — every mode accepts both. `±Infinity`
formats as the locale's infinity symbol (`"∞"`); `NaN` throws.

```ts
anyamount(1234567);
anyamount(0.1234);
anyamount(-42.5);
anyamount(123456789012345678901n);   // beyond MAX_SAFE_INTEGER, no precision loss
```

---

## modes

The `mode` option picks the rendering strategy. Default is `"smart"`.

### smart

Context-aware. Compact notation for big numbers, plain formatting for small
ones — the cutoff is `|value| >= 10000`.

```ts
anyamount(1234567, { locale: "en" });   // "1.2M"
anyamount(10000, { locale: "en" });     // "10K"
anyamount(9999, { locale: "en" });      // "9,999"
anyamount(42, { locale: "en" });        // "42"
anyamount(0.1234, { locale: "en" });    // "0.12"

anyamount(1234567, { locale: "en", style: "long" });
// "1.2 million"

anyamount(1234567, { locale: "en", digits: 2 });
// "1.23M"
```

Fraction digits default to 2 for plain numbers and 1 for compact ones.

Reads: `locale`, `style`, `digits`.

### currency

Money via the `Intl.NumberFormat` currency style. `currency` is required —
any ISO 4217 code.

```ts
anyamount(1999, { mode: "currency", currency: "EUR", locale: "en" });
// "€1,999.00"

anyamount(1999, { mode: "currency", currency: "RSD", locale: "sr" });
// "1.999,00 RSD"

anyamount(1999, { mode: "currency", currency: "JPY", locale: "ja" });
// "￥1,999"  — JPY has no minor unit, Intl knows

anyamount(1999.99, { mode: "currency", currency: "EUR", locale: "en", digits: 0 });
// "€2,000"
```

Fraction digits default to the currency's own (2 for EUR, 0 for JPY).

`currencyDisplay` picks how the currency itself is spelled — symbol by
default, opt into anything else:

```ts
anyamount(1999, { mode: "currency", currency: "USD", locale: "en" });
// "$1,999.00"  — "symbol" (default)

anyamount(1999, { mode: "currency", currency: "USD", locale: "en-CA", currencyDisplay: "narrowSymbol" });
// "$1,999.00"  — bare symbol, where the locale would otherwise print "US$"

anyamount(1999, { mode: "currency", currency: "USD", locale: "en", currencyDisplay: "code" });
// "USD 1,999.00"

anyamount(1999, { mode: "currency", currency: "USD", locale: "en", currencyDisplay: "name" });
// "1,999.00 US dollars"
```

Reads: `locale`, `currency`, `currencyDisplay`, `digits`.

### unit

Measurements via the `Intl.NumberFormat` unit style. `unit` is required —
any sanctioned identifier, including compound `"<unit>-per-<unit>"` pairs.
The `unit` option is typed as a union, so your editor autocompletes it.

```ts
anyamount(3.2, { mode: "unit", unit: "gigabyte", locale: "en" });
// "3.2 GB"

anyamount(120, { mode: "unit", unit: "kilometer-per-hour", locale: "en" });
// "120 km/h"

anyamount(3.2, { mode: "unit", unit: "gigabyte", locale: "en", style: "long" });
// "3.2 gigabytes"

anyamount(5, { mode: "unit", unit: "kilometer", locale: "en", style: "narrow" });
// "5km"
```

Fraction digits default to 2.

Reads: `locale`, `unit`, `style`, `digits`.

---

## options

| Option            | Type                                                | Default        | Used by     |
| ----------------- | --------------------------------------------------- | -------------- | ----------- |
| `mode`            | `"smart" \| "currency" \| "unit"`                    | `"smart"`      | —           |
| `locale`          | `string \| string[]`                                 | runtime locale | all         |
| `currency`        | `string` (ISO 4217)                                  | — (required)   | currency    |
| `currencyDisplay` | `"symbol" \| "narrowSymbol" \| "code" \| "name"`     | `"symbol"`     | currency    |
| `unit`            | sanctioned unit identifier                           | — (required)   | unit        |
| `style`           | `"long" \| "short" \| "narrow"`                      | `"short"`      | smart, unit |
| `digits`          | `number` → `maximumFractionDigits`                   | per mode       | all         |

### digits

`digits` maps to `maximumFractionDigits` — a ceiling, not a fixed width. The
fraction is rounded to at most that many digits, and trailing zeros are never
padded on:

```ts
anyamount(2.5, { locale: "en", digits: 2 });     // "2.5"   — not "2.50"
anyamount(2.567, { locale: "en", digits: 2 });   // "2.57"
anyamount(3, { mode: "unit", unit: "gigabyte", locale: "en", digits: 2 });
// "3 GB"  — not "3.00 GB"
```

Currency mode is the exception, because the currency carries its own minimum
(2 for EUR, 0 for JPY) and `Intl` keeps it:

```ts
anyamount(2.5, { mode: "currency", currency: "EUR", locale: "en" });
// "€2.50"  — padded to EUR's minimum

anyamount(2.5, { mode: "currency", currency: "EUR", locale: "en", digits: 1 });
// "€2.5"   — a digits below the minimum lowers both

anyamount(2, { mode: "currency", currency: "EUR", locale: "en", digits: 4 });
// "€2.00"  — raising the ceiling does not raise the minimum
```

Fixed-width output for every mode is not an option today — use
`anyamountParts()` and pad the `fraction` part yourself if you need it.

The options type is a discriminated union on `mode` — TypeScript requires
`currency` in currency mode and `unit` in unit mode at compile time, and
rejects options that don't belong to the mode. From plain JavaScript, the
same rules hold at runtime: a missing `currency` or `unit` throws a clear
`TypeError`, and stray options are ignored.

---

## parts

`anyamountParts()` accepts the same arguments as `anyamount()` and returns the
`Intl.NumberFormat.formatToParts` output unchanged — style the number apart
from the currency symbol or unit, or rebuild the string your own way.

```tsx
import { anyamountParts } from "anyamount";

anyamountParts(1999, { mode: "currency", currency: "EUR", locale: "en" });
// [
//   { type: "currency", value: "€" },
//   { type: "integer", value: "1" },
//   { type: "group", value: "," },
//   { type: "integer", value: "999" },
//   { type: "decimal", value: "." },
//   { type: "fraction", value: "00" },
// ]

// React: shrink the currency symbol
anyamountParts(price, { mode: "currency", currency: "EUR" }).map((p, i) =>
  p.type === "currency" ? <small key={i}>{p.value}</small> : p.value,
);
```

---

## symbol

`anyamountSymbol()` resolves an ISO 4217 code to its localized symbol, with no
number attached — for labels, currency pickers, and input affixes, where the
amount is rendered separately (or not at all).

```ts
import { anyamountSymbol } from "anyamount";

anyamountSymbol("USD", { locale: "en" });   // "$"
anyamountSymbol("EUR", { locale: "en" });   // "€"
anyamountSymbol("GBP", { locale: "en" });   // "£"
anyamountSymbol("JPY", { locale: "ja" });   // "￥"
anyamountSymbol("RUB", { locale: "ru" });   // "₽"

anyamountSymbol("USD", { locale: "en", display: "code" });   // "USD"
anyamountSymbol("USD", { locale: "en", display: "name" });   // "US dollars"
```

`display` defaults to `"narrowSymbol"` — the bare symbol, never the
disambiguated `"US$"` some locales prefer. Codes with no symbol in the
locale's data come back as the code itself (`"XAU"` → `"XAU"`), same as `Intl`
renders them. A malformed code throws a `RangeError` from `Intl`.

Formatting a full amount? Stay in currency mode with `currencyDisplay` — this
is the escape hatch for when there is no amount.

---

## locales

Pass any valid BCP 47 tag — including regional variants like `en-GB`, `zh-TW`,
`pt-BR`. Fallback arrays also work.

```ts
anyamount(1234567, { locale: "ru" });   // "1,2 млн"
anyamount(1234567, { locale: "de" });   // "1,2 Mio."
anyamount(1234567, { locale: "ja" });   // "123.5万"
anyamount(1234567, { locale: ["sr-Latn-RS", "en"] });

anyamount(1999, { mode: "currency", currency: "USD", locale: "de" });
// "1.999,00 $"
```

When omitted, native `Intl` uses the runtime locale.

Output is pure — no `Date.now()`, no environment reads — so server and client
render identically. SSR-safe by construction.

---

## vs the alternatives

|                     | anyamount  | pretty-bytes | filesize | numeral |
| ------------------- | :--------: | :----------: | :------: | :-----: |
| gzip                | **~0.7kb** |     ~1kb     |   ~3kb   |  ~5kb   |
| currency            |  **yes**   |      no      |    no    |   yes   |
| units beyond bytes  |  **yes**   |      no      |    no    |   no    |
| localized output    | **200+ locales** |  partial | partial | manual locale files |
| dependencies        |   **0**    |      0       |    0     |    0    |

---

## limitations

Honest ones:

- **No byte auto-scaling yet.** `anyamount(3200000000, { mode: "unit", unit: "byte" })`
  will not pick `GB` for you — pass the unit you want. Auto-scaling is planned
  for a future minor.
- **No percent mode, no ranges, no parsing.** Deliberately one function,
  three modes.
- **Exact output strings come from `Intl`** and may vary between ICU versions —
  don't snapshot them across environments.
- **Sanctioned units only.** `Intl` supports a fixed list of unit identifiers
  (and `-per-` compounds of them) — no arbitrary custom units.

---

## stability

anyamount follows [semver](https://semver.org/). The `1.x` API is stable:
new options arrive in minors, breaking changes only in majors. Exact
formatted strings come from `Intl` and may vary between ICU versions, so
never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 77+ · Firefox 78+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22, and 24.

---

## part of the any\* family

- [anywhen](https://github.com/kirilinsky/anywhen) — tiny smart date formatter. One function, three modes, any locale.
- [anymany](https://anymany.vercel.app/) — tiny Intl list formatter. Sort and join string arrays in any locale.
- **anyamount** — you are here.
