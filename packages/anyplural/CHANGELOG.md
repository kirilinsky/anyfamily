# Changelog

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
