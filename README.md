# anyfamily

<p>
  <a href="https://anyfamily.site"><img src="https://img.shields.io/website?url=https%3A%2F%2Fanyfamily.site&style=flat-square&label=anyfamily.site" alt="website" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
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
| **anyaround** | region / language / script / currency / calendar names + flags | `Intl.DisplayNames` | [demo](https://anyfamily.site/anyaround) · [docs](https://anyfamily.site/docs/anyaround) · [npm](https://www.npmjs.com/package/anyaround) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anyaround) |
| **anyamount** | numbers, currency, units | `Intl.NumberFormat` | [demo](https://anyfamily.site/anyamount) · [docs](https://anyfamily.site/docs/anyamount) · [npm](https://www.npmjs.com/package/anyamount) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anyamount) |
| **anywhen** | dates, times, relative phrasing | `Intl.DateTimeFormat` | [demo](https://anyfamily.site/anywhen) · [docs](https://anyfamily.site/docs/anywhen) · [npm](https://www.npmjs.com/package/anywhen) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anywhen) |
| **anymany** | string lists | `Intl.ListFormat` | [demo](https://anyfamily.site/anymany) · [docs](https://anyfamily.site/docs/anymany) · [npm](https://www.npmjs.com/package/anymany) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anymany) |
| **anylong** | durations | `Intl.DurationFormat` | [demo](https://anyfamily.site/anylong) · [docs](https://anyfamily.site/docs/anylong) · [npm](https://www.npmjs.com/package/anylong) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anylong) |
| **anyplural** | cardinal / ordinal plurals | `Intl.PluralRules` | [demo](https://anyfamily.site/anyplural) · [docs](https://anyfamily.site/docs/anyplural) · [npm](https://www.npmjs.com/package/anyplural) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anyplural) |
| **anyword** | words / graphemes / sentences, count + truncate | `Intl.Segmenter` | [demo](https://anyfamily.site/anyword) · [docs](https://anyfamily.site/docs/anyword) · [npm](https://www.npmjs.com/package/anyword) · [source](https://github.com/kirilinsky/anyfamily/tree/main/packages/anyword) |

## how it works

- **Honest examples.** Each demo imports the real package — workspace-linked to
  the source in `packages/`, so what you see is what the next release ships —
  and runs it in the browser. The revealed output is the genuine return value,
  never hardcoded. Presets are ordered simplest-first so the essence reads
  before the option-rich variants.
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

This is a pnpm workspace: the landing app at the root, and all nine packages
under `packages/`.

```bash
pnpm install

# the site
pnpm dev          # refreshes versions, then next dev
pnpm build        # refreshes versions, then next build
pnpm lint

# the packages
pnpm --filter "./packages/*" test
pnpm --filter "./packages/*" build
pnpm --filter anywhen test        # just one
```

The site resolves the packages through their `dist/`, so **rebuild a package
after editing it** or the demos keep showing the old output.

Releases go through changesets — see [RELEASING.md](RELEASING.md). Package
layout and conventions are in [PACKAGE-STANDARD.md](PACKAGE-STANDARD.md).

Next.js 16 · React 19 · Tailwind v4 · TypeScript.

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
