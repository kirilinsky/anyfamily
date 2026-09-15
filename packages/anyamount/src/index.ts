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

/** One piece of formatted output returned by {@linkcode anyamount.parts} — `Intl.NumberFormat.formatToParts` output, unchanged. */
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
  /**
   * When compact notation (`"1.2K"`, `"3.4M"`) kicks in. `true` — always,
   * for counters and badges; `false` — never; a number — from that absolute
   * value up. Defaults to `10000`, so `9999` stays plain and `12345` reads
   * `"12.3K"`.
   */
  compact?: boolean | number;
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
 * Options for {@linkcode anyamount} and {@linkcode anyamount.parts} — a
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
  compact?: boolean | number;
};

/** Compact notation kicks in at this absolute value in smart mode. */
const COMPACT_MIN = 1e4;

const CACHE_LIMIT = 50;

/**
 * Formatter cache. LRU, but only once it is full.
 *
 * Keeping Map order in step with recency costs a delete + re-set on every hit —
 * ~120ns, real money against a format call that takes ~500ns. Below the limit
 * nothing can be evicted, so that order buys nothing and the hit stays a bare
 * `Map.get`. Once the cache is full, eviction is possible and recency starts to
 * matter: a plain FIFO would drop the app's one hot locale every 50 misses, and
 * rebuilding a formatter costs ~50-90µs.
 */
function cacheGet<V>(
  cache: Map<string, V>,
  k: string,
  create: () => V,
  limit = CACHE_LIMIT,
): V {
  const hit = cache.get(k);
  if (hit !== undefined) {
    if (cache.size >= limit) {
      // Move to the end — Map iterates in insertion order, and the eviction
      // below takes the first key it sees.
      cache.delete(k);
      cache.set(k, hit);
    }
    return hit;
  }
  const v = create();
  if (cache.size >= limit) cache.delete(cache.keys().next().value!);
  cache.set(k, v);
  return v;
}

const localeKey = (locale?: Locale): string =>
  typeof locale === "string" ? locale : locale ? locale.join("\0") : "";

const nfCache = new Map<string, Intl.NumberFormat>();
const symbolCache = new Map<string, string>();

/**
 * A currency formatter. `digits` is a ceiling: when it sits below the
 * currency's own minimum (2 for EUR, 0 for JPY) the minimum is lowered with
 * it — which is what current engines do on their own, and what older ones
 * reject as `maximumFractionDigits < minimumFractionDigits`.
 */
function currencyFormat(
  locale: Locale | undefined,
  currency: string,
  currencyDisplay: CurrencyDisplay | undefined,
  digits: number | undefined,
): Intl.NumberFormat {
  const base: Intl.NumberFormatOptions = { style: "currency", currency, currencyDisplay };
  if (digits === undefined) return new Intl.NumberFormat(locale, base);
  const min = new Intl.NumberFormat(locale, base).resolvedOptions().minimumFractionDigits;
  return new Intl.NumberFormat(locale, {
    ...base,
    minimumFractionDigits: Math.min(min ?? digits, digits),
    maximumFractionDigits: digits,
  });
}

function check(value: number | bigint): void {
  if (!(typeof value === "bigint" || (typeof value === "number" && !Number.isNaN(value))))
    throw new TypeError(`Invalid amount: ${String(value)}`);
}

