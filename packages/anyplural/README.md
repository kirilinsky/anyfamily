<p align="center">
  <img src="./logo.png" alt="anyplural" width="420" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/anyplural"><img src="https://img.shields.io/npm/v/anyplural?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyplural"><img src="https://img.shields.io/bundlephobia/minzip/anyplural?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyplural/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anyplural/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anyplural"><img src="https://codecov.io/github/kirilinsky/anyplural/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyplural?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro plural formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn a count into <code>"1 item"</code>, <code>"5 items"</code>, <code>"5 лет"</code>, or <code>"3rd"</code>.
</p>

<p align="center">
  <a href="https://anyplural.vercel.app"><strong>▸ live demo</strong></a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">any family</a>
</p>

---

**One function. Correct plurals. Any locale. Zero dependencies.**

`Intl.PluralRules` knows which form a count needs in every locale. anyplural
picks it, formats the count with `Intl.NumberFormat`, and stitches them
together — no rule tables, no locale files, no config.

```ts
import { anyplural } from "anyplural";

anyplural(1, { one: "item", other: "items" });
// "1 item"

anyplural(5, { one: "item", other: "items" });
// "5 items"

anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" });
// "5 лет"

anyplural(0, { zero: "нет писем", one: "письмо", many: "писем" });
// "нет писем"

anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" });
// "3rd"
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

`count` is any finite number. `forms` maps [plural categories](#categories) to
words. `options` are optional.

```ts
anyplural(2, { one: "day", other: "days" });          // "2 days"
anyplural(2, { one: "день", few: "дня", many: "дней" }, { locale: "ru" }); // "2 дня"
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

// Empty state
anyplural(count, { zero: "No messages", one: "message", other: "messages" });
// 0 → "No messages", 1 → "1 message", 9 → "9 messages"

// Big numbers, grouped
anyplural(inbox, { one: "email", other: "emails" }, { locale: "en" });
// "12,480 emails"
```

---

## count

The count is always formatted with native `Intl.NumberFormat` and placed before
the word:

- **cardinal** — separated by a space: `"5 items"`, `"5 лет"`.
- **ordinal** — the form attaches as a suffix, no space: `"3rd"`, `"1st"`.

An explicit `zero` form is the exception — see [zero](#zero).

There is no template syntax to learn: the count leads, the word follows. To put
the number elsewhere or add surrounding text, format the pieces with
[`anypluralParts`](#parts) and assemble them yourself.

---

## categories

`forms` is keyed by the CLDR plural categories `Intl.PluralRules` returns:
`zero`, `one`, `two`, `few`, `many`, `other`. You only supply the ones a locale
uses.

```ts
anyplural(count, { one: "item", other: "items" });                 // en: one + other
anyplural(count, { one: "год", few: "года", many: "лет" }, { locale: "ru" }); // ru: one + few + many
```

### fallback chain

A category a locale asks for but your `forms` doesn't define resolves down a
chain to `other`:

```
two  → few → many → other
few  → many → other
many → other
one  → other
zero → other
```

So a Russian `{ many: "штук", other: "штука" }` still answers a `few` count by
falling through to `many`. Provide `other` as the catch-all; a category that
resolves to nothing throws a `RangeError`.

### zero

`Intl` maps `0` to a locale's normal category (`other` in English — `"0 items"`).
For a dedicated empty-state phrase, add a `zero` form: on an exact `0` it
replaces the **whole** output, count and all, before the plural select runs.

```ts
anyplural(0, { zero: "нет писем", one: "письмо", many: "писем" });
// "нет писем"   (no number)

anyplural(0, { one: "item", other: "items" });
// "0 items"     (no zero form → normal select)
```

---

## options

| Option   | Type                       | Default          | Notes                     |
| -------- | -------------------------- | ---------------- | ------------------------- |
| `locale` | `string \| string[]`       | runtime locale   | BCP 47 tag or fallback[]  |
| `type`   | `"cardinal" \| "ordinal"`  | `"cardinal"`     | plural rule kind          |
| `format` | `Intl.NumberFormatOptions` | plain integer    | count formatting          |

```ts
// Ordinal
anyplural(2, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" });
// "2nd"

// Compact number
anyplural(1200, { one: "view", other: "views" }, {
  locale: "en",
  format: { notation: "compact" },
});
// "1.2K views"
```

---

## parts

`anypluralParts()` accepts the same arguments as `anyplural()` and returns the
output as `{ type, value }` parts — style the number apart from the word, or
rebuild the string your own way. Number parts come straight from
`Intl.NumberFormat`; the word is a trailing `literal`.

```tsx
import { anypluralParts } from "anyplural";

anypluralParts(5, { one: "item", other: "items" }, { locale: "en" });
// [
//   { type: "integer", value: "5" },
//   { type: "literal", value: " items" },
// ]

// React: bold the number
anypluralParts(count, { one: "item", other: "items" }).map((p, i) =>
  p.type === "literal" ? p.value : <b key={i}>{p.value}</b>,
);
```

---

## React / Next.js

anyplural is pure and synchronous — no clock, no state — so it renders the same
on server and client. Pass a `locale` to keep output stable across the
hydration boundary regardless of the runtime default.

```tsx
import { anyplural } from "anyplural";

export function CartBadge({ count }: { count: number }) {
  return <span>{anyplural(count, { one: "item", other: "items" }, { locale: "en" })}</span>;
}
```

---

## locales

Pass any valid BCP 47 tag — including regional variants like `en-GB`, `pt-BR`,
`ar-EG`. Fallback arrays also work.

```ts
anyplural(2, { one: "день", few: "дня", many: "дней" }, { locale: "ru" }); // "2 дня"
anyplural(2, { one: "Tag", other: "Tage" }, { locale: "de" });            // "2 Tage"
anyplural(2, { one: "jour", other: "jours" }, { locale: "fr" });          // "2 jours"
anyplural(3, { other: "th" }, { locale: "ar-EG", type: "ordinal" });      // "٣th"
anyplural(2, { one: "x", other: "y" }, { locale: ["sr-Latn-RS", "en"] });
```

When omitted, native `Intl` uses the runtime locale.

---

## vs the alternatives

|                     |    anyplural    | i18next | intl-messageformat |
| ------------------- | :-------------: | :-----: | :----------------: |
| gzip                |    **< 1kb**    |  ~14kb  |       ~30kb        |
| locale data bundled |     **no**      |   yes   |        yes         |
| plural rules        | **native Intl** | tables  |    native Intl     |
| dependencies        |     **0**       |   1+    |        4+          |

anyplural is not a full i18n framework — it does one thing. Reach for i18next or
ICU MessageFormat when you need message catalogs, interpolation grammars, or
gender selects.

---

## stability

anyplural follows [semver](https://semver.org/). Since 1.0.0 the public API —
`anyplural`, `anypluralParts`, `AnypluralOptions`, `Forms`, and the exported
types — only changes shape in a major release. New options arrive in minors;
exact formatted numbers come from `Intl` and may vary between ICU versions, so
never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime · Cloudflare
Workers · Deno

`Intl.PluralRules` with `type: "ordinal"` needs a reasonably modern ICU; all
listed targets ship it. CI runs the full suite on Node 20, 22, and 24. Older
runtimes down to Node 18 work but are not tested on every release.

---

## the any family

anyplural is part of **any family** — a set of micro, zero-dependency,
native-first utilities.

- [any family site](https://anyfamily.site/)
- [anyfamily on npm](https://www.npmjs.com/package/anyfamily)
