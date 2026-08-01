# Package standard

Every `any*` package under `packages/` is built the same way, so moving between
them costs nothing. **`packages/anywhen` is the reference implementation** — when
this document and anywhen disagree, anywhen is right and this document is stale.

Status: anywhen conforms as of 2.0. The other six are being brought in line one
at a time.

## the API shape

One export per package, named after the package. The bare call does the job;
everything else hangs off that same name.

```ts
anywhen(date)              // the job
anywhen.parts(date)        // an extra
anyword.count(text)        // an extra on another package
anylong.supported          // a flag, same rule
```

No second export, ever — no `anywhenParts`, no `anywordCount`, no bare
`supported`. A helper that takes a *different kind* of input is still a static
on the same name (`anyamount.symbol("USD")`), not a new export.

Types are the exception: they are exported normally, since they carry no runtime
weight and cannot hang off a value.

```ts
export const anywhen = Object.assign(format, { parts });
export type { AnywhenOptions, AnywhenPart, DateInput, Locale /* … */ };
```

Guard it with a test, so the shape cannot drift back:

```ts
it("exports exactly one name, with extras hanging off it", async () => {
  const mod = await import("./index");
  expect(Object.keys(mod)).toEqual(["anywhen"]);
});
```

## required files

```
packages/<name>/
  package.json
  README.md            ← the npm landing page; see the section order below
  CHANGELOG.md         ← written by changesets, never by hand
  LICENSE              ← MIT, one per package (npm ships it regardless of `files`)
  logo.png             ← referenced from README as ./logo.png, never a third-party URL
  jsr.json             ← JSR manifest; version kept in step by scripts/sync-jsr.mjs
  tsconfig.json
  tsdown.config.ts
  vitest.config.ts
  src/
    index.ts           ← the whole implementation, single file
    index.test.ts
  scripts/
    cjs-types.mjs      ← emits dist/index.d.cts alongside the ESM types
    sync-jsr.mjs       ← mirrors package.json version into jsr.json on `npm version`
```

Optional, add when it earns its place:

- `src/ssr.test.ts` — where server/client output could diverge
- `scripts/check-size.mjs` — a gzip budget guard

## never in a package

These live at the repo root only:

| File | Why root-only |
| --- | --- |
| `CONTRIBUTING.md` | one contribution process for the whole repo |
| `CODE_OF_CONDUCT.md` | one community, not nine |
| `.github/` | GitHub Actions only reads workflows at the repo root; nested ones silently never run |
| `pnpm-lock.yaml` | the workspace has exactly one lockfile |
| `RELEASING.md`, `PACKAGE-STANDARD.md`, `plans.md` | repo-level docs |

Also absent: `demo/`. Demos live in the landing app at `app/<package>/`, with
the API reference at `app/docs/<package>/`.

## package.json

```jsonc
{
  "name": "anywhen",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": { … }, "require": { … } } },
  "files": ["dist"],
  "engines": { "node": ">=18" },

  "repository": {
    "type": "git",
    "url": "git+https://github.com/kirilinsky/anyfamily.git",
    "directory": "packages/anywhen"     // ← the directory field is required
  },
  "bugs": { "url": "https://github.com/kirilinsky/anyfamily/issues" },
  "homepage": "https://anyfamily.site/anywhen",

  "scripts": {
    "build": "tsdown && node scripts/cjs-types.mjs",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "lint": "oxlint src",
    "publint": "publint",
    "version": "node scripts/sync-jsr.mjs && git add jsr.json"
  }
}
```

No `release` script — releases run from the repo root through changesets, see
[RELEASING.md](RELEASING.md).

`repository.url` must point at **this** repo. The archived per-package repos
stay archived; only versions published before the move still reference them, and
that metadata cannot be rewritten.

## README vs docs — who owns what

The README is the npm page. It is read by someone **deciding whether to take the
package**: does it solve my problem, will it run in my environment, what does it
cost. The docs page at `app/docs/<package>/` is a reference, read by someone
**already using it** and looking something up.

Split the material along that line, and keep **one fact in one place**. Two
copies of an options table means one of them goes stale, and it will be the one
you open less often.

| README | Docs page |
| --- | --- |
| pitch, badges, install | every option explained, with examples |
| usage — the API's range in ~15 lines | each mode / granularity broken down |
| recipes — copy-paste answers to real tasks | SSR, input types, thresholds |
| a **compact** options table: names, types, defaults, no prose | the locale gallery |
| one package-specific section, the most important one | calendars, eras, edge cases |
| vs the alternatives, compatibility | limitations |
| stability + migration diff | React / Next.js integration |
| the any family table | |

The compact options table stays in the README deliberately: people read READMEs
offline, from `node_modules`, in a terminal. Option *names* change rarely, the
prose around them changes often — so the table is cheap to keep honest while
the explanations live in one place.

Every trimmed section ends with a link to its docs anchor:

```md
→ [What each option does, with examples](https://anyfamily.site/docs/anywhen#options)
```

## README section order

Same order in every package, so a reader who knows one knows them all. Target
length ~170–200 lines; anywhen is 267 including its family table and is the
reference.

1. logo (local `./logo.png`), badges, one-line pitch, links (demo · docs · family)
2. the pitch line + a first code block, before any prose
3. `## install`
4. `## usage` — including the extras (`anywhen.parts`, `anyword.count`, …)
5. `## recipes` — copy-paste solutions to real tasks
6. one package-specific section (`## modes`, `## granularity`, `## sorting`, …), the rest link out
7. `## options` — compact table only
8. `## locales`
9. `## vs the alternatives` — only where a real alternative exists
10. `## stability` — the semver promise, plus a `### migrating from Nx` diff
11. `## compatibility`
12. `## the any family` — the table of all seven plus the metas
13. the MIT line

Badges point at the monorepo CI, never at a per-package workflow.

## docs page section order

`app/docs/<package>/docs-client.tsx`, built on the shared `DocsShell`:

Overview · Install · `<pkg>()` · Migrating from Nx · the extras (`<pkg>.parts()`
…) · package-specific deep dives · Options · Recipes · React / Next.js · SSR ·
Input types · Locales · package-specific edge cases · Compatibility ·
Limitations

## when a package's public API changes

Update all of it in one PR:

- `src/index.ts` and its tests, including the surface test above
- the package `README.md`
- `app/<package>/` (demo) and `app/docs/<package>/` (reference)
- both meta packages: `packages/anyfamily/src/index.ts` and
  `packages/anyfamily-react/src/index.tsx`, plus their READMEs and tests
- `lib/packages.ts` if the tagline, tags or description moved
- a changeset naming every affected package — see [RELEASING.md](RELEASING.md)
