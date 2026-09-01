<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyfamily/main/packages/anyamount/logo.png" alt="anyamount" width="420" />
</p>

<h1 align="center">anyamount</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyamount"><img src="https://img.shields.io/npm/v/anyamount?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyamount"><img src="https://img.shields.io/bundlephobia/minzip/anyamount?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyamount?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Tiny human-readable number formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn numbers into <code>"1.2M"</code>, <code>"€1,999.00"</code>, <code>"3.2 GB"</code>, or <code>"120 км/ч"</code>.
</p>

<p align="center">
  <a href="https://anyfamily.site/anyamount">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anyamount">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Three modes. Any locale. ~1kb gzip. Zero dependencies.**

`Intl.NumberFormat` is powerful. anyamount makes it usable. Built for
dashboards, pricing, storage meters and stats — anywhere a raw number should
read like a person wrote it. No locale files, no plugins, no config.

```ts
import { anyamount } from "anyamount";

anyamount(1234567);                                     // "1.2M"  — smart (default)
anyamount(1999, { mode: "currency", currency: "EUR" }); // "€1,999.00"
anyamount(3.2, { mode: "unit", unit: "gigabyte" });     // "3.2 GB"
anyamount(1234567, { locale: "ru" });                   // "1,2 млн"
anyamount.symbol("USD");                                // "$"
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

`value` is a `number` or a `bigint`.

`anyamount.parts()` takes the same arguments and returns the
`Intl.NumberFormat.formatToParts` output — style the number apart from the
currency symbol or unit.

```tsx
anyamount.parts(1999, { mode: "currency", currency: "EUR", locale: "en" });
// [{ type: "currency", value: "€" }, { type: "integer", value: "1" }, …]

anyamount.parts(price, { mode: "currency", currency: "EUR" }).map((p, i) =>
  p.type === "currency" ? <small key={i}>{p.value}</small> : p.value,
);
```

`anyamount.symbol()` takes a **currency code** rather than an amount, and
returns the bare symbol — for labels, currency pickers and input affixes.

```ts
anyamount.symbol("USD", { locale: "en" });                  // "$"
anyamount.symbol("JPY", { locale: "ja" });                  // "￥"
anyamount.symbol("USD", { locale: "en", display: "code" }); // "USD"
anyamount.symbol("USD", { locale: "en", display: "name" }); // "US dollars"
```

---

## recipes

Copy, paste, move on.

```ts
// Dashboard stat
anyamount(views, { locale: "en" });
// "1.2M"

// …spelled out
anyamount(views, { locale: "en", style: "long" });
// "1.2 million"

// Price
anyamount(product.cents / 100, { mode: "currency", currency: "EUR", locale: "de" });
// "1.999,00 €"

// Price with no cents
anyamount(total, { mode: "currency", currency: "EUR", digits: 0 });
// "€2,000"

// Storage meter
anyamount(file.gb, { mode: "unit", unit: "gigabyte" });
// "3.2 GB"

// Speed, compound unit
anyamount(120, { mode: "unit", unit: "kilometer-per-hour", locale: "ru" });
// "120 км/ч"

