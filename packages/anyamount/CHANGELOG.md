# Changelog

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
