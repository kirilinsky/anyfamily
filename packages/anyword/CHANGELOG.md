# Changelog

## 2.0.1

### Patch Changes

- 470bb95: Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

  The family had shipped two different policies under the same helper name. Six packages evicted the oldest _inserted_ entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

  Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.

## 2.0.0

### Major Changes

- 0be5676: anyword now exports a single name. anywordParts, anywordCount, anywordTruncate and supported are gone — the same functionality is
  reached as `anyword.parts`, `anyword.count`, `anyword.truncate` and `anyword.supported`.

  ```diff
  - import { anyword, ... } from "anyword";
  + import { anyword } from "anyword";

  - anywordCount(text);
  + anyword.count(text);

  - anywordTruncate(text, 20);
  + anyword.truncate(text, 20);
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.

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
