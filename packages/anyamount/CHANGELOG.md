# Changelog

## 2.0.1

### Patch Changes

- 470bb95: Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

  The family had shipped two different policies under the same helper name. Six packages evicted the oldest _inserted_ entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

  Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.

## 2.0.0

### Major Changes

- 0be5676: anyamount now exports a single name. anyamountParts and anyamountSymbol are gone — the same functionality is
  reached as `anyamount.parts` and `anyamount.symbol`.

  ```diff
  - import { anyamount, ... } from "anyamount";
  + import { anyamount } from "anyamount";

  - anyamountParts(1999, opts);
  + anyamount.parts(1999, opts);

  - anyamountSymbol("USD");
  + anyamount.symbol("USD");
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.

## 1.1.0

Currency symbols, both opt-in. No change to existing output.

- **`currencyDisplay` option** — currency mode takes `"symbol"` (default, unchanged), `"narrowSymbol"` (`"$"` where the locale would print `"US$"`), `"code"` (`"USD 1,999.00"`), or `"name"` (`"1,999.00 US dollars"`).
- **`anyamountSymbol(currency, options?)`** — new export resolving an ISO 4217 code to its localized symbol with no number attached (`"USD"` → `"$"`, `"JPY"` → `"￥"`), for labels, pickers, and input affixes. `display` defaults to `"narrowSymbol"`; codes with no symbol return the code itself.
- Types `CurrencyDisplay` and `SymbolOptions` exported.

## 1.0.0

First stable release.

- **`bigint` support** — `anyamount` and `anyamountParts` accept `number | bigint` in every mode, including values beyond `Number.MAX_SAFE_INTEGER` with no precision loss.
- **Breaking (types only)** — `AnyamountOptions` is now a discriminated union on `mode`: TypeScript requires `currency` in currency mode and `unit` in unit mode at compile time, and rejects options that don't belong to the mode (e.g. `style` in currency mode). Runtime behavior is unchanged; `SmartOptions`, `CurrencyOptions`, and `UnitOptions` are exported.
- **`±Infinity` documented** — formats as the locale's infinity symbol (`"∞"`); `NaN` still throws.
- Coverage tracked on [Codecov](https://codecov.io/gh/kirilinsky/anyamount).

## 0.1.0

Initial trial release. The API may still move before 1.0.

- `anyamount(value, options?)` — one function, three modes:
  - `smart` (default) — compact notation for `|value| >= 10000`, plain formatting below
  - `currency` — `Intl.NumberFormat` currency style, requires `currency`
  - `unit` — `Intl.NumberFormat` unit style, requires `unit`, supports compound `-per-` units
- `anyamountParts(value, options?)` — same signature, returns `formatToParts` output unchanged
- Options: `mode`, `locale`, `currency`, `unit`, `style`, `digits`
- `unit` typed as the union of ECMA-402 sanctioned unit identifiers
- Zero dependencies, ESM + CJS, ~0.7kb gzip
