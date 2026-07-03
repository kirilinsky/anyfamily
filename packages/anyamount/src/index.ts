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

/** Options for {@linkcode anyamount} and {@linkcode anyamountParts}. Each mode reads only the options that apply to it. */
export interface AnyamountOptions {
  /** Rendering strategy. Defaults to `"smart"`. */
  mode?: Mode;
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** ISO 4217 currency code (`"EUR"`, `"JPY"`). Required by currency mode. */
  currency?: string;
  /** Sanctioned unit identifier (`"gigabyte"`, `"kilometer-per-hour"`). Required by unit mode. */
  unit?: Unit;
  /** Wording length for unit names and compact suffixes. Smart and unit modes. Defaults to `"short"`. */
  style?: Style;
  /** Maximum fraction digits. Defaults per mode: smart — 2 plain / 1 compact, unit — 2, currency — the currency's own. */
  digits?: number;
}

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

function plan(value: number, options: AnyamountOptions): Intl.NumberFormat {
  const { mode = "smart", locale, currency, unit, style = "short", digits } = options;

  if (typeof value !== "number" || Number.isNaN(value))
    throw new TypeError(`Invalid amount: ${String(value)}`);

  if (mode === "smart") {
    const compact = Math.abs(value) >= COMPACT_MIN;
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
        ? { style: "currency", currency }
        : { style: "currency", currency, maximumFractionDigits: digits },
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
 * @example
 * ```ts
 * anyamount(1234567);                                          // "1.2M"
 * anyamount(1999, { mode: "currency", currency: "EUR" });      // "€1,999.00"
 * anyamount(3.2, { mode: "unit", unit: "gigabyte" });          // "3.2 GB"
 * ```
 *
 * @param value The number to format.
 * @param options See {@linkcode AnyamountOptions}.
 * @returns The formatted string.
 * @throws {TypeError} If `value` is not a number, currency mode is missing `currency`, or unit mode is missing `unit`.
 * @throws {RangeError} If `options.mode` is unknown.
 */
export function anyamount(value: number, options: AnyamountOptions = {}): string {
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
 * @param value The number to format.
 * @param options See {@linkcode AnyamountOptions} — same options as {@linkcode anyamount}.
 * @returns The formatted output as an array of parts.
 * @throws {TypeError} If `value` is not a number, currency mode is missing `currency`, or unit mode is missing `unit`.
 * @throws {RangeError} If `options.mode` is unknown.
 */
export function anyamountParts(
  value: number,
  options: AnyamountOptions = {},
): AnyamountPart[] {
  return plan(value, options).formatToParts(value);
}
