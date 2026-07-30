<p align="center">
  <img src="./logo.png" alt="anyword" width="420" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/anyword"><img src="https://img.shields.io/npm/v/anyword?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyword"><img src="https://img.shields.io/bundlephobia/minzip/anyword?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyword/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anyword/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anyword"><img src="https://codecov.io/github/kirilinsky/anyword/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyword?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro text segmenter built on native <code>Intl</code>.</strong>
  <br />
  Split, count and truncate text by word, grapheme or sentence — in any locale.
</p>

<p align="center">
  <a href="https://anyword-three.vercel.app/">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**Four functions. Correct boundaries. Any locale. Zero dependencies.**

Naive JS quietly gets text wrong: `.length` miscounts emoji and accents,
`.split(" ")` finds no words in Chinese or Thai, `[...str]` rips
`👨‍👩‍👧‍👦` into pieces. `Intl.Segmenter` knows where the real boundaries are.
anyword is the thin wrapper — no rule tables, no locale files, no config.

```ts
import { anyword, anywordCount, anywordTruncate } from "anyword";

anyword("don't stop 世界");
// ["don't", "stop", "世界"]

anyword("👨‍👩‍👧 hi", { by: "grapheme" });
// ["👨‍👩‍👧", " ", "h", "i"]

anywordCount("世界 test");
// 2

anywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" });
// "héllo…"   — never cuts an emoji in half
```

---

## install

```bash
npm install anyword
```

---

## usage

```ts
anyword(text);
anyword(text, options);
```

`text` is any string. `options` are optional — `by` picks the unit, `locale`
picks the rules.

```ts
anyword("hi there");                     // ["hi", "there"]
anyword("hi there", { by: "grapheme" }); // ["h", "i", " ", "t", "h", "e", "r", "e"]
```

---

## recipes

Copy, paste, move on.

```tsx
// Word counter
anywordCount(post.body);
// 412

// Character counter users agree with (👨‍👩‍👧 counts as 1, not 8)
anywordCount(input, { by: "grapheme" });

// Safe preview / char-limit cut
anywordTruncate(bio, 140, { ellipsis: "…" });

// Word-limited excerpt
anywordTruncate(article, 30, { by: "word", ellipsis: " …" });

// Per-character animation, emoji intact
anyword(title, { by: "grapheme" }).map((c, i) => <span key={i}>{c}</span>);

// Safe reverse
anyword(text, { by: "grapheme" }).reverse().join("");

// Initials
anyword(fullName).slice(0, 2).map((w) => anyword(w, { by: "grapheme" })[0]).join("");

// Split into sentences
anyword(text, { by: "sentence" });
```

---

## granularity — word, grapheme, sentence

`by` maps straight to `Intl.Segmenter`:

| `by`         | Unit                      | Example                                           |
| ------------ | ------------------------- | ------------------------------------------------- |
| `"word"`     | words (default)           | `"don't stop 世界"` → `["don't", "stop", "世界"]` |
| `"grapheme"` | user-perceived characters | `"👨‍👩‍👧 hi"` → `["👨‍👩‍👧", " ", "h", "i"]`             |
| `"sentence"` | sentences                 | `"Hi. Go now!"` → `["Hi. ", "Go now!"]`           |

Word mode drops the segments between words — spaces and punctuation. Set
`raw: true` to keep them, and the pieces join back into the original string:

```ts
anyword("hi, there!");                  // ["hi", "there"]
anyword("hi, there!", { raw: true });   // ["hi", ",", " ", "there", "!"]
```

Grapheme and sentence modes never drop anything, so `raw` does nothing there.

---

## count words and characters

`anywordCount()` takes the same options and counts segments instead of
returning them:

```ts
anywordCount("世界 test");                 // 2
anywordCount("世界test");                  // 2   — .split(/\s+/) says 1
anywordCount("héllo", { by: "grapheme" }); // 5
anywordCount("👨‍👩‍👧", { by: "grapheme" });   // 1   — "👨‍👩‍👧".length is 8
```

Grapheme counting is what a char-limit counter should show: the number of
characters the user believes they typed.

---

## truncate without breaking emoji

`anywordTruncate(text, limit, options?)` cuts to at most `limit` segments —
graphemes by default, so an emoji or an accented letter is never split.

```ts
anywordTruncate("héllo 👨‍👩‍👧", 6);                     // "héllo "
anywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" });   // "héllo…"
anywordTruncate("one two three", 2, { by: "word" }); // "one two "
anywordTruncate("short", 99);                        // "short"  — already fits
```

The cut lands on a segment boundary and keeps everything before it verbatim,
trailing whitespace included. With `ellipsis`, that whitespace is trimmed and
the ellipsis appended — and only when the text was actually too long, so short
input comes back untouched. The ellipsis itself does not count toward `limit`.

---

## options

| Option     | Type                                 | Default              | Notes                                  |
| ---------- | ------------------------------------ | -------------------- | -------------------------------------- |
| `by`       | `"word" \| "grapheme" \| "sentence"` | `"word"`<sup>1</sup> | segmentation unit                      |
| `locale`   | `string \| string[]`                 | runtime locale       | BCP 47 tag or fallback[]               |
| `raw`      | `boolean`                            | `false`              | word mode: keep spaces and punctuation |
| `ellipsis` | `string`                             | `""`                 | `anywordTruncate` only                 |

<sup>1</sup> `anywordTruncate` defaults to `"grapheme"` — cutting by character
is what a length limit almost always means.

