# anyfamily-react

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
