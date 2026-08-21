# Changelog

## 2.0.1

### Patch Changes

- 470bb95: Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

  The family had shipped two different policies under the same helper name. Six packages evicted the oldest _inserted_ entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

  Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.

## 2.0.0

### Major Changes

- 0be5676: anylong now exports a single name. anylongParts and supported are gone — the same functionality is
  reached as `anylong.parts` and `anylong.supported`.

  ```diff
  - import { anylong, ... } from "anylong";
  + import { anylong } from "anylong";

  - anylongParts("2h 30m");
  + anylong.parts("2h 30m");

  - supported ? anylong(ms) : fallback;
  + anylong.supported ? anylong(ms) : fallback;
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.

## 1.0.0

- Initial release: `anylong`, `anylongParts`, `supported`.
- Inputs: number (ms or s), `Date`, two `Date`s, ISO 8601 duration strings,
  human shorthand strings, `Intl.DurationFormat` duration records.
- Options: `locale`, `style`, `unit`, `largestUnit`, `smallestUnit`, plus full
  `Intl.DurationFormat` option passthrough.
- Deterministic rejection of ambiguous input (colon strings, negatives,
  fractions in shorthand, unknown keys) with descriptive errors.
