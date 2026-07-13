<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyaround/main/logo.png" alt="anyaround logo" width="420" />
</p>

<h1 align="center">anyaround</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyaround"><img src="https://img.shields.io/npm/v/anyaround?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyaround"><img src="https://img.shields.io/bundlephobia/minzip/anyaround?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyaround/actions/workflows/flow.yml"><img src="https://github.com/kirilinsky/anyaround/actions/workflows/flow.yml/badge.svg" alt="CI" /></a>
  <a href="https://codecov.io/gh/kirilinsky/anyaround"><img src="https://img.shields.io/codecov/c/github/kirilinsky/anyaround?style=flat-square&color=black" alt="coverage" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyaround?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro locale display built on native <code>Intl</code>.</strong>
  <br />
  Turn <code>"US"</code> into <code>"🇺🇸 United States"</code>, <code>"en"</code> into <code>"English"</code>, <code>"Cyrl"</code> into <code>"Cyrillic"</code>, <code>"EUR"</code> into <code>"Euro"</code>.
</p>

<p align="center">
  <strong><a href="https://anyaround.vercel.app">▶ Live demo</a></strong>
</p>

---

**One function. Smart detection. Country flags. Any locale. Zero dependencies.**

`Intl.DisplayNames` already knows the name of every country, language, script,
currency, and calendar — in 200+ locales. anyaround makes it a one-liner and
adds the one thing `Intl` leaves out: **flags**.

Built for country pickers, language switchers, profile pages, and tables —
anywhere a bare code should read like a person wrote it. No data files. No
hardcoded flag maps. No config.

```ts
import { anyaround } from "anyaround";

anyaround("US");
// "United States"  — smart mode (default)

anyaround("US", { display: "flag-name" });
// "🇺🇸 United States"

anyaround("US", { locale: "ru" });
// "Соединенные Штаты"

anyaround("en");
// "English"

anyaround("Cyrl");
// "Cyrillic"

anyaround("EUR");
// "Euro"  — the name, not a rate
```

---

## install

```bash
npm install anyaround
```

---

## usage

```ts
anyaround(code);
anyaround(code, options);
```

`code` is a region, language, script, currency, or calendar identifier. In the
default `smart` mode the kind is inferred from the code's shape; pass `mode` to
pin it.

```ts
anyaround("FR");                          // "France"
anyaround("fr");                          // "French"
anyaround("419");                         // "Latin America and the Caribbean"
anyaround("Latn");                        // "Latin"
anyaround("JPY");                         // "Japanese Yen"
```

---

## modes

The `mode` option picks how the code is read. Default is `"smart"`.

### smart

Auto-detects the kind from the code's shape:

| Shape                     | Detected as | Example             |
| ------------------------- | ----------- | ------------------- |
| three digits              | `region`    | `"419"`             |
| four letters              | `script`    | `"Latn"`            |
| two uppercase letters     | `region`    | `"US"`              |
| three uppercase letters   | `currency`  | `"USD"`             |
| anything else             | `language`  | `"en"`, `"zh-Hant"` |

```ts
anyaround("US", { locale: "en" });        // "United States"
anyaround("en", { locale: "en" });        // "English"
anyaround("Cyrl", { locale: "en" });      // "Cyrillic"
anyaround("EUR", { locale: "en" });       // "Euro"
```

Case is the tiebreaker between region (`"IT"`) and language (`"it"`). When a
code is ambiguous for you, pin it with `mode`. `calendar` is never
auto-detected.

Reads: `locale`, `style`, `display`, `fallback`.

### region

Countries and regions — ISO 3166-1 alpha-2 or UN M49 numeric. This is the only
mode that carries a **flag**, surfaced via `display`.

```ts
anyaround("DE", { mode: "region", locale: "en" });                      // "Germany"
anyaround("DE", { mode: "region", display: "flag" });                   // "🇩🇪"
anyaround("DE", { mode: "region", display: "flag-name", locale: "en" }); // "🇩🇪 Germany"
anyaround("DE", { mode: "region", display: "name-flag", locale: "en" }); // "Germany 🇩🇪"
anyaround("419", { mode: "region", locale: "en" }); // "Latin America and the Caribbean" (no flag)
```

Flags are derived from the two-letter code via Unicode Regional Indicator
Symbols — no image assets, no lookup table. Numeric M49 regions have no flag,
so flag `display` values fall back to the name.

Reads: `locale`, `style`, `display`, `fallback`.

### language

Languages — BCP 47 / ISO 639.

```ts
anyaround("en", { mode: "language", locale: "en" });     // "English"
anyaround("en-US", { mode: "language", locale: "en" });  // "American English"
anyaround("en-US", { mode: "language", locale: "en", languageDisplay: "standard" });
// "English (United States)"
anyaround("de", { mode: "language", locale: "fr" });     // "allemand"
```

`languageDisplay` toggles `"dialect"` (default, `"American English"`) vs
`"standard"` (`"English (United States)"`).

Reads: `locale`, `style`, `languageDisplay`, `fallback`.

### script

Writing systems — ISO 15924.

```ts
anyaround("Latn", { mode: "script", locale: "en" });   // "Latin"
anyaround("Cyrl", { mode: "script", locale: "en" });   // "Cyrillic"
anyaround("Hant", { mode: "script", locale: "en" });   // "Traditional Han"
```

Reads: `locale`, `style`, `fallback`.

### currency

