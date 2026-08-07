# a\*

[![anyfamily — anywhen · anyamount · anymany · anyaround · anylong · anyplural · anyword · anylocale](https://anyfamily.site/opengraph-image?v8)](https://anyfamily.site)

**anyfamily — install one, get eight.** The whole **any\*** family — micro
`Intl`-powered tools, each with zero dependencies of its own — behind a single
import.

```bash
npm install anyfamily
```

<details>
<summary>installing from GitHub Packages instead</summary>

Also published to GitHub Packages, where names must carry the owner's scope:
`@kirilinsky/anyfamily`. GitHub requires auth even for public packages, so add a
token with `read:packages` to your `.npmrc`:

```
@kirilinsky:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @kirilinsky/anyfamily
```

Same code, same version, different name — npmjs is the primary registry.

</details>

```ts
import { anywhen, anyamount, anymany, anyaround, anylong, anyplural, anyword, anylocale } from "anyfamily";
```

ESM + CJS, fully typed, `sideEffects: false` — bundlers tree-shake away whatever
you don't use.

**→ [anyfamily.site](https://anyfamily.site)**

## one shape everywhere

Every package exports exactly one name. The bare call does the job; anything
extra hangs off that same name.

```ts
anywhen(date)                  // the string
anywhen.parts(date)            // the extra
anyword.count(text)
anyword.truncate(text, 20)
anyamount.symbol("USD")
anylong.supported              // a flag, same rule
```

Learn one package and you know how the next one is shaped.

## anywhen — dates & relative time

Tiny smart date formatter: relative when near, calendar labels for recent days,
absolute when far. [docs](https://anyfamily.site/docs/anywhen) ·
[npm](https://www.npmjs.com/package/anywhen)

```ts
anywhen(new Date(Date.now() - 3 * 3600 * 1000), { mode: "relative", locale: "en" });
// "3 hours ago"
```

## anyamount — currency, numbers & units

Tiny smart number formatter: compact notation, currency, and sanctioned units,
any locale. [docs](https://anyfamily.site/docs/anyamount) ·
[npm](https://www.npmjs.com/package/anyamount)

```ts
anyamount(1999, { mode: "currency", currency: "EUR", locale: "en" });
// "€1,999.00"

anyamount.symbol("EUR", { locale: "en" });   // "€"  — the bare symbol, no amount
```

## anymany — localized lists

Smart list formatter: sort and join arrays of strings the way each locale
expects. [docs](https://anyfamily.site/docs/anymany) ·
[npm](https://www.npmjs.com/package/anymany)

```ts
anymany(["banana", "apple", "cherry"], { locale: "en" });
// "banana, apple, and cherry"
```

## anyaround — region & language names + flags

Micro locale display: any region, language, script, currency or calendar code to
its localized name, with country flags.
[docs](https://anyfamily.site/docs/anyaround) ·
[npm](https://www.npmjs.com/package/anyaround)

```ts
anyaround("US", { display: "flag-name", locale: "en" });
// "🇺🇸 United States"
```

## anylong — durations

Any duration in — a number, two `Date`s, an ISO 8601 string, shorthand, or a
duration record — into a localized string, over `Intl.DurationFormat`.
[docs](https://anyfamily.site/docs/anylong) ·
[npm](https://www.npmjs.com/package/anylong)

```ts
anylong("PT2H30M", { locale: "en" });
// "2 hr, 30 min"
```

`Intl.DurationFormat` is the newest API in the family and is missing on Node 22
and older — check `anylong.supported` if you target those.

## anyplural — cardinal & ordinal plurals

Any count into its correct plural form — picks the CLDR category with
`Intl.PluralRules`, formats the number, and stitches them together.
[docs](https://anyfamily.site/docs/anyplural) ·
[npm](https://www.npmjs.com/package/anyplural)

```ts
anyplural(5, { one: "item", other: "items" }, { locale: "en" });
// "5 items"
```

## anyword — words, graphemes & sentences

Locale-correct text segmentation over `Intl.Segmenter`: finds words in scripts
without spaces, counts the characters users actually see, and truncates without
ripping an emoji in half. [docs](https://anyfamily.site/docs/anyword) ·
[npm](https://www.npmjs.com/package/anyword)

```ts
anyword("don't stop 世界");                          // ["don't", "stop", "世界"]
anyword.count("👨‍👩‍👧", { by: "grapheme" });            // 1  ("👨‍👩‍👧".length is 8)
anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" }); // "héllo…"
```

`Intl.Segmenter` is missing on older runtimes — branch on `anyword.supported`
if you target them.

## anylocale — how a locale behaves

Not what things are called, but how the locale works: text direction, which day
the week starts on, which days are the weekend, the calendars and time zones it
uses. One read over `Intl.Locale` info.
[docs](https://anyfamily.site/docs/anylocale) ·
[npm](https://www.npmjs.com/package/anylocale)

```ts
anylocale("ar-EG").direction; // "rtl"
anylocale("en-GB").weekStart; // 1 — Monday, while en-US is 7
anylocale("fa-IR").weekend;   // [5] — Friday only, not two days
```

Locale info is a late addition — branch on `anylocale.supported` if you target
older runtimes.

## types

Every public type from all eight packages is re-exported. Names that collide
across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`) carry their
package prefix — `AnywhenMode`, `AnyamountStyle`, `AnyaroundCurrencyOptions`, …
`Locale` is structurally identical across all eight, so it is exported once.

## react

Using React? [**anyfamily-react**](https://www.npmjs.com/package/anyfamily-react)
wraps every package as a hook — `useAnywhen`, `useAnyamount`, `useAnymany`,
`useAnyaround`, `useAnylong`, `useAnyplural`, `useAnyword`, `useAnylocale` —
sharing one locale
via `AnyfamilyProvider`, with relative time that keeps itself fresh.

```bash
npm install anyfamily-react
```

## stability

anyfamily follows [semver](https://semver.org/) and tracks the packages it
re-exports: a major in any of them is a major here.

 

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
