# examples

Runnable starters that install the **published** packages from npm, not the
workspace — they show what a user gets from `npm install`, and they open in the
browser with no setup.

| Example | Stack | Open |
| --- | --- | --- |
| [vanilla](vanilla) | Vite + TypeScript + `anyfamily`, all eight packages on one page with a locale switcher | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/kirilinsky/anyfamily/tree/main/examples/vanilla?file=src/main.ts) |
| [react](react) | Vite + React + `anyfamily-react`: provider, defaults, a ticking relative time, grapheme counting | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/kirilinsky/anyfamily/tree/main/examples/react?file=src/App.tsx) |

Locally:

```bash
cd examples/vanilla   # or examples/react
npm install
npm run dev
```

These directories are deliberately outside the pnpm workspace, the site's
`tsconfig.json` and its ESLint config: they depend on npm version ranges, and a
workspace link would make them test unreleased code instead. After a major
release, bump the ranges in their `package.json`.