---

## parts

`anywordParts()` accepts the same arguments as `anyword()` and returns
`{ segment, index, isWordLike? }` instead of plain strings. The offsets point
into the original text, so you can highlight or slice without searching again.

```tsx
import { anywordParts } from "anyword";

anywordParts("世界 test");
// [
//   { segment: "世界", index: 0, isWordLike: true },
//   { segment: "test", index: 3, isWordLike: true },
// ]

// React: highlight the matched word in place
anywordParts(text, { raw: true }).map((p, i) =>
  p.segment === query ? <mark key={i}>{p.segment}</mark> : p.segment,
);
```

`isWordLike` is present in word mode only — in grapheme and sentence modes
every segment is content.

---

## React / Next.js

anyword is pure and synchronous — no clock, no state — so it renders the same
on server and client. Pass a `locale` to keep output stable across the
hydration boundary regardless of the runtime default.

```tsx
import { anywordCount } from "anyword";

export function CharCounter({ value }: { value: string }) {
  return <span>{anywordCount(value, { by: "grapheme", locale: "en" })}/280</span>;
}
```

---

## locales

Pass any valid BCP 47 tag. Fallback arrays also work. The locale matters most
for word breaking in scripts without spaces:

```ts
anyword("これは日本語です", { locale: "ja" });  // ["これ", "は", "日本語", "です"]
anyword("สวัสดีชาวโลก", { locale: "th" });   // ["สวัสดี", "ชาว", "โลก"] — no spaces needed
anyword("don't stop", { locale: "en" });     // ["don't", "stop"]
anyword("hi", { locale: ["xx-Nope", "en"] });
```

When omitted, native `Intl` uses the runtime locale.

---

## vs the alternatives

|                      |     anyword     | grapheme-splitter | words-count + lodash |
| -------------------- | :-------------: | :---------------: | :------------------: |
| gzip                 |    **< 1kb**    |       ~10kb       |        ~25kb         |
| unicode data bundled |     **no**      |        yes        |         yes          |
| boundary rules       | **native Intl** |  bundled tables   |        regex         |
| word / sentence mode |     **yes**     |   grapheme only   |     spaces only      |
| dependencies         |     **0**       |         0         |          1+          |

anyword is not an NLP toolkit — it does one thing. Reach for a tokenizer or a
full i18n framework when you need stemming, stop words, or message catalogs.

---

## support

`Intl.Segmenter` is missing on older runtimes. There anyword throws a clear
error at call time; check the exported `supported` flag first if you target
them.

```ts
import { anyword, supported } from "anyword";

supported ? anyword(text) : text.split(/\s+/);
```

---

## faq

### How do I count emoji as one character in JavaScript?

`.length` counts UTF-16 code units, so `"👨‍👩‍👧".length` is `8`. Count graphemes
instead:

```ts
anywordCount("👨‍👩‍👧", { by: "grapheme" }); // 1
anywordCount("héllo", { by: "grapheme" }); // 5
```

### How do I count words in Chinese, Japanese or Thai?

Those scripts have no spaces, so `.split(/\s+/)` returns one chunk. Word mode
uses the locale's own break rules:

```ts
anywordCount("世界test");                    // 2
anyword("これは日本語です", { locale: "ja" }); // ["これ", "は", "日本語", "です"]
anyword("สวัสดีชาวโลก", { locale: "th" });  // ["สวัสดี", "ชาว", "โลก"]
```

### How do I truncate a string without breaking an emoji?

`slice()` can cut inside a surrogate pair and produce mojibake.
`anywordTruncate` always lands on a grapheme boundary:

```ts
anywordTruncate(bio, 140, { ellipsis: "…" });
```

### How do I split a string into characters safely?

`[...str]` splits by code point, which tears `👨‍👩‍👧‍👦` into pieces and separates
combining accents from their letter. Use grapheme mode:

```ts
anyword(title, { by: "grapheme" }); // ["👨‍👩‍👧", " ", "h", "i"]
```

The same trick reverses text safely:
`anyword(text, { by: "grapheme" }).reverse().join("")`.

### How do I split text into sentences?

```ts
anyword(text, { by: "sentence" }); // ["Hi. ", "Go now!"]
```

### Is this a replacement for grapheme-splitter?

For grapheme splitting, yes — same job, ~10x smaller, because the Unicode
tables come from the runtime instead of the bundle. anyword also does words and
sentences, which grapheme-splitter does not. The trade: it needs
`Intl.Segmenter`, so check `supported` if you target old engines.

### Do I need a polyfill?

Not on Node 18+, Chrome 87+, Firefox 125+ or Safari 14.1+. Below that,
`supported` is `false` and every function throws — branch on the flag.

---

## stability

anyword follows [semver](https://semver.org/). Since 1.0.0 the public API —
`anyword`, `anywordParts`, `anywordCount`, `anywordTruncate`, `supported`, and
the exported types — only changes shape in a major release. New options arrive
in minors; exact boundaries come from `Intl` and may vary between ICU versions,
so never assert on segment lists across environments.

---

## compatibility

Node.js 18+ · Chrome 87+ · Firefox 125+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22, and 24. Older runtimes down to Node 18
work but are not tested on every release.

---

## the any family

anyword is part of **any family** — a set of micro, zero-dependency,
native-first utilities.

- [any family site](https://anyfamily.site/)
- [anyfamily on npm](https://www.npmjs.com/package/anyfamily)
