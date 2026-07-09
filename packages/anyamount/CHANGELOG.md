# Changelog

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
