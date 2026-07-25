/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * Rendering strategy.
 *
 * - `"smart"` — compact notation for big numbers, plain formatting for small ones (default)
 * - `"currency"` — money via `Intl.NumberFormat` currency style, requires `currency`
 * - `"unit"` — measurements via `Intl.NumberFormat` unit style, requires `unit`
 */
export type Mode = "smart" | "currency" | "unit";

/** Wording length: `"3.2 gigabytes"` / `"3.2 GB"` / `"3.2GB"`. Maps to `Intl.NumberFormat` display options. */
export type Style = "long" | "short" | "narrow";

/**
 * How a currency is spelled out.
 *
 * - `"symbol"` — the locale's symbol (`"$"`, but `"US$"` where the locale disambiguates)
 * - `"narrowSymbol"` — the short symbol always (`"$"`)
 * - `"code"` — the ISO 4217 code (`"USD"`)
 * - `"name"` — the localized name (`"US dollars"`)
 */
export type CurrencyDisplay = "symbol" | "narrowSymbol" | "code" | "name";

/**
 * A sanctioned single unit identifier from ECMA-402
 * (`IsSanctionedSingleUnitIdentifier`).
 */
export type SingleUnit =
  | "acre"
  | "bit"
  | "byte"
  | "celsius"
  | "centimeter"
  | "day"
  | "degree"
  | "fahrenheit"
  | "fluid-ounce"
  | "foot"
  | "gallon"
  | "gigabit"
  | "gigabyte"
  | "gram"
  | "hectare"
  | "hour"
  | "inch"
  | "kilobit"
  | "kilobyte"
  | "kilogram"
  | "kilometer"
  | "liter"
  | "megabit"
  | "megabyte"
  | "meter"
  | "microsecond"
  | "mile"
  | "mile-scandinavian"
  | "milliliter"
  | "millimeter"
  | "millisecond"
  | "minute"
  | "month"
  | "nanosecond"
  | "ounce"
  | "percent"
  | "petabyte"
  | "pound"
  | "second"
  | "stone"
  | "terabit"
  | "terabyte"
  | "week"
  | "yard"
  | "year";

/** A sanctioned unit: either a single unit or a compound `"<unit>-per-<unit>"` pair (`"kilometer-per-hour"`). */
export type Unit = SingleUnit | `${SingleUnit}-per-${SingleUnit}`;

/** One piece of formatted output returned by {@linkcode anyamountParts} — `Intl.NumberFormat.formatToParts` output, unchanged. */
export type AnyamountPart = Intl.NumberFormatPart;

/** Options every mode understands. */
interface BaseOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /**
   * `maximumFractionDigits` — a ceiling, not a fixed width. Fractions are
   * rounded to at most this many digits and trailing zeros are not padded on:
   * `anyamount(2.5, { digits: 2 })` is `"2.5"`, not `"2.50"`.
   *
   * Defaults per mode: smart — 2 plain / 1 compact, unit — 2, currency — the
   * currency's own. Currency mode is the exception on padding: it keeps the
   * currency's minimum (2 for EUR, 0 for JPY), so `"€2.50"` stays padded, and
   * a `digits` below that minimum lowers both (`digits: 0` → `"€2"`).
   */
  digits?: number;
}

/** Options for smart mode (the default). */
export interface SmartOptions extends BaseOptions {
  /** Rendering strategy. Defaults to `"smart"`. */
  mode?: "smart";
  /** Wording length for compact suffixes (`"1.2M"` / `"1.2 million"`). Defaults to `"short"`. */
  style?: Style;
}

/** Options for currency mode. */
export interface CurrencyOptions extends BaseOptions {
  mode: "currency";
  /** ISO 4217 currency code (`"EUR"`, `"JPY"`). */
  currency: string;
  /** How to spell the currency out (`"$1,999.00"` / `"USD 1,999.00"` / `"1,999.00 US dollars"`). Defaults to `"symbol"`. */
  currencyDisplay?: CurrencyDisplay;
}

