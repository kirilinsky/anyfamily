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

This is a pnpm workspace. All nine packages live under `packages/` — the seven
formatters plus the two metas — each with its own `package.json`, tests and
build. They used to be separate repositories; their history came along, so
`git log packages/anywhen/` and `git blame` work across the move.

```bash
pnpm --filter "./packages/*" test      # everything
pnpm --filter "./packages/*" build

pnpm --filter anywhen test             # one package
pnpm --filter anywhen build
```

The metas depend on their siblings as `workspace:^`, so everything resolves to
local sources rather than the last npm release. That resolution goes through
each package's `dist/`, so **rebuild a package after editing it** or its
consumers keep seeing stale output.

`anyfamily` re-exports every formatter and its public types once — types that
collide across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`)
carry a package prefix. `anyfamily-react` wraps each formatter as a hook sharing
one `AnyfamilyProvider` locale. Adding a formatter to the family means touching
both: the re-export / hook, the package `dependencies`, `keywords`, a test, and
the README.

Each package also has a live demo at `app/<package>/` and an API reference at
`app/docs/<package>/` in the landing app. Changing a public API means updating
those too.

## releasing

Releases go through changesets — see [RELEASING.md](RELEASING.md). Short version:
run `pnpm changeset` and commit the generated file alongside your change. A
breaking change must list the metas in the changeset by hand; they are only
bumped a patch otherwise.

## before opening a PR

Run the whole workspace locally so nothing surprises you:

```bash
pnpm --filter "./packages/*" test
pnpm --filter "./packages/*" build
pnpm lint
pnpm build          # the landing, against local packages
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) still runs the
pre-monorepo subset and needs widening to the full workspace. Match the surrounding code —
existing naming, comment density, and idiom. Keep commits focused.

## license

By contributing you agree your work ships under the [MIT license](LICENSE).
