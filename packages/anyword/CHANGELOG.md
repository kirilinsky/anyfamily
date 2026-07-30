# Changelog

## 1.0.0

Initial release.

- `anyword(text, options?)` — locale-correct segmentation via native
  `Intl.Segmenter`: words by default, graphemes or sentences via `by`.
  `anyword("don't stop 世界")` → `["don't", "stop", "世界"]`.
- `anywordParts(...)` — same inputs, returns `{ segment, index, isWordLike? }`
  so segments can be mapped back onto the original string.
- `anywordCount(text, options?)` — segment count; grapheme mode is the
  character count users actually see (`"👨‍👩‍👧"` → `1`, not `8`).
- `anywordTruncate(text, limit, options?)` — boundary-safe cut, grapheme by
  default, with an optional `ellipsis` appended only on a real cut.
- `raw` option keeps whitespace and punctuation in word mode, so the segments
  rejoin into the input.
- `supported` flag for runtimes without `Intl.Segmenter`; every function throws
  a clear error there.
- Zero dependencies, ESM + CJS, full TypeScript types.
