# Changelog

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
