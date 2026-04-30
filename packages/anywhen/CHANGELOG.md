# Changelog

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
