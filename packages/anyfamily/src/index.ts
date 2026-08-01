/**
 * anyfamily — the whole any* family in one install.
 *
 * Every package exports exactly one name, so this file re-exports seven of
 * them. Extras hang off those names — `anywhen.parts`, `anyword.count`,
 * `anylong.supported` — which is why there are no prefixed aliases here any
 * more: nothing collides.
 *
 * Types still need aliasing where names repeat across packages (`Mode`,
 * `Style`, `SmartOptions`, `CurrencyOptions`); `Locale` is structurally
 * identical across the seven, so it is exported once.
 */

// anywhen — dates, times, relative phrasing (Intl.DateTimeFormat)
export { anywhen } from "anywhen";
export type {
  AnywhenOptions,
  AnywhenPart,
  DateInput,
  Locale,
  Mode as AnywhenMode,
  Style as AnywhenStyle,
  Thresholds,
  ThresholdUnit,
} from "anywhen";

// anyamount — numbers, currency, units (Intl.NumberFormat)
export { anyamount } from "anyamount";
export type {
  AnyamountOptions,
  AnyamountPart,
  CurrencyOptions as AnyamountCurrencyOptions,
  Mode as AnyamountMode,
  SingleUnit,
  SmartOptions as AnyamountSmartOptions,
  Style as AnyamountStyle,
  SymbolOptions as AnyamountSymbolOptions,
  Unit,
  UnitOptions,
} from "anyamount";

// anymany — localized string lists (Intl.ListFormat)
export { anymany } from "anymany";
export type { AnymanyOptions, AnymanyPart, Sort } from "anymany";

// anyaround — region / language / script / currency / calendar names + flags (Intl.DisplayNames)
export { anyaround } from "anyaround";
export type {
  AnyaroundInfo,
  AnyaroundOptions,
  CalendarOptions,
  CurrencyOptions as AnyaroundCurrencyOptions,
  Display,
  DisplayType,
  Fallback,
  LanguageOptions,
  Mode as AnyaroundMode,
  RegionOptions,
  ScriptOptions,
  SmartOptions as AnyaroundSmartOptions,
  Style as AnyaroundStyle,
} from "anyaround";

// anylong — durations (Intl.DurationFormat)
export { anylong } from "anylong";
export type {
  AnylongOptions,
  AnylongPart,
  DecomposeUnit as AnylongDecomposeUnit,
  DurationInput,
  DurationRecord,
} from "anylong";

// anyplural — cardinal / ordinal plurals (Intl.PluralRules)
export { anyplural } from "anyplural";
export type {
  AnypluralOptions,
  AnypluralPart,
  Forms,
  PluralCategory,
  PluralType,
} from "anyplural";

// anyword — words / graphemes / sentences (Intl.Segmenter)
export { anyword } from "anyword";
export type {
  AnywordOptions,
  AnywordPart,
  AnywordTruncateOptions,
  Granularity,
} from "anyword";
