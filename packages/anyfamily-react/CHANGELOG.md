# anyfamily-react

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
