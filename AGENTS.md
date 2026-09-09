# AGENTS.md

Instructions for coding agents working in this repository. Humans: see
[CONTRIBUTING.md](CONTRIBUTING.md) and [RELEASING.md](RELEASING.md).

## what this is

A pnpm monorepo: eight micro `Intl` formatters (`packages/any*`), two meta
packages (`packages/anyfamily`, `packages/anyfamily-react`) and the landing
site (`app/`, Next.js) with a demo at `/<pkg>` and a reference at
`/docs/<pkg>` for each. `PACKAGE-STANDARD.md` is the ruler every package is
measured against; `plans.md` is the roadmap and the record of decisions.

## commands

```bash
pnpm install --frozen-lockfile
pnpm --filter "./packages/*" build        # dependency order; leaves first
pnpm --filter <pkg> test | typecheck | lint | publint
pnpm --filter "./packages/*" --if-present knip   # metas only
pnpm lint && pnpm build                   # the site — exactly what Vercel runs
pnpm bench                                # perf harness over dist/, diffs against scripts/bench-baseline.json
```

## things that are not obvious

- **The metas need a build first.** `anyfamily` and `anyfamily-react` import
  their siblings by package name, which resolves to each sibling's `dist/`.
  On a fresh checkout their tests and typecheck fail until the leaves are
  built. The landing app resolves through `dist/` too — editing a package
  without rebuilding shows stale demos.
- **The eight leaves test their own `src/`** and need no build.
- **Node matters.** tsdown needs Node ≥ 22.18; `Intl.DurationFormat` (anylong)
  needs Node 23+; CI tests the leaves on 20/22/24 and builds on 24. A test that
  depends on a runtime API must `skipIf(!pkg.supported)` and assert the flag
  matches the runtime instead of assuming.
- **Local green is not CI green.** Before claiming anything passes: delete
  `packages/*/dist` and `.next`, `pnpm install --frozen-lockfile`, then run the
  CI steps in CI order on the Node version CI uses. State the Node version in
  the result.
- **Do not add a ninth core `any*` package.** Decided; the only reopening
  condition is a genuinely new native `Intl` API. Metas and framework adapters
  may grow.

## the shape every package keeps

- One runtime export, named after the package; extras hang off it
  (`anywhen.parts`, `anyword.count`, `anylong.supported`). A test asserts
  `Object.keys(mod)` is exactly `[name]`.
- One source file, `src/index.ts`, zero dependencies, ESM + CJS via tsdown.
- The three private helpers (`cacheGet`, `localeKey`, `optKey`) are identical
  in all eight. Change one, change all; `packages/anywhen` is the reference.
  Cache keys are built from option values, never `JSON.stringify(options)`.
- Error types and messages are part of the API; do not change them casually.

## when you change a public API

Update all of it in one change: `src/index.ts` and its tests, the package
`README.md`, `app/<pkg>/` (demo), `app/docs/<pkg>/` (reference, including
`limitations.ts`, which also feeds the FAQ structured data), both metas
(`packages/anyfamily/src/index.ts`, `packages/anyfamily-react/src/index.tsx`)
with their READMEs and tests, `lib/packages.ts` if the tagline moved, and a
changeset. READMEs are also served to AI crawlers as `/llms-full.txt`, so a
stale README is stale there too.

## changesets

One changeset file per package. A single file that names several packages
copies its whole text into every package's `CHANGELOG.md`. Never edit
`CHANGELOG.md` by hand. `pnpm version-packages` bumps versions and syncs
`jsr.json`; releases run from the repo root only (`pnpm release`).

## style

- TypeScript strict; no new dependencies in the leaves, ever.
- Comments explain why, not what. Keep the existing tone.
- Repository content is English. Do not translate files.
