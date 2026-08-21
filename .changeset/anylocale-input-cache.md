---
"anylocale": patch
---

Cache resolved locale info by the argument as given, not only by the canonical tag it resolves to.

Every call used to run `new Intl.Locale()` and `Intl.DateTimeFormat.supportedLocalesOf()` before consulting the cache, so the expensive half of the work happened even on a repeat call. Reading `anylocale("en-US").direction` in a loop drops from ~4.6µs to ~208ns.

Behaviour is unchanged: differently-cased tags still share one record, a fallback chain still returns the same record as the tag it resolves to, and invalid input still throws.
