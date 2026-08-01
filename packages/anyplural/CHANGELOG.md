# Changelog

## 2.0.0

### Major Changes

- 0be5676: anyplural now exports a single name. anypluralParts are gone — the same functionality is
  reached as `anyplural.parts`.

  ```diff
  - import { anyplural, ... } from "anyplural";
  + import { anyplural } from "anyplural";

  - anypluralParts(5, forms);
  + anyplural.parts(5, forms);
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.

## 1.0.0

Initial release.

- `anyplural(count, forms, options?)` — picks the correct plural form for a
  count in any `Intl` locale, formats the count via `Intl.NumberFormat`, and
  interpolates the two: `anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" })` → `"5 лет"`.
- `anypluralParts(...)` — same inputs, returns `{ type, value }` parts so the
  number can be styled apart from the word.
- Cardinal and ordinal via `type` (`"3rd"` from `{ one: "st", two: "nd", few: "rd", other: "th" }`).
- Exact-zero shortcut: an explicit `zero` form replaces the whole output before
  the plural select runs (`"нет писем"`).
- Category fallback chains (`two → few → many → other`), so partial `forms`
  maps still resolve.
- `format` option forwards any `Intl.NumberFormatOptions` to the count.
- Zero dependencies, ESM + CJS, full TypeScript types.
