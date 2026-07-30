# anyfamily

<p>
  <a href="https://anyfamily.site"><img src="https://img.shields.io/website?url=https%3A%2F%2Fanyfamily.site&style=flat-square&label=anyfamily.site" alt="website" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Tailwind-v4-black?style=flat-square" alt="Tailwind v4" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-black?style=flat-square" alt="MIT" /></a>
</p>

Home of the **any\*** family — micro, zero-dependency JavaScript tools built
on native `Intl`. The landing is one scroll-snapped page: a hero, then a
full-screen section per package with a live, self-typing example. Every package
also has an interactive demo at `/<package>` and an API reference at
`/docs/<package>`, all served from this one app — the standalone per-package
demo sites have been folded in.

**→ [anyfamily.site](https://anyfamily.site)**

## the family

| Package | Does | Intl API | Links |
| --- | --- | --- | --- |
| **anyaround** | region / language / script / currency / calendar names + flags | `Intl.DisplayNames` | [demo](https://anyfamily.site/anyaround) · [docs](https://anyfamily.site/docs/anyaround) · [npm](https://www.npmjs.com/package/anyaround) · [repo](https://github.com/kirilinsky/anyaround) |
| **anyamount** | numbers, currency, units | `Intl.NumberFormat` | [demo](https://anyfamily.site/anyamount) · [docs](https://anyfamily.site/docs/anyamount) · [npm](https://www.npmjs.com/package/anyamount) · [repo](https://github.com/kirilinsky/anyamount) |
| **anywhen** | dates, times, relative phrasing | `Intl.DateTimeFormat` | [demo](https://anyfamily.site/anywhen) · [docs](https://anyfamily.site/docs/anywhen) · [npm](https://www.npmjs.com/package/anywhen) · [repo](https://github.com/kirilinsky/anywhen) |
| **anymany** | string lists | `Intl.ListFormat` | [demo](https://anyfamily.site/anymany) · [docs](https://anyfamily.site/docs/anymany) · [npm](https://www.npmjs.com/package/anymany) · [repo](https://github.com/kirilinsky/anymany) |
| **anylong** | durations | `Intl.DurationFormat` | [demo](https://anyfamily.site/anylong) · [docs](https://anyfamily.site/docs/anylong) · [npm](https://www.npmjs.com/package/anylong) · [repo](https://github.com/kirilinsky/anylong) |
| **anyplural** | cardinal / ordinal plurals | `Intl.PluralRules` | [demo](https://anyfamily.site/anyplural) · [docs](https://anyfamily.site/docs/anyplural) · [npm](https://www.npmjs.com/package/anyplural) · [repo](https://github.com/kirilinsky/anyplural) |
| **anyword** | words / graphemes / sentences, count + truncate | `Intl.Segmenter` | [demo](https://anyfamily.site/anyword) · [docs](https://anyfamily.site/docs/anyword) · [npm](https://www.npmjs.com/package/anyword) · [repo](https://github.com/kirilinsky/anyword) |

## how it works

- **Honest examples.** Each demo imports the real published package and runs it
  in the browser — the revealed output is the genuine return value, never
  hardcoded. Presets are ordered simplest-first so the essence reads before the
  option-rich variants.
- **Live version badges.** `scripts/versions.mjs` (a `prebuild` / `predev` step)
  pulls each package's latest version from the npm registry into
  `data/versions.json`, so every deploy shows current versions. It falls back to
  the installed version, then the committed file, so a build never fails on it.
- **SSR-safe.** Outputs are computed only after mount, so the server render and
  first client render can't mismatch on ICU differences between Node and the
  browser.
- **SEO.** Metadata, OpenGraph + Twitter cards, a generated OG image and
  favicon, `robots.txt`, `sitemap.xml`, JSON-LD (`WebSite` + an `ItemList` of
  `SoftwareApplication`s with live versions), and a per-section `<h2>`.

## dev

```bash
pnpm install
pnpm dev          # refreshes versions, then next dev
pnpm build        # refreshes versions, then next build
pnpm lint
pnpm versions     # refresh data/versions.json only
```

Next.js 16 · React 19 · Tailwind v4 · TypeScript.

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
