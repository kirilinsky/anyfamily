<p align="center">
  <img src="https://placehold.co/230x230?text=anyamount" alt="anyamount logo" width="230" />
</p>

<h1 align="center">anyamount</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyamount"><img src="https://img.shields.io/npm/v/anyamount?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyamount"><img src="https://img.shields.io/bundlephobia/minzip/anyamount?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyamount/actions/workflows/flow.yml"><img src="https://github.com/kirilinsky/anyamount/actions/workflows/flow.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyamount?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Tiny human-readable number formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn numbers into <code>"1.2M"</code>, <code>"€1,999.00"</code>, <code>"3.2 GB"</code>, or <code>"120 km/h"</code>.
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

`value` is a number.

```ts
anyamount(1234567);
anyamount(0.1234);
anyamount(-42.5);
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

Reads: `locale`, `currency`, `digits`.

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

| Option     | Type                              | Default        | Used by       |
| ---------- | --------------------------------- | -------------- | ------------- |
| `mode`     | `"smart" \| "currency" \| "unit"` | `"smart"`      | —             |
| `locale`   | `string \| string[]`              | runtime locale | all           |
| `currency` | `string` (ISO 4217)               | — (required)   | currency      |
| `unit`     | sanctioned unit identifier        | — (required)   | unit          |
| `style`    | `"long" \| "short" \| "narrow"`   | `"short"`      | smart, unit   |
| `digits`   | `number` (max fraction digits)    | smart default  | all           |

Each mode reads only the options that apply to it. The rest are ignored.
`currency` mode without `currency`, or `unit` mode without `unit`, throws a
clear `TypeError`.

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
  for v0.2.
- **No percent mode, no ranges, no parsing.** v0.1 is deliberately one
  function, three modes.
- **Exact output strings come from `Intl`** and may vary between ICU versions —
  don't snapshot them across environments.
- **Sanctioned units only.** `Intl` supports a fixed list of unit identifiers
  (and `-per-` compounds of them) — no arbitrary custom units.

---

## stability

anyamount follows [semver](https://semver.org/). This is a `0.x` trial
release: the API is small and may still move before 1.0. New options arrive
in minors; exact formatted strings come from `Intl` and may vary between ICU
versions, so never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 77+ · Firefox 78+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22, and 24.

---

## part of the any\* family

- [anywhen](https://github.com/kirilinsky/anywhen) — tiny smart date formatter. One function, three modes, any locale.
- **anyamount** — you are here.
