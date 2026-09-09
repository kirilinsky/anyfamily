---
"anywhen": patch
"anyamount": patch
"anyaround": patch
"anyplural": patch
"anylong": patch
"anyword": patch
"anylocale": patch
"anymany": minor
"anyfamily": patch
"anyfamily-react": minor
---

One pass over the whole family — simpler internals, faster hot paths, nothing removed.

**All eight libraries** share one set of private helpers now (`cacheGet`, `localeKey`, `optKey`), and formatter cache keys are built from the option values instead of `JSON.stringify(options)` — cheaper per call, and `{ day, month }` / `{ month, day }` share one formatter.

- **anymany** — `items` accepts any iterable (`Set`, generator), not only arrays; the new `Items` type says so.
- **anyaround** — resolved names are cached (500 entries), so re-rendering a country picker no longer pays `Intl.DisplayNames.of` per row. `info()` still returns a fresh object.
- **anyamount** — `symbol()` caches its result; a `digits` below the currency's own minimum lowers the minimum with it on every engine, where older ones threw.
- **anywhen** — smart mode's fixed formats are keyed presets; the default path allocates and stringifies nothing.
- **anylong** — the shorthand parser accepts the same spellings from a smaller table; passthrough options no longer need `void` juggling.
- **anyword** — segment walking is a visitor instead of a generator (early exit for `truncate`, fewer allocations); a fractional `truncate` limit keeps its floor.
- **anyplural**, **anylocale** — simpler plans; stale 1.x names in JSDoc corrected everywhere.

**anyfamily-react**

- `useAnyfamily()` — every function in the family bound to the nearest provider: same signatures, extras included (`anywhen.parts`, `anyaround.info`, `anyamount.symbol`, `anyword.count`), locale and defaults applied, memoized on the provider.
- `useAnywhen` hooks with the same `refresh` share one interval instead of one timer each.
- One context backs the provider; `useAnyfamilyLocale` / `useAnyfamilyDefaults` are unchanged.
- `useAnymany` accepts any iterable, matching anymany.
