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

## start to finish

The whole release, in order, including the git steps. Nothing here is automated
— every line is typed by hand.

```bash
# 1. describe the change, then commit it WITH the code
pnpm changeset
git add -A && git commit -m "feat: …" && git push

# 2. apply the versions
pnpm version-packages
git add -A && git commit -m "chore: version packages" && git push

# 3. publish to npm (this also creates the tags, locally)
pnpm release

# 4. push the tags — this is what starts JSR and GitHub Packages.
#    Three at a time, never more: see below.
git push --follow-tags
```

Check afterwards: `npm view anyfamily version` shows the new number, and the
Actions tab shows one green `jsr` run per leaf and one green `github packages`
run per meta.

### five things that trip people up

**A changeset does not publish anything.** It is a file describing intent.
Without one, `pnpm version-packages` finds nothing, versions stay put, and
`pnpm release` publishes nothing — `changeset publish` only pushes packages
whose version is not on npm yet. The changeset is what *creates* the bump.

**Step 1 has to be pushed before step 4.** The tag-triggered workflows are read
from the commit the tag points at, not from the branch head. A workflow added in
the same release it is meant to run for will not run — the tag predates it in
the tree.

**`changeset publish` creates tags but does not push them.** Until step 4 they
sit locally. If several releases go by without a `--follow-tags`, the next push
sends them all at once, and every stale tag re-triggers its workflow: JSR then
fails on "version already exists". Those failures are noise — nothing to fix.

**Never push more than three tags in one go.** GitHub Actions does not create
workflow runs for a push carrying more than three tags — no error, no skipped
run, nothing in the Actions tab. A family-wide release tags eight or ten
packages at once, so the mirrors silently do not run. This is why JSR sat at
`anywhen@1.0.4` while npm was on `2.0.1`: the 2.0.0 wave (nine tags) and the
2.0.1 wave (eight tags) both vanished, and the only `jsr` runs that ever
happened were for two meta tags, which have no `jsr.json` and skipped
themselves.

Push them in batches instead:

```bash
git push origin anywhen@2.0.1 anyamount@2.0.1 anymany@2.0.1
git push origin anyaround@2.0.1 anylong@2.0.1 anyplural@2.0.1
git push origin anyword@2.0.1 anylocale@1.0.1
```

Or fix it after the fact — both mirror workflows take a `workflow_dispatch` with
the package directory:

```bash
gh workflow run jsr.yml -f package=anywhen
```

**npm first, mirrors second.** `pnpm publish` turns each `workspace:^` into a
real version range, so the leaf versions must already be on npmjs before a meta
that depends on them can be published anywhere. That ordering is why the mirrors
run off the tag rather than in parallel with the release.

## what each command does

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

Dependents are bumped **only when the bump breaks the range they declare**, and
then only by a patch — that is the `updateInternalDependencies: "patch"` setting
in `.changeset/config.json`.

Verified twice, in both directions:

- A `major` on `anywhen` produced `anywhen@2.0.0` plus `anyfamily@1.3.1` and
  `anyfamily-react@1.3.1`. `^1.x` cannot cover `2.0.0`, so the metas had to move.
- A `patch` on all eight (2026-08-21) produced **no meta bump at all**. The metas
  declare `workspace:^`, which publishes as `^2.0.0`, and that range already
  covers `2.0.1` — there was nothing to rewrite, so changesets left them alone.

The second case is fine for consumers: `anyfamily@2.1.0` on npm resolves
`^2.0.0` to the new `2.0.1` by itself. It is **not** fine if the metas changed
too — their own change then sits unpublished behind a version that never moved.
That is exactly how the metas' tsdown migration missed the 2.0.1 release.

**Two rules follow:**

- When a change is breaking, list every affected package in the changeset by
  hand — a patch on the metas is wrong whenever their re-exported surface breaks.
- When the metas themselves changed, give them their **own** changeset. Never
  assume a dependent bump will carry them along; on a patch wave it will not
  happen at all.

A breaking change, spelled out by hand:

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
