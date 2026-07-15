# a\*

[![anyfamily — anywhen · anyamount · anymany · anyaround](https://anyfamily.site/opengraph-image?c5010871842302b6)](https://anyfamily.site)

**anyfamily — install one, get four.** The whole **any\*** family — micro `Intl`-powered
formatters, each with zero dependencies of its own — behind a single import.

```bash
npm install anyfamily
```

```ts
import { anywhen, anyamount, anymany, anyaround } from "anyfamily";
```

ESM + CJS, fully typed, `sideEffects: false` — bundlers tree-shake away
whatever you don't use.

**→ [anyfamily.site](https://anyfamily.site)**

## anywhen — dates & relative time

Tiny smart date formatter: relative when near, calendar labels for recent
days, absolute when far. [npm](https://www.npmjs.com/package/anywhen)

```ts
anywhen(new Date(Date.now() - 3 * 3600 * 1000), { mode: "relative", locale: "en" });
// "3 hours ago"
```

## anyamount — currency, numbers & units

Tiny smart number formatter: compact notation, currency, and sanctioned
units, any locale. [npm](https://www.npmjs.com/package/anyamount)

```ts
anyamount(1999, { mode: "currency", currency: "EUR", locale: "en" });
// "€1,999.00"
```

## anymany — localized lists

Smart list formatter: sort and join arrays of strings the way each locale
expects. [npm](https://www.npmjs.com/package/anymany)

```ts
anymany(["banana", "apple", "cherry"], { locale: "en" });
// "banana, apple, and cherry"
```

## anyaround — region & language names + flags

Micro locale display: any region, language, script, currency or calendar
code to its localized name, with country flags.
[npm](https://www.npmjs.com/package/anyaround)

```ts
anyaround("US", { display: "flag-name", locale: "en" });
// "🇺🇸 United States"
```

## types

Every public type from all four packages is re-exported. Names that collide
across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`) carry
their package prefix — `AnywhenMode`, `AnyamountStyle`,
`AnyaroundCurrencyOptions`, … `Locale` is identical in all four and exported
once.

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
