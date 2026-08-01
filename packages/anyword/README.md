<p align="center">
  <img src="https://raw.githubusercontent.com/kirilinsky/anyfamily/main/packages/anyword/logo.png" alt="anyword" width="420" />
</p>

<h1 align="center">anyword</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anyword"><img src="https://img.shields.io/npm/v/anyword?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anyword"><img src="https://img.shields.io/bundlephobia/minzip/anyword?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anyword?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Micro text segmenter built on native <code>Intl</code>.</strong>
  <br />
  Split, count and truncate text by word, grapheme or sentence — in any locale.
</p>

<p align="center">
  <a href="https://anyfamily.site/anyword">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anyword">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Correct boundaries. Any locale. Zero dependencies.**

Naive JS quietly gets text wrong: `.length` miscounts emoji and accents,
`.split(" ")` finds no words in Chinese or Thai, `[...str]` rips 👨‍👩‍👧‍👦 into
pieces. The browser already knows where the real boundaries are — anyword is
the thin wrapper. No rule tables, no locale files, no config.

```ts
import { anyword } from "anyword";

anyword("don't stop 世界");                          // ["don't", "stop", "世界"]
anyword("👨‍👩‍👧 hi", { by: "grapheme" });               // ["👨‍👩‍👧", " ", "h", "i"]
anyword.count("世界 test");                          // 2
anyword.count("👨‍👩‍👧", { by: "grapheme" });            // 1   — "👨‍👩‍👧".length is 8
anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" }); // "héllo…"
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

Returns the segments as plain strings, in order. Everything else hangs off the
same name:

```ts
anyword.parts(text, options?);          // { segment, index, isWordLike? }[]
anyword.count(text, options?);          // number
anyword.truncate(text, limit, options?); // string
anyword.supported;                       // boolean
```

`anyword.parts()` carries offsets into the original text, so you can highlight
or slice without searching again.

```tsx
anyword.parts("世界 test");
// [{ segment: "世界", index: 0, isWordLike: true }, { segment: "test", index: 3, isWordLike: true }]

anyword.parts(text, { raw: true }).map((p, i) =>
  p.segment === query ? <mark key={i}>{p.segment}</mark> : p.segment,
);
```

---

## recipes

Copy, paste, move on.

```tsx
// Word counter
anyword.count(post.body);
// 412

// Character counter users agree with (👨‍👩‍👧 counts as 1, not 8)
anyword.count(input, { by: "grapheme" });

// Safe preview / char-limit cut
anyword.truncate(bio, 140, { ellipsis: "…" });

// Word-limited excerpt
anyword.truncate(article, 30, { by: "word", ellipsis: " …" });

// Per-character animation, emoji intact
anyword(title, { by: "grapheme" }).map((c, i) => <span key={i}>{c}</span>);

// Safe reverse
anyword(text, { by: "grapheme" }).reverse().join("");

// Initials
anyword(fullName).slice(0, 2).map((w) => anyword(w, { by: "grapheme" })[0]).join("");

// Split into sentences
anyword(text, { by: "sentence" });
```

anyword is pure and synchronous — no clock, no state — so it renders the same on
server and client. Pass an explicit `locale` to keep it that way.

---

## granularity

`by` maps straight to `Intl.Segmenter`:

| `by` | Unit | Example |
| --- | --- | --- |
| `"word"` | words (default) | `"don't stop 世界"` → `["don't", "stop", "世界"]` |
| `"grapheme"` | user-perceived characters | `"👨‍👩‍👧 hi"` → `["👨‍👩‍👧", " ", "h", "i"]` |
| `"sentence"` | sentences | `"Hi. Go now!"` → `["Hi. ", "Go now!"]` |

Word mode drops the segments between words — spaces and punctuation. Set
`raw: true` to keep them, and the pieces join back into the original string.

```ts
anyword("hi, there!");                 // ["hi", "there"]
anyword("hi, there!", { raw: true });  // ["hi", ",", " ", "there", "!"]
```

Grapheme and sentence modes never drop anything, so `raw` does nothing there.

→ [Every granularity in detail](https://anyfamily.site/docs/anyword#granularity)

---

## options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `by` | `"word" \| "grapheme" \| "sentence"` | `"word"` | `truncate` defaults to `"grapheme"` |
| `locale` | `string \| string[]` | runtime locale | BCP 47 tag or fallback array |
| `raw` | `boolean` | `false` | word mode only — keep spaces and punctuation |
| `ellipsis` | `string` | `""` | `truncate` only — appended when text was cut |

`truncate` cuts on a segment boundary, so an emoji or an accented letter is
never split. The ellipsis does not count toward the limit, and short input comes
back untouched.

→ [What each option does, with examples](https://anyfamily.site/docs/anyword#options)

---

## locales

Any valid BCP 47 tag, and fallback arrays. The locale matters most for word
breaking in scripts without spaces. When omitted, native `Intl` uses the runtime
locale.

```ts
anyword("これは日本語です", { locale: "ja" }); // ["これ", "は", "日本語", "です"]
anyword("สวัสดีชาวโลก", { locale: "th" });   // ["สวัสดี", "ชาว", "โลก"] — no spaces needed
anyword("don't stop", { locale: "en" });     // ["don't", "stop"]
```

---

## vs the alternatives

| | anyword | grapheme-splitter | words-count + lodash |
| --- | :---: | :---: | :---: |
| gzip | **< 1kb** | ~10kb | ~25kb |
| unicode data bundled | **no** | yes | yes |
| boundary rules | **native Intl** | bundled tables | regex |
| word / sentence mode | **yes** | grapheme only | spaces only |
| dependencies | **0** | 0 | 1+ |

anyword is not an NLP toolkit — it does one thing. Reach for a tokenizer or a
full i18n framework when you need stemming, stop words or message catalogs.

---

## stability

anyword follows [semver](https://semver.org/). The public API is a single
export — `anyword`, with `parts`, `count`, `truncate` and `supported` on it —
plus `AnywordOptions`, `Granularity` and the exported types. It only changes
shape in a major release.

Segment lists come from the runtime's ICU data and may vary between Node
versions, browsers and OSes — especially for CJK and Thai. Test behaviour, not
exact arrays.

### migrating from 1.x

2.0 removed the separate `anywordParts`, `anywordCount`, `anywordTruncate` and
`supported` exports. All four are the same values, now reached through the one
name the package exports:

```diff
- import { anyword, anywordCount, anywordTruncate, supported } from "anyword";
+ import { anyword } from "anyword";

- anywordCount(text);
+ anyword.count(text);

- anywordTruncate(text, 20);
+ anyword.truncate(text, 20);

- supported ? anyword(text) : text.split(/\s+/);
+ anyword.supported ? anyword(text) : text.split(/\s+/);
```

Arguments, return values and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

`Intl.Segmenter` landed late — Firefox 125, Safari 14.1. On engines without it
every call throws; branch on `anyword.supported` if you target them.

Node.js 18+ · Chrome 87+ · Firefox 125+ · Safari 14.1+ · Edge Runtime ·
Cloudflare Workers · Deno

CI runs the full suite on Node 20, 22 and 24.

---

## the any family

anyword is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [anylong](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
| [anyplural](https://anyfamily.site/anyplural) | plurals | `Intl.PluralRules` |
| [**anyword**](https://anyfamily.site/anyword) | words & graphemes | `Intl.Segmenter` |

Want all of them? [`anyfamily`](https://www.npmjs.com/package/anyfamily) is one
install for the lot, and [`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)
wraps each as a hook with a shared locale provider.

```bash
npm install anyfamily
```

---

MIT © [kirilinsky](https://github.com/kirilinsky)
