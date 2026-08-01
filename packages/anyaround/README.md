<p align="center">
  <img src="./logo.png" alt="anyaround" width="420" />
</p>

<h1 align="center">anyaround</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyaround"><img src="https://img.shields.io/npm/v/anyaround?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyaround"><img src="https://img.shields.io/bundlephobia/minzip/anyaround?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyaround?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro locale display built on native <code>Intl</code>.</strong>
  <br />
  Turn <code>"US"</code> into <code>"🇺🇸 United States"</code>, <code>"en"</code> into <code>"English"</code>, <code>"Cyrl"</code> into <code>"Cyrillic"</code>, <code>"EUR"</code> into <code>"Euro"</code>.
</p>

<p align="center">
  <a href="https://anyfamily.site/anyaround">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anyaround">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Smart detection. Country flags. Any locale. Zero dependencies.**

`Intl.DisplayNames` already knows the name of every country, language, script,
currency and calendar — in 200+ locales. anyaround makes it a one-liner and adds
the one thing `Intl` leaves out: **flags**. No data files, no hardcoded flag
maps, no config.

```ts
import { anyaround } from "anyaround";

anyaround("US");                            // "United States"  — smart mode (default)
anyaround("US", { display: "flag-name" });  // "🇺🇸 United States"
anyaround("US", { locale: "ru" });          // "Соединенные Штаты"
anyaround("en");                            // "English"
anyaround("Cyrl");                          // "Cyrillic"
anyaround("EUR");                           // "Euro"
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

`code` is a region, language, script, currency or calendar code. In the default
`smart` mode the kind is inferred from its shape.

`anyaround.info()` takes the same arguments and returns the structured record
instead of a ready string — build your own output, or drive a `<select>`.

```tsx
anyaround.info("US", { locale: "en" });
// { code: "US", type: "region", name: "United States", flag: "🇺🇸", found: true }

anyaround.info("QZ", { mode: "region" });
// { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }
```

`flag` is `""` whenever the code is not a flag-bearing alpha-2 region. `found`
is `false` when `Intl` had no name — `name` is then the code (`fallback: "code"`,
the default) or `""`, so you can tell a real hit from a miss.

---

## recipes

Copy, paste, move on.

```tsx
// Country picker with flags
countries.map((cc) => {
  const { code, name, flag } = anyaround.info(cc);
  return <option key={code} value={code}>{flag} {name}</option>;
});

// Language switcher, each language in its own tongue
anyaround("de", { mode: "language", locale: "de" });   // "Deutsch"
anyaround("ja", { mode: "language", locale: "ja" });   // "日本語"

// Profile location
anyaround(user.country, { display: "flag-name", locale: "en" });
// "🇩🇪 Germany"

// Currency label next to an amount
anyaround(order.currency, { mode: "currency", locale: "en" });
// "Euro"

// Flag only, for a compact table cell
anyaround(row.country, { display: "flag" });
// "🇺🇸"
```

Output is pure — no `Date.now()`, no environment reads — so server and client
render identically. SSR-safe by construction.

---

## modes

`mode` picks how the code is read. Default is `"smart"`, which auto-detects:

| Shape | Detected as | Example |
| --- | --- | --- |
| three digits | `region` | `"419"` |
| four letters | `script` | `"Latn"` |
| two uppercase letters | `region` | `"US"` |
| three uppercase letters | `currency` | `"USD"` |
| anything else | `language` | `"en"`, `"zh-Hant"` |

Case is the tiebreaker: `"IT"` is a region, `"it"` a language. Pin ambiguous
codes with `mode`. `calendar` is never auto-detected.

```ts
anyaround("DE", { mode: "region", display: "flag-name" }); // "🇩🇪 Germany"
anyaround("en-US", { mode: "language" });                  // "American English"
anyaround("Cyrl", { mode: "script" });                     // "Cyrillic"
anyaround("EUR", { mode: "currency" });                    // "Euro"
anyaround("gregory", { mode: "calendar" });                // "Gregorian Calendar"
```

Region is the only mode that carries a flag. Flags are derived from the
two-letter code via Unicode Regional Indicator Symbols — no image assets, no
lookup table.

→ [Every mode broken down](https://anyfamily.site/docs/anyaround#modes)

---

## options

| Option | Type | Default | Used by |
| --- | --- | --- | --- |
| `mode` | `"smart" \| "region" \| "language" \| "script" \| "currency" \| "calendar"` | `"smart"` | — |
| `locale` | `string \| string[]` | runtime locale | all |
| `style` | `"long" \| "short" \| "narrow"` | `"long"` | all |
| `display` | `"name" \| "flag" \| "flag-name" \| "name-flag"` | `"name"` | smart, region |
| `fallback` | `"code" \| "none"` | `"code"` | all |
| `languageDisplay` | `"dialect" \| "standard"` | `"dialect"` | language |

The options type is a discriminated union on `mode` — TypeScript only offers
`display` in smart/region mode and `languageDisplay` in language mode.

→ [What each option does, with examples](https://anyfamily.site/docs/anyaround#options)

---

## locales

Any valid BCP 47 tag, including regional variants and fallback arrays. When
omitted, native `Intl` uses the runtime locale.

```ts
anyaround("US", { locale: "ru" });   // "Соединенные Штаты"
anyaround("US", { locale: "de" });   // "Vereinigte Staaten"
anyaround("US", { locale: "ja" });   // "アメリカ合衆国"
anyaround("US", { locale: ["sr-Latn-RS", "en"] });
```

---

## vs the alternatives

| | anyaround | i18n-iso-countries | emoji-flags | world-countries |
| --- | :---: | :---: | :---: | :---: |
| bundled data | **none (Intl)** | ~1 file / locale | small | ~1MB JSON |
| localized names | **200+ locales** | bundled locales | no | no |
| languages | **yes** | no | no | no |
| scripts | **yes** | no | no | no |
| currency names | **yes** | no | no | partial |
| flags | **yes** | no | yes | emoji |
| dependencies | **0** | 0 | 0 | 0 |

anyaround carries no country data at all — it borrows the ICU tables already in
your runtime. Zero payload, but exact strings track the runtime's ICU version.

---

## limitations

- **No cities.** `Intl` has no city display names. Regions and countries only.
- **Names come from `Intl`** and vary between ICU versions — don't snapshot them
  across environments.
- **No reverse lookup.** Code → name only.
- **Flags are alpha-2 only,** and derived from the code's shape rather than
  validated — any two-letter code yields a Regional-Indicator pair (`"QZ"` →
  🇶🇿) even when `found` is `false`.

---

## stability

anyaround follows [semver](https://semver.org/). The public API is a single
export — `anyaround`, with `anyaround.info` on it — plus `AnyaroundOptions`,
`AnyaroundInfo` and the exported types. It only changes shape in a major
release. Exact display strings come from `Intl` and may vary between ICU
versions, so never assert on them across environments.

### migrating from 1.x

2.0 removed the separate `anyaroundInfo` export. It is the same function, now
reached through the one name the package exports:

```diff
- import { anyaround, anyaroundInfo } from "anyaround";
+ import { anyaround } from "anyaround";

- anyaroundInfo("US");
+ anyaround.info("US");
```

Arguments, return value and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

Node.js 18+ · Chrome 81+ · Firefox 86+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

`Intl.DisplayNames` is required (widely available since 2021). CI runs the full
suite on Node 20, 22 and 24.

---

## the any family

anyaround is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [**anyaround**](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
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
