/**
 * anyfamily — the whole any* family in one install.
 *
 * Named re-exports of anywhen, anyamount, anymany, anyaround, anylong,
 * anyplural and anyword, plus every public type from each. Types whose names
 * collide across packages (`Mode`, `Style`, `SmartOptions`, `CurrencyOptions`,
 * `supported`) are aliased with their package prefix; `Locale` is structurally
 * identical across the seven Intl packages, so it is exported once.
 */

// anywhen — dates, times, relative phrasing (Intl.DateTimeFormat)
// On the v2 shape: one export, extras hang off it (`anywhen.parts`).
export { anywhen } from "anywhen";

import { anywhen as anywhenFn } from "anywhen";

/**
 * @deprecated Use `anywhen.parts` instead. Kept so anyfamily 1.x keeps working
 * while the family migrates to the v2 shape one package at a time — every
 * bridge like this one is removed together in anyfamily 2.0.
 */
export const anywhenParts = anywhenFn.parts;
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
export { anyamount, anyamountParts, anyamountSymbol } from "anyamount";
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
export { anymany, anymanyParts } from "anymany";
export type { AnymanyOptions, AnymanyPart, Sort } from "anymany";

// anyaround — region / language / script / currency / calendar names + flags (Intl.DisplayNames)
export { anyaround, anyaroundInfo } from "anyaround";
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
export { anylong, anylongParts, supported as anylongSupported } from "anylong";
export type {
  AnylongOptions,
  AnylongPart,
  DecomposeUnit as AnylongDecomposeUnit,
  DurationInput,
  DurationRecord,
} from "anylong";

// anyplural — cardinal / ordinal plurals (Intl.PluralRules)
export { anyplural, anypluralParts } from "anyplural";
export type {
  AnypluralOptions,
  AnypluralPart,
  Forms,
  PluralCategory,
  PluralType,
} from "anyplural";

// anyword — words / graphemes / sentences (Intl.Segmenter)
export {
  anyword,
  anywordCount,
  anywordParts,
  anywordTruncate,
  supported as anywordSupported,
} from "anyword";
export type {
  AnywordOptions,
  AnywordPart,
  AnywordTruncateOptions,
  Granularity,
} from "anyword";