/** Options for unit mode. */
export interface UnitOptions extends BaseOptions {
  mode: "unit";
  /** Sanctioned unit identifier (`"gigabyte"`, `"kilometer-per-hour"`). */
  unit: Unit;
  /** Wording length for unit names (`"3.2 gigabytes"` / `"3.2 GB"` / `"3.2GB"`). Defaults to `"short"`. */
  style?: Style;
}

/**
 * Options for {@linkcode anyamount} and {@linkcode anyamountParts} — a
 * discriminated union on `mode`. TypeScript requires `currency` in currency
 * mode and `unit` in unit mode at compile time; plain JavaScript callers get
 * the same guarantees as runtime `TypeError`s.
 */
export type AnyamountOptions = SmartOptions | CurrencyOptions | UnitOptions;

/** The union flattened for internal destructuring; {@linkcode plan} re-enforces at runtime what the union promises at compile time. */
type ResolvedOptions = BaseOptions & {
  mode?: Mode;
  currency?: string;
  currencyDisplay?: CurrencyDisplay;
  unit?: Unit;
  style?: Style;
};

/** Compact notation kicks in at this absolute value in smart mode. */
const COMPACT_MIN = 1e4;

const CACHE_LIMIT = 50;

function cacheGet<V>(cache: Map<string, V>, k: string, create: () => V): V {
  const hit = cache.get(k);
  if (hit) return hit;
  const v = create();
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(k, v);
  return v;
}

const nfCache = new Map<string, Intl.NumberFormat>();

const localeKey = (locale?: Locale) =>
  Array.isArray(locale) ? locale.join("\0") : (locale ?? "");

const nf = (l: Locale | undefined, o: Intl.NumberFormatOptions) =>
  cacheGet(nfCache, `${localeKey(l)}|${JSON.stringify(o)}`, () =>
    new Intl.NumberFormat(l as Intl.LocalesArgument, o),
  );

function plan(value: number | bigint, options: AnyamountOptions): Intl.NumberFormat {
  const { mode = "smart", locale, currency, currencyDisplay, unit, style = "short", digits } =
    options as ResolvedOptions;

  if (!(typeof value === "bigint" || (typeof value === "number" && !Number.isNaN(value))))
    throw new TypeError(`Invalid amount: ${String(value)}`);

  if (mode === "smart") {
    const abs = typeof value === "bigint" ? (value < 0 ? -value : value) : Math.abs(value);
    const compact = abs >= COMPACT_MIN;
    return nf(
      locale,
      compact
        ? {
            notation: "compact",
            compactDisplay: style === "long" ? "long" : "short",
            maximumFractionDigits: digits ?? 1,
          }
        : { maximumFractionDigits: digits ?? 2 },
    );
  }

  if (mode === "currency") {
    if (!currency)
      throw new TypeError('anyamount: mode "currency" requires the `currency` option (ISO 4217 code, e.g. "EUR")');
    return nf(
      locale,
      digits === undefined
        ? { style: "currency", currency, currencyDisplay }
        : { style: "currency", currency, currencyDisplay, maximumFractionDigits: digits },
    );
  }

  if (mode === "unit") {
    if (!unit)
      throw new TypeError('anyamount: mode "unit" requires the `unit` option (sanctioned identifier, e.g. "gigabyte")');
    return nf(locale, {
      style: "unit",
      unit,
      unitDisplay: style,
      maximumFractionDigits: digits ?? 2,
    });
  }

  throw new RangeError(`Invalid mode: ${String(mode)}`);
}

