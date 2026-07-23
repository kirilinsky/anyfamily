# Contributing

Thanks for helping out with the **any\*** family. This repo holds the
[anyfamily.site](https://anyfamily.site) landing page plus the two meta-packages
that ship from it — [`anyfamily`](packages/anyfamily) and
[`anyfamily-react`](packages/anyfamily-react). Each single formatter
(`anywhen`, `anyamount`, `anymany`, `anyaround`, `anylong`, `anyplural`) lives
in its own repo.

## setup

Node 22 and pnpm 10.32.1 (the versions CI pins).

```bash
pnpm install
```

The site and each package keep their own lockfile, so install per workspace you
touch:

```bash
pnpm --dir packages/anyfamily install
pnpm --dir packages/anyfamily-react install
```

## landing site

```bash
pnpm dev          # refreshes versions, then next dev
pnpm build        # refreshes versions, then next build
pnpm lint
pnpm versions     # refresh data/versions.json only
```

Keep it SSR-safe: outputs are computed only after mount so the server render and
first client render can't mismatch on ICU differences between Node and the
browser. Demos must import the real published package and run it — never
hardcode a return value.

## packages

Both meta-packages build with `tsup` and test with `vitest`:

```bash
pnpm --dir packages/anyfamily test
pnpm --dir packages/anyfamily build

pnpm --dir packages/anyfamily-react test
pnpm --dir packages/anyfamily-react build
```

`anyfamily` re-exports every formatter and its public types once — types that
collide across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`)
carry a package prefix. `anyfamily-react` wraps each formatter as a hook sharing
one `AnyfamilyProvider` locale. Adding a formatter to the family means touching
both: the re-export / hook, the package `dependencies`, `keywords`, a test, and
the README.

## before opening a PR

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs, in order:

1. `pnpm lint` and `pnpm build` (site)
2. `pnpm --dir packages/anyfamily test`
3. `pnpm --dir packages/anyfamily-react test`

Run the same locally so nothing surprises you. Match the surrounding code —
existing naming, comment density, and idiom. Keep commits focused.

## license

By contributing you agree your work ships under the [MIT license](LICENSE).