// Currency affix inside an input, amount rendered separately
anyamount.symbol(account.currency);
// "$"
```

Output is pure — no clock reads, no environment sniffing — so server and client
render identically. Pass an explicit `locale` to keep it that way.

---

## modes

`mode` picks the rendering strategy. Each mode reads only the options that apply
to it; the rest are ignored.

| Mode | Does | Reads |
| --- | --- | --- |
| `"smart"` (default) | compact from `10000` up, plain below | `locale`, `style`, `digits` |
| `"currency"` | money; `currency` required | `locale`, `currency`, `currencyDisplay`, `digits` |
| `"unit"` | measurements; `unit` required | `locale`, `unit`, `style`, `digits` |

```ts
anyamount(1234567);  // "1.2M"
anyamount(10000);    // "10K"
anyamount(9999);     // "9,999"   — below the compact cutoff
anyamount(0.1234);   // "0.12"
```

A missing `currency` or `unit` throws a `TypeError`. The options type is a
discriminated union on `mode`, so TypeScript requires them at compile time.

→ [Every mode broken down](https://anyfamily.site/docs/anyamount#modes)

---

## options

| Option | Type | Default | Used by |
| --- | --- | --- | --- |
| `mode` | `"smart" \| "currency" \| "unit"` | `"smart"` | — |
| `locale` | `string \| string[]` | runtime locale | all |
| `currency` | `string` (ISO 4217) | required | currency |
| `currencyDisplay` | `"symbol" \| "narrowSymbol" \| "code" \| "name"` | `"symbol"` | currency |
| `unit` | sanctioned unit identifier | required | unit |
| `style` | `"long" \| "short" \| "narrow"` | `"short"` | smart, unit |
| `digits` | `number` → `maximumFractionDigits` | per mode | all |

`digits` is a **ceiling, not a fixed width** — trailing zeros are never padded
on, so `digits: 2` renders `2.5`, not `2.50`. Currency mode is the exception:
the currency carries its own minimum (2 for EUR, 0 for JPY) and `Intl` keeps it.

→ [What each option does, including the digits rules](https://anyfamily.site/docs/anyamount#options)

---

## units

`Intl` supports a fixed, sanctioned list of unit identifiers plus any
`<unit>-per-<unit>` compound of them. anyamount ships the full list as a
TypeScript union, so invalid units fail at compile time.

```ts
anyamount(120, { mode: "unit", unit: "kilometer-per-hour" });      // "120 km/h"
anyamount(8.5, { mode: "unit", unit: "liter-per-kilometer" });     // "8.5 L/km"
anyamount(3.2, { mode: "unit", unit: "gigabyte", style: "long" }); // "3.2 gigabytes"
```

→ [The full sanctioned list](https://anyfamily.site/docs/anyamount#units)

---

## locales

Any valid BCP 47 tag, including regional variants and fallback arrays. When
omitted, native `Intl` uses the runtime locale.

```ts
anyamount(1234567, { locale: "ru" });   // "1,2 млн"
anyamount(1234567, { locale: "de" });   // "1,2 Mio."
anyamount(1234567, { locale: "ja" });   // "123.5万"

anyamount(1999, { mode: "currency", currency: "USD", locale: "de" }); // "1.999,00 $"
anyamount(1999, { mode: "currency", currency: "INR", locale: "hi" }); // "₹1,999.00"
```

---

## limitations

- **No byte auto-scaling yet.** `anyamount(3200000000, { mode: "unit", unit: "byte" })`
  will not pick `GB` for you — pass the unit you want.
- **No percent mode, no ranges, no parsing.** Deliberately one function, three
  modes.
- **Sanctioned units only** — an `Intl` constraint, not an anyamount one.
- **Exact strings come from `Intl`** and vary between ICU versions; don't
  snapshot them across environments.

---

## vs the alternatives

| | anyamount | numeral.js | accounting.js |
| --- | :---: | :---: | :---: |
| locale data bundled | **none (Intl)** | one file per locale | none, you configure it |
| locales | **200+** | registered by hand | whatever you pass |
| currency rules | **from the currency** | manual symbol | manual symbol |
| decimal digits | **per currency** | manual | manual |
| units | **sanctioned list** | no | no |
| compact notation | **every locale** | English forms | no |
| dependencies | **0** | 0 | 0 |

anyamount is 0.8kb gzipped and formats numbers. It is not a money type: it does
not add prices, hold exchange rates, or protect you from floating-point
arithmetic. Do the arithmetic in minor units or in a decimal library, then hand
the result here to be written down.

---

## stability

anyamount follows [semver](https://semver.org/). The public API is a single
export — `anyamount`, with `anyamount.parts` and `anyamount.symbol` on it —
plus `AnyamountOptions`, `Unit` and the exported types. It only changes shape in
a major release. New options arrive in minors.

### migrating from 1.x

2.0 removed the separate `anyamountParts` and `anyamountSymbol` exports. Both
are the same functions, now reached through the one name the package exports:

```diff
- import { anyamount, anyamountParts, anyamountSymbol } from "anyamount";
+ import { anyamount } from "anyamount";

- anyamountParts(1999, opts);
+ anyamount.parts(1999, opts);

- anyamountSymbol("USD");
+ anyamount.symbol("USD");
```

Arguments, return values and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

Node.js 18+ · Chrome 77+ · Firefox 78+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22 and 24.

---

## the any family

anyamount is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [**anyamount**](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [anylong](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
| [anyplural](https://anyfamily.site/anyplural) | plurals | `Intl.PluralRules` |
| [anyword](https://anyfamily.site/anyword) | words & graphemes | `Intl.Segmenter` |

Want all of them? [`anyfamily`](https://www.npmjs.com/package/anyfamily) is one
install for the lot, and [`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)
wraps each as a hook with a shared locale provider.

```bash
npm install anyfamily
```

---

MIT © [kirilinsky](https://github.com/kirilinsky)
