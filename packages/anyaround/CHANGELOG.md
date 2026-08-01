# Changelog

## 2.0.0

### Major Changes

- 0be5676: anyaround now exports a single name. anyaroundInfo are gone — the same functionality is
  reached as `anyaround.info`.

  ```diff
  - import { anyaround, ... } from "anyaround";
  + import { anyaround } from "anyaround";

  - anyaroundInfo("US");
  + anyaround.info("US");
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.

## 1.0.0

First stable release. The API is now under semver — no breaking changes until 2.0.

- No API changes from `0.1.0`; the surface has proven stable.
- Docs polished and example outputs reconciled with current ICU.
- `prepublishOnly` guards the build so `dist` is never published stale.

## 0.1.0

Initial trial release. The API may still move before 1.0.

- `anyaround(code, options?)` — one function, smart or explicit mode:
  - `smart` (default) — infers the kind from the code's shape (region, language, script, currency)
  - `region` — ISO 3166-1 alpha-2 or UN M49, with optional flag emoji via `display`
  - `language` — BCP 47 / ISO 639, with `languageDisplay` dialect vs standard
  - `script` — ISO 15924 (e.g. `Latn`, `Cyrl`)
  - `currency` — ISO 4217 name (not a rate)
  - `calendar` — never smart-detected, must be explicit
- `anyaroundInfo(code, options?)` — same signature, returns `{ code, type, name, flag }`
- Flags derived from alpha-2 region codes via Regional Indicator Symbols; surfaced with `display: "flag" | "flag-name" | "name-flag"`
- Options: `mode`, `locale`, `style`, `display`, `fallback`, `languageDisplay`
- Options typed as a discriminated union on `mode`
- Zero dependencies, ESM + CJS, wraps native `Intl.DisplayNames`
