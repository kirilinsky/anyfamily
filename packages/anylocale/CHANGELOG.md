# anylocale

## 1.0.1

### Patch Changes

- 470bb95: Cache resolved locale info by the argument as given, not only by the canonical tag it resolves to.

  Every call used to run `new Intl.Locale()` and `Intl.DateTimeFormat.supportedLocalesOf()` before consulting the cache, so the expensive half of the work happened even on a repeat call. Reading `anylocale("en-US").direction` in a loop drops from ~4.6µs to ~208ns.

  Behaviour is unchanged: differently-cased tags still share one record, a fallback chain still returns the same record as the tag it resolves to, and invalid input still throws.

- 470bb95: Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

  The family had shipped two different policies under the same helper name. Six packages evicted the oldest _inserted_ entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

  Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.
