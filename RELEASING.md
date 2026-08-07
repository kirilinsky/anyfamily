# Releasing

Every `any*` package lives in this one repository under `packages/`, and every
release goes through [changesets](https://github.com/changesets/changesets).
There is no per-package repo and no per-package publish flow any more.

```
packages/
  anywhen  anyamount  anymany  anyaround                                 ← the eight
  anylong  anyplural  anyword  anylocale                                   leaf packages
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

## adding a package to the family

A new leaf package ships on its own (`1.0.0`, its first changeset is a `minor`
on a package that does not exist yet — changesets treats that as the initial
release). Folding it into the metas is a **separate, later** changeset, once the
package is actually on npm:

| Package | Level | Why |
| --- | --- | --- |
| the new package | — | already published on its own |
| `anyfamily` | `minor` | gains an export, loses nothing |
| `anyfamily-react` | `minor` | gains a hook |

Order matters. The metas depend on the leaf through `workspace:^`, which
resolves to a published range at pack time — so the leaf has to exist on the
registry before the metas that require it do.

The checklist for the meta side, all of which has to land in the same changeset:

- `packages/anyfamily/src/index.ts` — re-export the one name, plus its public
  types. Alias only what collides with a name another package already exports.
- `packages/anyfamily-react/src/index.tsx` — the hook, its types, and the
  `<pkg>Supported` forward if the package has a support flag.
- both `package.json`s — the `workspace:^` dependency, the description, the
  keywords.
- both test suites — the export-surface assertion, and one behaviour test that
  could only pass through the real package.
- both READMEs, the root README table, and `app/opengraph-image.tsx`.

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

## registries

| Registry | What goes there | How |
| --- | --- | --- |
| npmjs | all ten packages, unscoped | `pnpm release`, by hand |
| JSR | the eight leaf packages | `.github/workflows/jsr.yml`, on the release tag |
| GitHub Packages | the two metas, as `@kirilinsky/*` | `.github/workflows/github-packages.yml`, on the release tag |

npmjs is the primary registry and the name people are told to install. The other
two are mirrors and neither is allowed to gate a release.

GitHub Packages only accepts names scoped to the repository owner, so the metas
are published there as `@kirilinsky/anyfamily` and `@kirilinsky/anyfamily-react`
— the workflow rewrites `name` in the manifest just before publishing, and the
npm name stays unscoped. Their dependencies keep their bare npm names and
resolve from npmjs, which is why the eight leaf packages do not need to be
mirrored too: a consumer points only the `@kirilinsky` scope at GitHub.

To install from there, a consumer needs a `.npmrc` with a GitHub token that has
`read:packages` — GitHub Packages requires authentication even for public
packages:

```
@kirilinsky:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @kirilinsky/anyfamily
```

The workflow runs on the release tag, so it lands **after** the npm publish —
`pnpm publish` turns `workspace:^` into a real version range, and those versions
have to exist on npmjs first.

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
