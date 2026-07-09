<p align="center">
  <img src="./logo.png" alt="anymany logo" width="230" />
</p>

<h1 align="center">anymany</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anymany"><img src="https://img.shields.io/npm/v/anymany?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anymany"><img src="https://img.shields.io/bundlephobia/minzip/anymany?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anymany/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anymany/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anymany"><img src="https://codecov.io/github/kirilinsky/anymany/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anymany?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Smart list formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn arrays into <code>"banana, apple, and cherry"</code>, <code>"a, b или c"</code>, or <code>"a、b、c"</code> — sorted right, joined right.
</p>

<p align="center">
  <a href="https://anymany.vercel.app/">▸ live demo</a>
</p>

---

**One function. Smart defaults. Any locale. ~0.5kb gzip. Zero dependencies.**

`Intl` is powerful. anymany makes it usable.

Built for tags, participants, file lists, permissions, and search filters —
anywhere `array.join(", ")` should read like a person wrote it. No locale
files. No plugins. No config.

```ts
import { anymany } from "anymany";

anymany(["banana", "apple", "cherry"]);
// "banana, apple, and cherry"

anymany(["S", "M", "L"], { type: "disjunction" });
// "S, M, or L"

anymany(["cherry", "apple", "Banana"], { sort: true });
// "apple, Banana, and cherry"

anymany(["x", "y", "z", "a", "b", "c", "d"], { max: 3 });
// "x, y, z, and +4"
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
anymany(["read", "write"]);          // "read and write"
anymany(["read"]);                   // "read"
anymany([]);                         // ""
```

---

## join

Default is `"conjunction"` (and) in `"long"` style. Both map straight to
`Intl.ListFormat`.

```ts
anymany(["a", "b", "c"]);                        // "a, b, and c"
anymany(["a", "b", "c"], { style: "short" });    // "a, b, & c"
anymany(["a", "b", "c"], { style: "narrow" });   // "a, b, c"
```

## disjunction

`type: "disjunction"` joins with "or"; `type: "unit"` is a plain list with no
joiner word.

```ts
anymany(["S", "M", "L"], { type: "disjunction" });  // "S, M, or L"
anymany(["4 kg", "2 m"], { type: "unit" });         // "4 kg, 2 m"
```

## sort

`sort` runs the items through `Intl.Collator` before joining — real
language-aware collation, not code-point order. The input array is never
mutated.

```ts
anymany(["cherry", "apple", "Banana"], { sort: true });
// "apple, Banana, and cherry"   ← plain .sort() would put "Banana" first
```

## numeric sort

`sort: "numeric"` compares embedded numbers by value, so `2` comes before
`10`. Pass any `Intl.CollatorOptions` object for full control.

```ts
anymany(["file10", "file2"], { sort: "numeric" });
// "file2 and file10"

anymany(["a", "A"], { sort: { caseFirst: "upper" } });
// "A and a"
```

## max + overflow

`max` caps the visible items (after sorting); the rest collapse into a
trailing `"+N"` counter. Digits come from `Intl.NumberFormat`, so they
localize — no words, locale-safe.

```ts
anymany(["x", "y", "z", "a", "b", "c", "d"], { max: 3 });
// "x, y, z, and +4"

anymany(["x", "y", "z", "a", "b"], { max: 3, overflow: (n) => `${n} more` });
// "x, y, z, and 2 more"
```

The overflow item is just another list element, so the default `type` places
an "and" before it: `"x, y, z, and +4"`. That is intentional — no hidden
joiner magic. If you prefer a plain comma list, combine `max` with
`type: "unit"`.

## parts

`anymanyParts()` accepts the same arguments as `anymany()` and returns the
output as `{ type, value }` parts — style the items apart from the
separators, or rebuild the string your own way.

```tsx
import { anymanyParts } from "anymany";

anymanyParts(["a", "b"]);
// [
//   { type: "element", value: "a" },
//   { type: "literal", value: " and " },
//   { type: "element", value: "b" },
// ]

// React: bold the items
anymanyParts(tags).map((p, i) =>
  p.type === "element" ? <b key={i}>{p.value}</b> : p.value,
);
```

## locales

Everything above works the same in any locale — joiner words, collation, and
overflow digits all come from `Intl`. Pass any valid BCP 47 tag, including
regional variants like `en-GB`, `zh-TW`, `pt-BR`; fallback arrays also work.

```ts
anymany(["a", "b", "c"], { locale: "ru" });                       // "a, b и c"
anymany(["a", "b", "c"], { locale: "de" });                       // "a, b und c"
anymany(["a", "b", "c"], { locale: "ja" });                       // "a、b、c"
anymany(["a", "b", "c"], { type: "disjunction", locale: "ru" });  // "a, b или c"

anymany(["Öl", "Zebra", "Apfel"], { sort: true, locale: "de" });
// "Apfel, Öl und Zebra"   ← Ö sorts after A, not after Z

anymany(["файл10", "файл2"], { sort: "numeric", locale: "ru" });
// "файл2 и файл10"

anymany(["a", "b", "c", "d", "e", "f", "g"], { max: 3, locale: "ar-EG" });
// "a وb وc و+٤"           ← localized overflow digits

anymany(["a", "b"], { locale: ["sr-Latn-RS", "en"] });
```

When omitted, native `Intl` uses the runtime locale.

---

## options

| Option     | Type                                            | Default          |
| ---------- | ----------------------------------------------- | ---------------- |
| `locale`   | `string \| string[]`                            | runtime locale   |
| `type`     | `"conjunction" \| "disjunction" \| "unit"`      | `"conjunction"`  |
| `style`    | `"long" \| "short" \| "narrow"`                 | `"long"`         |
| `sort`     | `boolean \| "numeric" \| Intl.CollatorOptions`  | no sorting       |
| `max`      | `number` (positive integer)                     | no limit         |
| `overflow` | `(hidden: number) => string`                    | `` `+${N}` ``    |

`max` throws a `RangeError` when it is zero, negative, or fractional.

---

## family

anymany is part of a family — same author, same DNA: one function, smart
defaults, any Intl locale, ~1kb gzip, zero dependencies, SSR-safe, dual
ESM+CJS.

- [**anywhen**](https://github.com/kirilinsky/anywhen) — humanizes dates: `"yesterday, 2:35 PM"`, `"через 3 часа"`
- [**anyamount**](https://github.com/kirilinsky/anyamount) — humanizes amounts and units
- **anymany** — humanizes arrays of strings (this package)

---

## FAQ

**Why no pluralization ("1 file" / "2 files")?**
By design. `Intl` ships no word data, and anymany ships zero language
dictionaries — that is what keeps it lightweight and correct in every locale. The
overflow counter is `"+N"` (localized digits) instead of `"and N more"` for
the same reason. If a feature would require per-language words, it is out of
scope.

---

## stability

anymany follows [semver](https://semver.org/). Since 1.0.0 the public API —
`anymany`, `anymanyParts`, `AnymanyOptions`, and the exported types — only
changes shape in a major release. New options arrive in minors; exact
formatted strings come from `Intl` and may vary between ICU versions, so
never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 72+ · Firefox 78+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22, and 24. Older runtimes down to
Node 18 work but are not tested on every release.