function plan(value: number | bigint, options: AnyamountOptions): Intl.NumberFormat {
  const {
    mode = "smart",
    locale,
    currency,
    currencyDisplay,
    unit,
    style = "short",
    digits,
    compact = COMPACT_MIN,
  } = options as ResolvedOptions;

  check(value);

  const lk = localeKey(locale);

  if (mode === "smart") {
    const abs = typeof value === "bigint" ? (value < 0 ? -value : value) : Math.abs(value);
    const from = compact === true ? 0 : compact === false ? Infinity : compact;
    if (abs >= from) {
      const compactDisplay = style === "long" ? "long" : "short";
      const max = digits ?? 1;
      return cacheGet(nfCache, `${lk}|c|${compactDisplay}|${max}`, () =>
        new Intl.NumberFormat(locale, {
          notation: "compact",
          compactDisplay,
          maximumFractionDigits: max,
        }),
      );
    }
    const max = digits ?? 2;
    return cacheGet(nfCache, `${lk}|p|${max}`, () =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: max }),
    );
  }

  if (mode === "currency") {
    if (!currency)
      throw new TypeError('anyamount: mode "currency" requires the `currency` option (ISO 4217 code, e.g. "EUR")');
    return cacheGet(nfCache, `${lk}|$|${currency}|${currencyDisplay ?? ""}|${digits ?? ""}`, () =>
      currencyFormat(locale, currency, currencyDisplay, digits),
    );
  }

  if (mode === "unit") {
    if (!unit)
      throw new TypeError('anyamount: mode "unit" requires the `unit` option (sanctioned identifier, e.g. "gigabyte")');
    const max = digits ?? 2;
    return cacheGet(nfCache, `${lk}|u|${unit}|${style}|${max}`, () =>
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: style,
        maximumFractionDigits: max,
      }),
    );
  }

  throw new RangeError(`Invalid mode: ${String(mode)}`);
}

function format(value: number | bigint, options: AnyamountOptions = {}): string {
  return plan(value, options).format(value);
}

function parts(value: number | bigint, options: AnyamountOptions = {}): AnyamountPart[] {
  return plan(value, options).formatToParts(value);
}

const larger = (a: number | bigint, b: number | bigint) => {
  const absA = typeof a === "bigint" ? (a < 0 ? -a : a) : Math.abs(a);
  const absB = typeof b === "bigint" ? (b < 0 ? -b : b) : Math.abs(b);
  return absA >= absB ? a : b;
};

function range(
  from: number | bigint,
  to: number | bigint,
  options: AnyamountOptions = {},
): string {
  check(from);
  check(to);
  // Smart mode picks compact notation from the value's size; a range is as big
  // as its bigger end.
  const f = plan(larger(from, to), options) as Intl.NumberFormat & {
    formatRange?: (a: number | bigint, b: number | bigint) => string;
  };
  // `Intl.NumberFormat.formatRange` is ES2023 — absent on Node 18, where the
  // two ends are formatted separately and joined with an en dash instead.
  return f.formatRange ? f.formatRange(from, to) : `${f.format(from)} – ${f.format(to)}`;
}

/** Options for {@linkcode anyamount.parse}. */
export interface ParseOptions {
  /** The locale the text was written in. Defaults to the runtime locale. */
  locale?: Locale;
}

/** What a locale writes numbers with, read off `Intl` rather than stored. */
interface Notation {
  group: string;
  decimal: string;
  minus: string;
  /** The locale's digits (every numbering system), each mapped to its value. */
  digits: Map<string, number>;
}

const notationCache = new Map<string, Notation>();

function notation(locale: Locale | undefined): Notation {
  return cacheGet(notationCache, localeKey(locale), () => {
    const n: Notation = { group: "", decimal: "", minus: "-", digits: new Map() };
    // One number that exercises every digit, a group, a fraction and the sign.
    const parts = new Intl.NumberFormat(locale).formatToParts(-9876543210.5);
    let seen = "";
    for (const p of parts) {
      if (p.type === "group") n.group = p.value;
      else if (p.type === "decimal") n.decimal = p.value;
      else if (p.type === "minusSign") n.minus = p.value;
      else if (p.type === "integer" || p.type === "fraction") seen += p.value;
    }
    // `seen` is "98765432105" in the locale's own digits, in that order.
    Array.from(seen).forEach((ch, i) => n.digits.set(ch, +"98765432105"[i]));
    for (let d = 0; d <= 9; d++) n.digits.set(String(d), d);
    return n;
  });
}

const isSpace = (ch: string) => ch === " " || ch === "\u00a0" || ch === "\u202f" || ch === "\u2009";

