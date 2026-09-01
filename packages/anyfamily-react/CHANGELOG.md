# anyfamily-react

## 2.2.0

### Minor Changes

- 3613eaa: `AnyfamilyProvider` now takes `defaults` — per-hook option defaults for the
  settings that are the same app-wide, so a currency or a style is written once
  instead of at every call site. A call's own options win key by key; a call that
  names a different `mode` than the default replaces it rather than layering onto
  it, since the options types are discriminated unions and the default's
  mode-specific keys do not belong to another mode. `locale` is not mode-specific
  and crosses either way, keeping the precedence `options.locale` → the default's
  locale → the provider's `locale`. `useAnyfamilyDefaults()` reads them back.

  The eight plain functions are re-exported as well, for formatting outside a
  hook without adding the underlying package as a second dependency.

  Also: `useAnyword` now keys its memo on the option fields rather than on a
  stringified object, so reordering the keys of an inline options literal no
  longer drops the memoized array, and the key costs less per render.

## 2.1.1

### Patch Changes

- Build both meta packages with tsdown, the same bundler the eight libraries use, instead of tsup.

  The published output is equivalent, with one filename change: the ESM entry is now `dist/index.mjs` rather than `dist/index.js`, matching every other package in the family. It is reached through the `exports` map, which was updated with it, so nothing an importer writes has to change.

  `anyfamily-react` no longer needs its post-build step — rolldown keeps the `"use client"` directive on its own, where esbuild stripped it — and a test now asserts the directive is present exactly once at the top of both bundles.

## 2.1.0

### Minor Changes

- 4647c94: Add anylocale to both meta-packages.

  `anyfamily` re-exports `anylocale` and its public types (`AnylocaleInfo`,
  `Direction`, `Weekday`) — none of them collide, so none are aliased.

  `anyfamily-react` gains `useAnylocale(tag?)` and the `anylocaleSupported`
  forward. The hook differs from the formatting hooks in two ways, both forced by
  the underlying package: `anylocale` takes its tag as an argument rather than as
  an option and has no "whatever the runtime uses" default, so with neither an
  argument nor a provider the hook resolves the runtime's locale the way `Intl`
  would; and it returns an object, so the result is memoized on the tag and keeps
  its reference between renders.

## 2.0.0

### Major Changes

- 0be5676: Tracks the family's 2.0 wave.

  The hook surface itself is unchanged — every hook keeps its name and signature,
  and `anylongSupported` / `anywordSupported` are still exported (now as plain
  forwards of `anylong.supported` and `anyword.supported`, rather than the
  disambiguating aliases they used to be, since nothing collides any more).

  This is a major so the whole family shares one version line, and because the
  packages underneath it all changed shape: anything reaching past the hooks into
  `anywhen`, `anyword` and the rest needs their migration notes.

### Patch Changes

- Updated dependencies [0be5676]
- Updated dependencies [0be5676]
- Updated dependencies [0be5676]
- Updated dependencies [0be5676]
- Updated dependencies [0be5676]
- Updated dependencies [0be5676]
  - anyamount@2.0.0
  - anyaround@2.0.0
  - anylong@2.0.0
  - anymany@2.0.0
  - anyplural@2.0.0
  - anyword@2.0.0
