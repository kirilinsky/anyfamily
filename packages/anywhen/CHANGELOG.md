# Changelog

## 0.2.0

### Breaking changes

- `anywhen(input, locale, false)` now removes only the clock from same-day
  output. For same-day dates it returns the smart relative word, such as
  `"today"`, instead of a short absolute date like `"Feb 5"`.

  ```ts
  // 0.1.x
  anywhen(todayAtNoon, "en", false); // "Feb 5"

  // 0.2.0
  anywhen(todayAtNoon, "en", false); // "today"
  ```

  This matches the documented meaning of `time: false`: no clock, not no smart
  context. If you need the old same-day absolute date, call `anydate()` directly:

  ```ts
  anydate(todayAtNoon, "en", { day: "numeric", month: "short" });
  ```

### Added

- `locale` is now optional for `anydate()`, `anywhen()`, `anyago()`, and
  `anywhere()`. When omitted, native `Intl` uses the runtime locale.

  ```ts
  anydate(date);
  anywhen(date);
  anyago(date);
  ```

- Added object options for clearer call sites:

  ```ts
  anydate(date, { locale: "en", weekday: "long", month: "long", day: "numeric" });
  anywhen(date, { locale: "en", time: false });
  anyago(date, { locale: "en", numeric: true });
  ```

- Added explicit `now` for SSR-safe relative formatting:

  ```ts
  anywhen(date, { now: requestTime });
  anyago(date, { now: requestTime });
  ```

- Added `timeZone` for `anywhen()`. It controls the displayed clock and the
  smart day boundaries used for today, yesterday, and weekday output.

  ```ts
  anywhen(date, { locale: "en", timeZone: "Europe/Belgrade" });
  ```

- Added a dedicated SSR Ready GitHub Actions workflow and badge.

- Added shorthand boolean calls when using the runtime locale:

  ```ts
  anywhen(date, false);
  anyago(date, true);
  ```

- Added locale fallback arrays:

  ```ts
  anydate(date, ["sr-Latn-RS", "en"]);
  ```

- Exported `DateInput`, `LocaleInput`, `AnydateOptions`, `AnywhenOptions`, and
  `AnyagoOptions` TypeScript types.

### Fixed

- Formatter cache keys now include separators and stable locale-array handling,
  avoiding theoretical key collisions between locale and option values.
