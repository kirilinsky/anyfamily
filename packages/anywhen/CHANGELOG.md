# Changelog

## 2.0.1

### Patch Changes

- 470bb95: Give every package the same formatter-cache eviction policy: LRU, but only once the cache is full.

  The family had shipped two different policies under the same helper name. Six packages evicted the oldest _inserted_ entry, so an app's one hot locale was thrown away every 50 misses and rebuilt at cold-call prices; two refreshed recency on every hit, paying ~120ns for ordering that cannot matter until something is actually evicted.

  Both halves are fixed at once. Below the limit a hit is a bare `Map.get`; at the limit recency starts being tracked. Measured on Node 22, hot call with cold locales streaming past it: anyamount 1.3µs → 545ns, anyword 5.3µs → 3.2µs, anywhen 902ns → 713ns, anyplural 1.1µs → 831ns. Steady-state and cache-miss costs are unchanged, and anymany's hit gets slightly cheaper now that it no longer pays for recency it was not using.

## 2.0.0

### Major Changes

- 92b97c3: anywhen now exports a single name. `anywhenParts` is gone — the same function is
  reached as `anywhen.parts`.

  ```diff
  - import { anywhen, anywhenParts } from "anywhen";
  + import { anywhen } from "anywhen";

  - anywhenParts(date, { mode: "relative" });
  + anywhen.parts(date, { mode: "relative" });
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. This is the first package on the family-wide v2 shape: the bare
  call does the job, everything else hangs off the same name.

## 1.0.3

### Changed

- Smart mode now labels **future** dates with the same calendar phrasing it
  already used for the past — symmetric in both directions. Within the next
  week you get `"tomorrow, 3:00 PM"` and `"Friday, 3:00 PM"` instead of the
  numeric `"in 1 day"` / `"in 3 days"`; beyond a week it falls back to the
  absolute date, mirroring the past. `relative` mode is unchanged and still
  always numeric. No API changes, no new options, bundle size unchanged.

  ```ts
  anywhen(inThreeHours); // "today, 5:00 PM"
  anywhen(tomorrow); // "tomorrow, 2:35 PM"
  anywhen(inThreeDays); // "Friday, 2:35 PM"
  ```

## 1.0.2

### Fixed

- Smart mode now honors `thresholds.minute`. The sub-hour minutes window was
  hardcoded to 3600s, ignoring the override; it now reads
  `thresholds.minute ?? 3600` like the other units.

  ```ts
  anywhen(date, { thresholds: { minute: 1800 } });
  // rolls into "today" / weekday labels past 30 min instead of 60
  ```

## 1.0.1

### Docs

- Added JSDoc to every exported symbol — hover docs in editors, symbol
  documentation on JSR. No runtime changes; the minified bundle is unchanged.
- Corrected the stated bundle size (~1.3kb gzip after 1.0.0's `thresholds`
  and `anywhenParts`).

## 1.0.0

First stable release. The public API — `anywhen`, `anywhenParts`,
`AnywhenOptions`, and the exported types — now follows semver: breaking
changes only in majors.

### Added

- Added `anywhenParts()`. Same arguments as `anywhen()`, returns
  `{ type, value, unit? }` parts for custom rendering. Exposed as the public
  `AnywhenPart` type.

  ```ts
  anywhenParts(date, { mode: "relative", locale: "en" });
  // [
  //   { type: "integer", value: "3", unit: "hour" },
  //   { type: "literal", value: " hours ago" },
  // ]
  ```

- Added `thresholds` for smart and relative modes. Overrides any subset of
  the unit-selection cutoffs (seconds); the rest keep their defaults. Exposed
  as the public `Thresholds` and `ThresholdUnit` types.

  ```ts
  anywhen(date, { mode: "relative", thresholds: { minute: 5400 } });
  // "50 minutes ago" instead of "1 hour ago"
  ```

- Published to JSR as `@kirilinsky/anywhen`.

### Changed

- Declared `engines.node >= 18`. CI now runs the test suite on Node 20, 22,
  and 24 instead of 24 only.

### Internal

- One shared render plan now backs both `anywhen()` and `anywhenParts()`,
  so the smart cascade logic exists once.
- Added tests for invalid input, formatter-cache eviction past 50 locales,
  `format` + `timeZone` combined, `thresholds`, and parts/string parity.
- The demo tracks the latest published anywhen via Dependabot.

## 0.4.0

### Added

- Added `style` for smart and relative modes. Maps to
  `Intl.RelativeTimeFormat` and shortens the relative phrasing.

  ```ts
  anywhen(date, { mode: "relative", locale: "en", style: "short" });
  // "3 hr. ago"

  anywhen(date, { mode: "relative", locale: "en", style: "narrow" });
  // "3h ago"
  ```

  In smart mode it affects only the relative wording (`"10 min. ago"`,
  `"in 3 hr."`). Calendar labels (`today`, `yesterday`, weekday) and the
  absolute fallback are unchanged. Exposed as the public `Style` type.

### Internal

- Bumped dev dependencies: `oxlint` 1.71, `publint` 0.3.21, `tsdown` 0.22.3.

## 0.3.2

### Fixed

- Relative durations now round symmetrically for past and future. Previously
  `Math.round` on negative values rendered `1.5h ago` as `"1 hour ago"` while
  `1.5h` ahead rendered as `"in 2 hours"`.

- Smart mode no longer renders `"60 minutes ago"` at the top of the minute
  range. It rolls over to `"today"` (past) or `"in 1 hour"` (future).

## 0.3.1

### Changed

- Smart mode defers the calendar-day calculation until it is needed, skipping
  the timezone lookup for `now`, sub-hour, and future dates.

- Added `sideEffects: false` and `packageManager` to `package.json`, and dropped
  the stray `npx` from the `test:coverage` script.

## 0.3.0

### Breaking changes

- Replaced the multi-function API with one function and three modes.

  ```ts
  // before
  anydate(date, "en");
  anywhen(date, "en");
  anyago(date, "en");

  // now
  anywhen(date, { mode: "absolute", locale: "en" });
  anywhen(date, { locale: "en" }); // smart mode by default
  anywhen(date, { mode: "relative", locale: "en" });
  ```

- Removed `anydate()`, `anyago()`, and `anywhere()` exports. Use
  `anywhen(input, { mode })` instead.

- Replaced positional locale/boolean arguments with a single options object.

  ```ts
  // before
  anywhen(date, "en", false);

  // now
  anywhen(date, { locale: "en", time: false });
  ```

- Renamed exported locale/options types around the new API:
  `Locale`, `Mode`, and `AnywhenOptions` are now the public option types.

### Added

- Added `mode`:

  ```ts
  anywhen(date); // smart
  anywhen(date, { mode: "absolute" });
  anywhen(date, { mode: "relative" });
  ```

- Added `format` for absolute mode. It accepts any
  `Intl.DateTimeFormatOptions`.

  ```ts
  anywhen(date, {
    mode: "absolute",
    locale: "en",
    format: { weekday: "long", month: "long", day: "numeric" },
  });
  ```

- Added explicit `now` for SSR-safe smart and relative formatting.

  ```ts
  anywhen(date, { now: requestTime });
  anywhen(date, { mode: "relative", now: requestTime });
  ```

- Added `timeZone` for smart and absolute mode. In smart mode it controls both
  the displayed clock and the calendar boundaries for today, yesterday, and
  weekday output.

  ```ts
  anywhen(date, { locale: "en", timeZone: "Europe/Belgrade" });
  ```

- Added locale fallback arrays.

  ```ts
  anywhen(date, { locale: ["sr-Latn-RS", "en"] });
  ```

- Added dedicated `SSR Ready` GitHub Actions workflow and badge.

### Fixed

- `time: false` in smart mode now removes only the clock. Same-day output stays
  smart and returns words like `"today"` instead of falling back to a short
  absolute date.

- Package exports now include separate ESM and CJS declaration conditions, so
  `publint` passes without warnings.

- Formatter cache keys now separate locale, numeric mode, and format options to
  avoid theoretical key collisions.
