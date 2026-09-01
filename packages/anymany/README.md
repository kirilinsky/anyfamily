<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyfamily/main/packages/anymany/logo.png" alt="anymany" width="420" />
</p>

<h1 align="center">anymany</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anymany"><img src="https://img.shields.io/npm/v/anymany?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anymany"><img src="https://img.shields.io/bundlephobia/minzip/anymany?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anymany?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Smart list formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn arrays into <code>"banana, apple, and cherry"</code>, <code>"a, b или c"</code>, or <code>"a、b、c"</code> — sorted right, joined right.
</p>

<p align="center">
  <a href="https://anyfamily.site/anymany">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anymany">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Smart defaults. Any locale. ~0.5kb gzip. Zero dependencies.**

`Intl` is powerful. anymany makes it usable. Built for tags, participants, file
lists, permissions and search filters — anywhere `array.join(", ")` should read
like a person wrote it. No locale files, no plugins, no config.

```ts
import { anymany } from "anymany";

anymany(["banana", "apple", "cherry"]);                   // "banana, apple, and cherry"
anymany(["S", "M", "L"], { type: "disjunction" });        // "S, M, or L"
anymany(["cherry", "apple", "Banana"], { sort: true });   // "apple, Banana, and cherry"
anymany(["x", "y", "z", "a", "b", "c", "d"], { max: 3 }); // "x, y, z, and +4"
```

---

## install

```bash
npm install anymany
```

---

## usage

```ts
anymany(items);
anymany(items, options);
```

`items` is an array of strings. Non-string items are coerced via `String()`.
An empty array returns `""`; a single item is returned as-is.

```ts
anymany(["read", "write"]);   // "read and write"
anymany(["read"]);            // "read"
anymany([]);                  // ""
```

`anymany.parts()` takes the same arguments and returns `{ type, value }` parts
instead of a string — style the items apart from the separators.

```tsx
anymany.parts(["a", "b"]);
// [{ type: "element", value: "a" }, { type: "literal", value: " and " }, { type: "element", value: "b" }]

anymany.parts(tags).map((p, i) =>
  p.type === "element" ? <b key={i}>{p.value}</b> : p.value,
);
```

---

## recipes

Copy, paste, move on.

```ts
// Tag list
anymany(post.tags, { locale: "en" });
// "design, typography, and color"

// Sizes / options — "or" instead of "and"
anymany(product.sizes, { type: "disjunction" });
// "S, M, or L"

// Plain comma list, no joiner word
anymany(["4 kg", "2 m"], { type: "unit" });
// "4 kg, 2 m"

// Alphabetical the way the language actually orders letters
anymany(names, { sort: true, locale: "de" });
// "Apfel, Öl und Zebra"   ← Ö sorts after A, not after Z

// Filenames with numbers, ordered by value
anymany(files, { sort: "numeric" });
// "file2 and file10"

// Cap a long list
anymany(participants, { max: 3 });
// "Ann, Bob, Cy, and +4"

// …with your own overflow wording
anymany(participants, { max: 3, overflow: (n) => `${n} more` });
// "Ann, Bob, Cy, and 2 more"
```

anymany is pure — same input, same output, no clocks, no DOM. Pass an explicit
`locale` and server and client render identically.

---

## sorting

`sort` runs the items through `Intl.Collator` before joining — real
language-aware collation, not code-point order. The input array is never
mutated.

```ts
anymany(["cherry", "apple", "Banana"], { sort: true });
// "apple, Banana, and cherry"   ← plain .sort() puts "Banana" first

anymany(["file10", "file2"], { sort: "numeric" });
// "file2 and file10"            ← numbers compared by value

anymany(["a", "A"], { sort: { caseFirst: "upper" } });
// "A and a"                     ← any Intl.CollatorOptions
```

→ [Sorting, max and overflow in detail](https://anyfamily.site/docs/anymany#sort)

---

## options

| Option | Type | Default |
| --- | --- | --- |
| `locale` | `string \| string[]` | runtime locale |
| `type` | `"conjunction" \| "disjunction" \| "unit"` | `"conjunction"` |
| `style` | `"long" \| "short" \| "narrow"` | `"long"` |
| `sort` | `boolean \| "numeric" \| Intl.CollatorOptions` | no sorting |
| `max` | `number` (positive integer) | no limit |
| `overflow` | `(hidden: number) => string` | `` `+${N}` `` |

`max` throws a `RangeError` when it is zero, negative or fractional.

→ [What each option does, with examples](https://anyfamily.site/docs/anymany#options)

---

## locales

Joiner words, collation and overflow digits all come from `Intl`. Pass any valid
BCP 47 tag, including regional variants and fallback arrays. When omitted,
native `Intl` uses the runtime locale.

```ts
anymany(["a", "b", "c"], { locale: "ru" });                      // "a, b и c"
anymany(["a", "b", "c"], { locale: "de" });                      // "a, b und c"
anymany(["a", "b", "c"], { locale: "ja" });                      // "a、b、c"
anymany(["a", "b", "c"], { type: "disjunction", locale: "ru" }); // "a, b или c"

anymany(["a", "b", "c", "d", "e", "f", "g"], { max: 3, locale: "ar-EG" });
// "a وb وc و+٤"   ← localized overflow digits
```

---

## why no pluralization

By design. `Intl` ships no word data, and anymany ships zero language
dictionaries — that is what keeps it small and correct in every locale. The
overflow counter is `"+N"` with localized digits rather than `"and N more"` for
the same reason; pass your own wording through `overflow` when you need words.

Counting things in a sentence is [anyplural](https://anyfamily.site/anyplural)'s
job, not this one's.

---

## vs the alternatives

| | anymany | `join()` by hand | `Intl.ListFormat` direct |
| --- | :---: | :---: | :---: |
| locale data bundled | **none (Intl)** | none | none (Intl) |
| connector from the locale | **yes** | no | yes |
| and / or / unit lists | **yes** | no | yes |
| collation-aware sort | **yes** | no | no |
| overflow to a rest count | **yes** | no | no |
| parts, for styling | **yes** | no | yes |
| dependencies | **0** | 0 | 0 |

The honest comparison for anymany is the native API rather than a library,
because there is barely a library to compare against. At 0.6kb gzipped it adds
the sorting, the overflow and the fallback chain around `Intl.ListFormat`, and
saves you constructing a formatter per call.

---

## stability

anymany follows [semver](https://semver.org/). The public API is a single
export — `anymany`, with `anymany.parts` on it — plus `AnymanyOptions` and the
exported types. It only changes shape in a major release. New options arrive in
minors; exact formatted strings come from `Intl` and may vary between ICU
versions, so never assert on them across environments.

### migrating from 1.x

2.0 removed the separate `anymanyParts` export. It is the same function, now
reached through the one name the package exports:

```diff
- import { anymany, anymanyParts } from "anymany";
+ import { anymany } from "anymany";

- anymanyParts(items);
+ anymany.parts(items);
```

Arguments, return value and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

Node.js 18+ · Chrome 72+ · Firefox 78+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22 and 24.

---

## the any family

anymany is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [**anymany**](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
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
