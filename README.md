# anyfamily

Landing page for the **any\*** family — micro, zero-dependency JavaScript tools
built on native `Intl`. One page, one idea: names & flags, money, dates, and
lists, in any locale, with live interactive examples.

| Package | Does | Intl API |
| --- | --- | --- |
| [anyaround](https://anyaround.vercel.app) | region / language / script / currency / calendar names + flags | `Intl.DisplayNames` |
| [anyamount](https://anyamount.vercel.app) | numbers, currency, units | `Intl.NumberFormat` |
| [anywhen](https://anywhen-kappa.vercel.app) | dates & times | `Intl.DateTimeFormat` |
| [anymany](https://anymany.vercel.app) | string lists | `Intl.ListFormat` |

The live examples use native `Intl` directly, so the page carries no runtime
dependency on the packages themselves.

## dev

```bash
pnpm install
pnpm dev
```

Next.js 16 · React 19 · Tailwind v4.