Currency **names** via `Intl.DisplayNames` — ISO 4217. (For formatting an
*amount* like `"€1,999.00"`, reach for [anyamount](https://github.com/kirilinsky/anyamount).)

```ts
anyaround("EUR", { mode: "currency", locale: "en" });  // "Euro"
anyaround("JPY", { mode: "currency", locale: "en" });  // "Japanese Yen"
anyaround("USD", { mode: "currency", locale: "fr" });  // "dollar des États-Unis"
```

Reads: `locale`, `style`, `fallback`.

### calendar

Calendar systems. Never smart-detected — always explicit.

```ts
anyaround("gregory", { mode: "calendar", locale: "en" });   // "Gregorian Calendar"
anyaround("islamic", { mode: "calendar", locale: "en" });   // "Islamic Calendar"
```

Reads: `locale`, `style`, `fallback`.

---

## options

| Option            | Type                                                                        | Default        | Used by       |
| ----------------- | --------------------------------------------------------------------------- | -------------- | ------------- |
| `mode`            | `"smart" \| "region" \| "language" \| "script" \| "currency" \| "calendar"` | `"smart"`      | —             |
| `locale`          | `string \| string[]`                                                        | runtime locale | all           |
| `style`           | `"long" \| "short" \| "narrow"`                                             | `"long"`       | all           |
| `display`         | `"name" \| "flag" \| "flag-name" \| "name-flag"`                            | `"name"`       | smart, region |
| `fallback`        | `"code" \| "none"`                                                          | `"code"`       | all           |
| `languageDisplay` | `"dialect" \| "standard"`                                                   | `"dialect"`    | language      |

The options type is a discriminated union on `mode` — TypeScript only offers
`display` in `smart`/`region` mode and `languageDisplay` in `language` mode,
and rejects options that don't belong. From plain JavaScript the same holds at
runtime: stray options are ignored, and an unknown `mode` throws a clear
`RangeError`.

---

## info

`anyaroundInfo()` accepts the same arguments and returns the structured record
instead of a ready string — build your own output, or drive a `<select>`.

```tsx
import { anyaroundInfo } from "anyaround";

anyaroundInfo("US", { locale: "en" });
// { code: "US", type: "region", name: "United States", flag: "🇺🇸", found: true }

anyaroundInfo("en", { locale: "fr" });
// { code: "en", type: "language", name: "anglais", flag: "", found: true }

anyaroundInfo("QZ", { mode: "region" });
// { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }

// React: a country dropdown with flags
countries.map((cc) => {
  const { code, name, flag } = anyaroundInfo(cc);
  return <option key={code} value={code}>{flag} {name}</option>;
});
```

`flag` is `""` whenever the code is not a flag-bearing alpha-2 region. `found`
is `false` when `Intl` had no name for the code — `name` is then the code
(`fallback: "code"`, the default) or `""` (`fallback: "none"`), so you can tell
a real hit from a miss.

---

## locales

Pass any valid BCP 47 tag — including regional variants like `en-GB`, `zh-TW`,
`pt-BR`. Fallback arrays also work.

```ts
anyaround("US", { locale: "ru" });   // "Соединенные Штаты"
anyaround("US", { locale: "de" });   // "Vereinigte Staaten"
anyaround("US", { locale: "ja" });   // "アメリカ合衆国"
anyaround("US", { locale: ["sr-Latn-RS", "en"] });
```

When omitted, native `Intl` uses the runtime locale.

Output is pure — no `Date.now()`, no environment reads — so server and client
render identically. SSR-safe by construction.

---

## vs the alternatives

|                  |    anyaround    | i18n-iso-countries | emoji-flags | world-countries |
| ---------------- | :-------------: | :----------------: | :---------: | :-------------: |
| bundled data     | **none (Intl)** |   ~1 file / locale |    small    |    ~1MB JSON    |
| localized names  | **200+ locales**|    bundled locales |     no      |       no        |
| languages        |    **yes**      |         no         |     no      |       no        |
| scripts          |    **yes**      |         no         |     no      |       no        |
| currency names   |    **yes**      |         no         |     no      |    partial      |
| flags            |    **yes**      |         no         |     yes     |     emoji       |
| dependencies     |     **0**       |          0         |      0      |        0        |

anyaround carries no country data at all — it borrows the ICU tables already in
your runtime. That means zero payload, but also that exact strings track the
runtime's ICU version.

---

## limitations

Honest ones:

- **No cities.** `Intl` has no city display names. Regions and countries only.
- **Names come from `Intl`** and may vary between ICU versions — don't snapshot
  them across environments.
- **No reverse lookup.** Name → code is not provided; this maps codes to names,
  not the other way.
- **Flags are alpha-2 only.** Numeric M49 regions and non-region kinds have no
  flag; those fall back to the name. Flags are derived from the code's shape,
  not validated against a country list — any two-letter code yields a
  Regional-Indicator pair (e.g. `"QZ"` → `🇶🇿`), even when `found` is `false`.
- **Not every code is known everywhere.** Older runtimes have thinner ICU data;
  `fallback: "code"` (the default) returns the code rather than throwing.

---

## stability

anyaround follows [semver](https://semver.org/). The `1.x` API is stable —
breaking changes wait for a major bump. Exact display strings come from `Intl`
and may vary between ICU versions, so never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 81+ · Firefox 86+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

`Intl.DisplayNames` is required (widely available since 2021). CI runs the full
suite on Node 20, 22, and 24.

---

## part of the any\* family

- [anyamount](https://github.com/kirilinsky/anyamount) — tiny smart number formatter. One function, three modes, any locale.
- [anywhen](https://github.com/kirilinsky/anywhen) — tiny smart date formatter. One function, three modes, any locale.
- [anymany](https://anymany.vercel.app/) — tiny Intl list formatter. Sort and join string arrays in any locale.
- **anyaround** — you are here. [anyaround.vercel.app](https://anyaround.vercel.app)

See the whole family at **[anyfamily.site](https://anyfamily.site)**.