function parse(text: string, options: ParseOptions = {}): number {
  if (typeof text !== "string") throw new TypeError(`Invalid text: ${String(text)}`);
  const { group, decimal, minus, digits } = notation(options.locale);

  const chars = Array.from(text);
  const isDigit = (ch: string) => digits.has(ch);
  // Any of the separators a locale uses, whichever locale this is — so a
  // German writing "1'234" the Swiss way, or a Swiss typing the curly
  // apostrophe their keyboard offers, still parses.
  const isSep = (ch: string) =>
    ch === group || ch === decimal || ch === "," || ch === "." || ch === "'" || ch === "\u2019";

  // The number proper runs from the first digit to the last one; whatever
  // wraps it — a currency symbol or code, a unit, a percent sign, whitespace —
  // is ignored, but only there. Letters between digits are not a number.
  let start = chars.findIndex(isDigit);
  if (start < 0) return NaN;
  let end = chars.length - 1;
  while (!isDigit(chars[end])) end--;

  const before = chars.slice(0, start);
  const after = chars.slice(end + 1);
  const isMinus = (ch: string) => ch === minus || ch === "-" || ch === "\u2212";
  // One sign at most: a minus on either side, or accounting parentheses.
  const signs =
    before.filter(isMinus).length +
    after.filter(isMinus).length +
    (before.includes("(") && after.includes(")") ? 1 : 0);
  if (signs > 1) return NaN;
  const negative = signs === 1;

  // Separators: the locale's decimal is the decimal, its group is skipped.
  // The one rule beyond that — a separator that occurs once and is followed
  // by one or two digits is a decimal point whatever the locale says, since
  // "1.5" typed into a German form means one and a half, not fifteen
  // hundred — and "1.500" keeps the locale's reading.
  const core = chars.slice(start, end + 1);
  const seps = core.filter(isSep);
  let decimalChar = decimal;
  if (seps.length === 1) {
    const at = core.lastIndexOf(seps[0]);
    const trailing = core.length - at - 1;
    if (seps[0] !== decimal && trailing > 0 && trailing < 3) decimalChar = seps[0];
  }

  let out = "";
  let sawDecimal = false;
  for (const ch of core) {
    const d = digits.get(ch);
    if (d !== undefined) out += d;
    else if (ch === decimalChar) {
      if (sawDecimal) return NaN;
      sawDecimal = true;
      out += ".";
    } else if (ch === group || isSpace(ch) || (isSep(ch) && ch !== decimalChar)) continue;
    else return NaN;
  }

  const n = Number(out);
  return negative ? -n : n;
}

/** Options for {@linkcode anyamount.symbol}. */
export interface SymbolOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** Which spelling to return. Defaults to `"narrowSymbol"` — the bare symbol, never `"US$"`. */
  display?: CurrencyDisplay;
}

function symbol(currency: string, options: SymbolOptions = {}): string {
  if (!currency || typeof currency !== "string")
    throw new TypeError('anyamount: anyamount.symbol requires an ISO 4217 currency code, e.g. "USD"');

  const { locale, display = "narrowSymbol" } = options;
  // The symbol is a fixed fact about (locale, currency, display), so the string
  // itself is cached — the formatter behind it is only needed once.
  return cacheGet(symbolCache, `${localeKey(locale)}|${currency}|${display}`, () => {
    const f = new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: display });
    return f.formatToParts(0).find((p) => p.type === "currency")!.value;
  });
}

