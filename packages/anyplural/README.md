<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyfamily/main/packages/anyplural/logo.png" alt="anyplural" width="420" />
</p>

<h1 align="center">anyplural</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyplural"><img src="https://img.shields.io/npm/v/anyplural?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyplural"><img src="https://img.shields.io/bundlephobia/minzip/anyplural?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyplural?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro plural formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn a count into <code>"1 item"</code>, <code>"5 items"</code>, <code>"5 лет"</code>, or <code>"3rd"</code>.
</p>

<p align="center">
  <a href="https://anyfamily.site/anyplural">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anyplural">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Correct plurals. Any locale. Zero dependencies.**

`Intl.PluralRules` knows which form a count needs in every locale. anyplural
picks it, formats the count with `Intl.NumberFormat`, and stitches them
together — no rule tables, no locale files, no config.

```ts
import { anyplural } from "anyplural";

anyplural(1, { one: "item", other: "items" });                                  // "1 item"
anyplural(5, { one: "item", other: "items" });                                  // "5 items"
anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" });       // "5 лет"
anyplural(0, { zero: "нет писем", one: "письмо", many: "писем" });              // "нет писем"
anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" }); // "3rd"
```

---

## install

```bash
npm install anyplural
```

---

## usage

```ts
anyplural(count, forms);
anyplural(count, forms, options);
```

`count` is any finite number. `forms` maps plural categories to words.

```ts
anyplural(2, { one: "day", other: "days" });                              // "2 days"
anyplural(2, { one: "день", few: "дня", many: "дней" }, { locale: "ru" }); // "2 дня"
```

`anyplural.parts()` takes the same arguments and returns `{ type, value }`
parts instead of a string — style the number apart from the word. Number parts
come straight from `Intl.NumberFormat`; the word is a trailing `literal`.

```tsx
anyplural.parts(5, { one: "item", other: "items" }, { locale: "en" });
// [{ type: "integer", value: "5" }, { type: "literal", value: " items" }]

anyplural.parts(count, { one: "item", other: "items" }).map((p, i) =>
  p.type === "literal" ? p.value : <b key={i}>{p.value}</b>,
);
```

---

## recipes

Copy, paste, move on.

```tsx
// Item counter
anyplural(cart.length, { one: "item", other: "items" });
// "3 items"

// Localized "N years"
anyplural(age, { one: "год", few: "года", many: "лет" }, { locale: "ru" });
// "5 лет"

// Ranking / leaderboard position
anyplural(rank, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" });
// "1st"

// Empty state — the zero form replaces the whole output, number included
anyplural(count, { zero: "No messages", one: "message", other: "messages" });
// 0 → "No messages", 1 → "1 message", 9 → "9 messages"

// Big numbers, grouped
anyplural(inbox, { one: "email", other: "emails" }, { locale: "en" });
// "12,480 emails"
```

anyplural is pure and synchronous — no clock, no state — so it renders the same
on server and client. Pass an explicit `locale` to keep it that way regardless
of the runtime default.

---

## categories

`forms` is keyed by the CLDR plural categories `Intl.PluralRules` returns:
`zero`, `one`, `two`, `few`, `many`, `other`. Supply only the ones a locale
uses — and remember the names are labels, not quantities: Russian resolves 21
and 31 to `one`, and 0 to `many`.

```ts
anyplural(count, { one: "item", other: "items" });                            // en
anyplural(count, { one: "год", few: "года", many: "лет" }, { locale: "ru" }); // ru
```

A category a locale asks for but your `forms` doesn't define falls down a chain
to `other`, which is why `other` is the one worth always providing. A category
that resolves to nothing throws a `RangeError` rather than rendering an empty
word.

→ [The full fallback chain and the zero form](https://anyfamily.site/docs/anyplural#zero)

---

## options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `locale` | `string \| string[]` | runtime locale | BCP 47 tag or fallback array |
| `type` | `"cardinal" \| "ordinal"` | `"cardinal"` | plural rule kind |
| `format` | `Intl.NumberFormatOptions` | plain integer | how the count is formatted |

```ts
anyplural(1200, { one: "view", other: "views" }, {
  locale: "en",
  format: { notation: "compact" },
});
// "1.2K views"
```

→ [What each option does, with examples](https://anyfamily.site/docs/anyplural#options)

---

## locales

Any valid BCP 47 tag, including regional variants and fallback arrays. When
omitted, native `Intl` uses the runtime locale.

```ts
anyplural(2, { one: "день", few: "дня", many: "дней" }, { locale: "ru" }); // "2 дня"
anyplural(2, { one: "Tag", other: "Tage" }, { locale: "de" });             // "2 Tage"
anyplural(2, { one: "jour", other: "jours" }, { locale: "fr" });           // "2 jours"
anyplural(2, { one: "x", other: "y" }, { locale: ["sr-Latn-RS", "en"] });
```

The count is formatted in the same locale, so separators and digits follow it
too — `1,500` in English, `1 500` in Russian, Eastern Arabic numerals in
`ar-EG`.

---

## vs the alternatives

| | anyplural | i18next | intl-messageformat |
| --- | :---: | :---: | :---: |
| gzip | **< 1kb** | ~14kb | ~30kb |
| locale data bundled | **no** | yes | yes |
| plural rules | **native Intl** | tables | native Intl |
| dependencies | **0** | 1+ | 4+ |

anyplural is not a full i18n framework — it does one thing. Reach for i18next or
ICU MessageFormat when you need message catalogs, interpolation grammars, or
gender selects.

---

## stability

anyplural follows [semver](https://semver.org/). The public API is a single
export — `anyplural`, with `anyplural.parts` on it — plus `AnypluralOptions`,
`Forms` and the exported types. It only changes shape in a major release. New
options arrive in minors; exact formatted numbers come from `Intl` and may vary
between ICU versions, so never assert on them across environments.

### migrating from 1.x

2.0 removed the separate `anypluralParts` export. It is the same function, now
reached through the one name the package exports:

```diff
- import { anyplural, anypluralParts } from "anyplural";
+ import { anyplural } from "anyplural";

- anypluralParts(5, forms);
+ anyplural.parts(5, forms);
```

Arguments, return value and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

Node.js 18+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime · Cloudflare
Workers · Deno

CI runs the full suite on Node 20, 22 and 24.

---

## the any family

anyplural is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [anylong](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
| [**anyplural**](https://anyfamily.site/anyplural) | plurals | `Intl.PluralRules` |
| [anyword](https://anyfamily.site/anyword) | words & graphemes | `Intl.Segmenter` |

Want all of them? [`anyfamily`](https://www.npmjs.com/package/anyfamily) is one
install for the lot, and [`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)
wraps each as a hook with a shared locale provider.

```bash
npm install anyfamily
```

---

MIT © [kirilinsky](https://github.com/kirilinsky)
