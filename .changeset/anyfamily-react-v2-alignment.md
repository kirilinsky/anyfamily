---
"anyfamily-react": major
---

Tracks the family's 2.0 wave.

The hook surface itself is unchanged — every hook keeps its name and signature,
and `anylongSupported` / `anywordSupported` are still exported (now as plain
forwards of `anylong.supported` and `anyword.supported`, rather than the
disambiguating aliases they used to be, since nothing collides any more).

This is a major so the whole family shares one version line, and because the
packages underneath it all changed shape: anything reaching past the hooks into
`anywhen`, `anyword` and the rest needs their migration notes.