/**
 * Formats a number as a human-readable, localized string using native
 * `Intl.NumberFormat` — compact for big values, currency, or sanctioned units.
 *
 * `bigint` values work in every mode. `±Infinity` formats as the locale's
 * infinity symbol (`"∞"`); `NaN` throws.
 *
 * The package exports this one name. Anything beyond the plain call hangs off
 * it: {@linkcode anyamount.parts} and {@linkcode anyamount.symbol}.
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
export const anyamount = Object.assign(format, {
  /**
   * Like calling {@linkcode anyamount} directly, but returns the
   * `Intl.NumberFormat.formatToParts` output instead of a string — style the
   * number apart from the currency symbol or unit, or rebuild the output your
   * own way.
   *
   * Takes the same arguments and throws on the same inputs.
   *
   * @example
   * ```ts
   * anyamount.parts(1999, { mode: "currency", currency: "EUR", locale: "en" });
   * // [
   * //   { type: "currency", value: "€" },
   * //   { type: "integer", value: "1" },
   * //   { type: "group", value: "," },
   * //   { type: "integer", value: "999" },
   * //   { type: "decimal", value: "." },
   * //   { type: "fraction", value: "00" },
   * // ]
   * ```
   */
  parts,

  /**
   * Resolves an ISO 4217 currency code to its localized symbol — `"USD"` →
   * `"$"`, `"EUR"` → `"€"` — with no number attached. For labels, currency
   * pickers and input affixes, where the amount is rendered separately (or not
   * at all).
   *
   * Codes without a symbol in the locale's data come back as the code itself
   * (`"XAU"` → `"XAU"`), which is what `Intl` renders too. Takes a currency
   * code rather than an amount, so it is a static on the package name.
   *
   * @example
   * ```ts
   * anyamount.symbol("USD", { locale: "en" });                    // "$"
   * anyamount.symbol("EUR", { locale: "en" });                    // "€"
   * anyamount.symbol("JPY", { locale: "ja" });                    // "￥"
   * anyamount.symbol("USD", { locale: "en", display: "name" });   // "US dollars"
   * ```
   *
   * @param currency ISO 4217 currency code (case-insensitive).
   * @param options See {@linkcode SymbolOptions}.
   * @returns The currency symbol as a bare string.
   * @throws {TypeError} If `currency` is missing or not a string.
   * @throws {RangeError} If `currency` is not a well-formed ISO 4217 code — `Intl` decides.
   */
  symbol,

  /**
   * Formats two numbers as one range, the way the locale writes it — the
   * shared parts collapse, so `"€10.00 – €20.00"` becomes `"€10.00–20.00"`.
   * Same options as {@linkcode anyamount}; both ends are validated the same
   * way. Built on `Intl.NumberFormat.formatRange`; where the runtime lacks it
   * (Node 18) the two ends are formatted separately and joined with an en dash.
   *
   * @example
   * ```ts
   * anyamount.range(10, 20, { mode: "currency", currency: "EUR", locale: "en" }); // "€10.00 – 20.00"
   * anyamount.range(1, 2.5, { mode: "unit", unit: "kilogram", locale: "en" });     // "1–2.5 kg"
   * anyamount.range(1500, 2400, { compact: true, locale: "en" });                  // "1.5K – 2.4K"
   * ```
   */
  range,

  /**
   * The other direction: reads a number the way a person wrote it in a locale
   * — `"1.999,00"` in German is `1999`, `"1 234,5"` in French is `1234.5`,
   * Arabic-Indic digits count too. For amount, price and quantity inputs,
   * where the formatted text has to come back as a number.
   *
   * The locale's group separator is skipped, its decimal separator is the
   * decimal, its digits are read, and anything around the number — a currency
   * symbol or code, a percent sign, whitespace — is ignored. A minus sign on
   * either side, or accounting parentheses, makes it negative. One rule
   * beyond the locale: a separator that appears once and is followed by one
   * or two digits is a decimal point (`"1.5"` in German is one and a half),
   * while three digits keep the locale's reading (`"1.500"` is fifteen
   * hundred). Anything else — letters between digits, two decimal points,
   * no digits at all — is `NaN`, never a throw: unparseable input is the
   * normal case for a text field. Compact suffixes (`"1.2K"`) are not read.
   *
   * @example
   * ```ts
   * anyamount.parse("1.999,00", { locale: "de" });   // 1999
   * anyamount.parse("€1,999.00", { locale: "en" });  // 1999
   * anyamount.parse("-1 234,5", { locale: "fr" });   // -1234.5
   * anyamount.parse("١٬٢٣٤٫٥", { locale: "ar-EG" });  // 1234.5
   * anyamount.parse("1.5", { locale: "de" });        // 1.5
   * anyamount.parse("abc", { locale: "en" });        // NaN
   * ```
   *
   * @param text The text as the user wrote it.
   * @param options See {@linkcode ParseOptions}.
   * @returns The number, or `NaN` when the text is not one.
   * @throws {TypeError} If `text` is not a string.
   */
  parse,
});
