# Releasing

Every `any*` package lives in this one repository under `packages/`, and every
release goes through [changesets](https://github.com/changesets/changesets).
There is no per-package repo and no per-package publish flow any more.

```
packages/
  anywhen  anyamount  anymany  anyaround  anylong  anyplural  anyword   ← the seven
  anyfamily  anyfamily-react                                            ← the two metas
```

The landing app at the repo root is `private: true`, so it is never published
and changesets ignores it.

## the three commands

```bash
pnpm changeset          # 1. describe the change  (commit the generated file)
pnpm version-packages   # 2. apply versions + changelogs
pnpm release            # 3. build everything, then publish to npm
```

**1. `pnpm changeset`** asks which packages changed and at what level, then
writes a markdown file into `.changeset/`. Commit that file together with the
code — it is the record of intent, not a build artifact.

**2. `pnpm version-packages`** consumes every pending changeset: bumps the
versions, writes `CHANGELOG.md` entries, bumps dependents, deletes the consumed
changeset files, and refreshes the lockfile. Review the diff before committing.

**3. `pnpm release`** builds all packages and runs `changeset publish`, which
pushes only the packages whose version is not on npm yet and creates a git tag
for each. Push the tags afterwards: `git push --follow-tags`.

## the one thing changesets will not do for you

Dependents are bumped automatically, but only by a **patch** — that is the
`updateInternalDependencies: "patch"` setting in `.changeset/config.json`.

Verified: a `major` on `anywhen` produced `anywhen@2.0.0` plus `anyfamily@1.3.1`
and `anyfamily-react@1.3.1`. A patch on the metas is wrong whenever the change
is breaking, because both metas re-export the package's public surface, so their
own surface breaks too.

**Rule: when a change is breaking, list every affected package in the changeset
by hand.**

```markdown
---
"anywhen": major
"anyfamily": major
"anyfamily-react": major
---

anywhen(date) now returns … ; anywhenParts is gone, use anywhen.parts(date).
```

## migrating the family to v2, one package at a time

The v2 shape lands package by package, but the two metas get **one** major at
the end rather than a major per package. That only works if each migration keeps
the metas non-breaking, so the rule is:

**When a package drops an export, the meta keeps it as a deprecated alias.**

```ts
// packages/anyfamily/src/index.ts
export { anywhen } from "anywhen";

import { anywhen as anywhenFn } from "anywhen";

/** @deprecated Use `anywhen.parts` instead. Removed in anyfamily 2.0. */
export const anywhenParts = anywhenFn.parts;
```

Cover each bridge with a test — that it still resolves, and that its output
matches the new call — so the aliases cannot rot while they exist.

Version levels for a single package's migration:

| Package | Level | Why |
| --- | --- | --- |
| the migrated package | `major` | its exports changed |
| `anyfamily` | `minor` | gains a bridge, loses nothing |
| `anyfamily-react` | `patch` or nothing | it calls the bare function, which never changes shape |

When the seventh package lands, one final changeset takes both metas to `2.0.0`
and deletes every bridge at once.

## picking a bump level

| Level | When |
| --- | --- |
| `patch` | bug fix, docs, internal refactor — output and types unchanged |
| `minor` | new export, new option, new accepted input; existing calls unaffected |
| `major` | anything an existing caller must react to: a removed or renamed export, a changed return type, a changed default |

Two cases that look smaller than they are, and are majors:

- Changing a **default option value**. Silent output change for every caller.
- Tightening what an input accepts, even if the old input was arguably invalid.

Output drift caused by the runtime's ICU data is **not** a version event — that
is native `Intl` behaviour the packages deliberately pass through.

## why dependencies say `workspace:^`

Inside the repo the metas declare their siblings as `workspace:^`, so builds and
tests always resolve to the sources sitting next to them, never to the last npm
release. At publish time pnpm rewrites it to a real range (`^2.0.0`) in the
published `package.json`. Nothing named `workspace:` ever reaches npm.

The landing app uses `workspace:*` for the same reason; being private, the range
it would publish is irrelevant.

Consequence to remember: local resolution goes through each package's `dist/`,
not its `src/`. **After editing a package, rebuild it or its consumers keep
seeing the old output.**

```bash
pnpm --filter "./packages/*" build     # rebuild everything
pnpm --filter anywhen build            # or just one
```

## tags

Tags are prefixed per package — `anywhen-v2.0.0`, `anyamount-v1.1.0` — because
bare `v1.0.0` existed in three of the seven repos before they were merged and
would have collided. `changeset publish` creates the modern form, `anywhen@2.0.0`;
both are fine, they cannot clash with each other.

## before publishing

```bash
pnpm --filter "./packages/*" test      # all packages
pnpm --filter "./packages/*" build
pnpm lint
pnpm build                             # the landing, against local packages
```

If a package's public API changed, also update, in the same PR:

- its `README.md`
- its docs page at `app/docs/<package>/`
- its demo at `app/<package>/`
- the meta re-export tables in `packages/anyfamily/src/index.ts` and
  `packages/anyfamily-react/src/index.tsx`
- `lib/packages.ts` if the tagline, tags or description moved

## the old per-package repositories

`kirilinsky/anywhen`, `kirilinsky/anyamount` and the rest are **archived, not
deleted**, and must stay that way. Versions already published to npm carry the
old repository URL in their metadata forever, and that metadata cannot be
rewritten. Deleting a repo would 404 those links and, worse, free the name for
anyone else to claim while npm still points at it.

New releases point at this repo instead, via `repository.directory`.
