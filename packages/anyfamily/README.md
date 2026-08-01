# a\*

[![anyfamily — anywhen · anyamount · anymany · anyaround · anylong · anyplural · anyword](https://anyfamily.site/opengraph-image?v7)](https://anyfamily.site)

**anyfamily — install one, get seven.** The whole **any\*** family — micro
`Intl`-powered tools, each with zero dependencies of its own — behind a single
import.

```bash
npm install anyfamily
```

```ts
import { anywhen, anyamount, anymany, anyaround, anylong, anyplural, anyword } from "anyfamily";
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

## types

Every public type from all seven packages is re-exported. Names that collide
across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`) carry their
package prefix — `AnywhenMode`, `AnyamountStyle`, `AnyaroundCurrencyOptions`, …
`Locale` is structurally identical across the seven, so it is exported once.

## react

Using React? [**anyfamily-react**](https://www.npmjs.com/package/anyfamily-react)
wraps every package as a hook — `useAnywhen`, `useAnyamount`, `useAnymany`,
`useAnyaround`, `useAnylong`, `useAnyplural`, `useAnyword` — sharing one locale
via `AnyfamilyProvider`, with relative time that keeps itself fresh.

```bash
npm install anyfamily-react
```

## stability

anyfamily follows [semver](https://semver.org/) and tracks the packages it
re-exports: a major in any of them is a major here.

### migrating from 1.x

2.0 drops every secondary export. Each one moved onto its package's own name,
which also removed the prefixed aliases that only existed to avoid collisions:

```diff
- import { anywhen, anywhenParts, anywordCount, anylongSupported } from "anyfamily";
+ import { anywhen, anyword, anylong } from "anyfamily";

- anywhenParts(date);         →  anywhen.parts(date)
- anymanyParts(items);        →  anymany.parts(items)
- anyaroundInfo("US");        →  anyaround.info("US")
- anylongParts("2h");         →  anylong.parts("2h")
- anylongSupported;           →  anylong.supported
- anyamountParts(1999);       →  anyamount.parts(1999)
- anyamountSymbol("USD");     →  anyamount.symbol("USD")
- anypluralParts(5, forms);   →  anyplural.parts(5, forms)
- anywordParts(text);         →  anyword.parts(text)
- anywordCount(text);         →  anyword.count(text)
- anywordTruncate(text, 20);  →  anyword.truncate(text, 20)
- anywordSupported;           →  anyword.supported
```

Arguments, return values and throwing behaviour are unchanged. Types are
unaffected.

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
