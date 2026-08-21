---
"anywhen": patch
"anyamount": patch
"anymany": patch
"anyaround": patch
"anylong": patch
"anylocale": patch
"anyplural": patch
"anyword": patch
---

Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

The family had shipped two different policies under the same helper name. Six packages evicted the oldest *inserted* entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.