/**
 * Formats a number as a human-readable, localized string using native `Intl`.
 *
 * `bigint` values work in every mode. `±Infinity` formats as the locale's
 * infinity symbol (`"∞"`); `NaN` throws.
 *
 * @example
 * ```ts
 * anyamount(1234567, { locale: "en" });                                     // "1.2M"
 * anyamount(1999, { mode: "currency", currency: "EUR", locale: "en" });     // "€1,999.00"
 * anyamount(3.2, { mode: "unit", unit: "gigabyte", locale: "en" });         // "3.2 GB"
 * anyamount(9_007_199_254_740_993n, { locale: "en" });                      // "9007.2T"
 * ```
 *
 * @param value The number (or bigint) to format.
 * @param options See {@linkcode AnyamountOptions}.
 * @returns The formatted string.
 * @throws {TypeError} If `value` is not a number or bigint, is `NaN`, currency mode is missing `currency`, or unit mode is missing `unit`.
 * @throws {RangeError} If `options.mode` is unknown.
 */
export function anyamount(value: number | bigint, options: AnyamountOptions = {}): string {
  return plan(value, options).format(value);
}

/**
 * Like {@linkcode anyamount}, but returns the output as
 * `Intl.NumberFormat.formatToParts` parts instead of a string — style the
 * number apart from the currency symbol or unit, or rebuild the output your
 * own way.
 *
 * @example
 * ```ts
 * anyamountParts(1999, { mode: "currency", currency: "EUR", locale: "en" });
 * // [
 * //   { type: "currency", value: "€" },
 * //   { type: "integer", value: "1" },
 * //   { type: "group", value: "," },
 * //   { type: "integer", value: "999" },
 * //   { type: "decimal", value: "." },
 * //   { type: "fraction", value: "00" },
 * // ]
 * ```
 *
 * @param value The number (or bigint) to format.
 * @param options See {@linkcode AnyamountOptions} — same options as {@linkcode anyamount}.
 * @returns The formatted output as an array of parts.
 * @throws {TypeError} If `value` is not a number or bigint, is `NaN`, currency mode is missing `currency`, or unit mode is missing `unit`.
 * @throws {RangeError} If `options.mode` is unknown.
 */
export function anyamountParts(
  value: number | bigint,
  options: AnyamountOptions = {},
): AnyamountPart[] {
  return plan(value, options).formatToParts(value);
}

/** Options for {@linkcode anyamountSymbol}. */
export interface SymbolOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** Which spelling to return. Defaults to `"narrowSymbol"` — the bare symbol, never `"US$"`. */
  display?: CurrencyDisplay;
}

/**
 * Resolves an ISO 4217 currency code to its localized symbol — `"USD"` → `"$"`,
 * `"EUR"` → `"€"` — with no number attached. For labels, dropdowns, and input
 * affixes, where the amount is rendered separately (or not at all).
 *
 * Codes without a symbol in the locale's data come back as the code itself
 * (`"XAU"` → `"XAU"`), which is what `Intl` renders too.
 *
 * @example
 * ```ts
 * anyamountSymbol("USD", { locale: "en" });                   // "$"
 * anyamountSymbol("EUR", { locale: "en" });                   // "€"
 * anyamountSymbol("JPY", { locale: "ja" });                   // "￥"
 * anyamountSymbol("USD", { locale: "en", display: "name" });  // "US dollars"
 * ```
 *
 * @param currency ISO 4217 currency code (case-insensitive).
 * @param options See {@linkcode SymbolOptions}.
 * @returns The currency symbol as a bare string.
 * @throws {TypeError} If `currency` is missing or not a string.
 * @throws {RangeError} If `currency` is not a well-formed ISO 4217 code — `Intl` decides.
 */
export function anyamountSymbol(currency: string, options: SymbolOptions = {}): string {
  if (!currency || typeof currency !== "string")
    throw new TypeError('anyamount: anyamountSymbol requires an ISO 4217 currency code, e.g. "USD"');

  const { locale, display = "narrowSymbol" } = options;
  const parts = nf(locale, {
    style: "currency",
    currency,
    currencyDisplay: display,
  }).formatToParts(0);

  return parts.find((p) => p.type === "currency")!.value;
}
