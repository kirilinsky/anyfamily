# anyfamily

<p>
  <a href="https://anyfamily.site"><img src="https://img.shields.io/website?url=https%3A%2F%2Fanyfamily.site&style=flat-square&label=anyfamily.site" alt="website" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Tailwind-v4-black?style=flat-square" alt="Tailwind v4" />
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-black?style=flat-square" alt="MIT" /></a>
</p>

The landing page for the **any\*** family — micro, zero-dependency JavaScript
tools built on native `Intl`. One scroll-snapped page: a hero, then one
full-screen section per package with a live, self-typing example.

**→ [anyfamily.site](https://anyfamily.site)**

## the family

| Package | Does | Intl API | Links |
| --- | --- | --- | --- |
| **anyaround** | region / language / script / currency / calendar names + flags | `Intl.DisplayNames` | [site](https://anyaround.vercel.app) · [npm](https://www.npmjs.com/package/anyaround) · [repo](https://github.com/kirilinsky/anyaround) |
| **anyamount** | numbers, currency, units | `Intl.NumberFormat` | [site](https://anyamount.vercel.app) · [npm](https://www.npmjs.com/package/anyamount) · [repo](https://github.com/kirilinsky/anyamount) |
| **anywhen** | dates, times, relative phrasing | `Intl.DateTimeFormat` | [site](https://anywhen-kappa.vercel.app) · [npm](https://www.npmjs.com/package/anywhen) · [repo](https://github.com/kirilinsky/anywhen) |
| **anymany** | string lists | `Intl.ListFormat` | [site](https://anymany.vercel.app) · [npm](https://www.npmjs.com/package/anymany) · [repo](https://github.com/kirilinsky/anymany) |
| **anylong** | durations | `Intl.DurationFormat` | [site](https://anylong.vercel.app) · [npm](https://www.npmjs.com/package/anylong) · [repo](https://github.com/kirilinsky/anylong) |
| **anyplural** | cardinal / ordinal plurals | `Intl.PluralRules` | [site](https://anyplural.vercel.app) · [npm](https://www.npmjs.com/package/anyplural) · [repo](https://github.com/kirilinsky/anyplural) |

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
