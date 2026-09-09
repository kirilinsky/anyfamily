/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

type BaseUnitStyle = "long" | "short" | "narrow";
type TimeUnitStyle = BaseUnitStyle | "numeric" | "2-digit";
type SubSecondStyle = BaseUnitStyle | "numeric";
type UnitDisplay = "always" | "auto";

/**
 * Native `Intl.DurationFormat` constructor options, per ECMA-402.
 * TypeScript does not ship these yet, so anylong declares them locally —
 * no global `Intl` augmentation leaks into your project.
 */
export interface DurationFormatOptions {
  localeMatcher?: "lookup" | "best fit";
  numberingSystem?: string;
  /** Overall output style: `"2 hours, 30 minutes"` / `"2 hr, 30 min"` / `"2h 30m"` / `"2:30:00"`. */
  style?: "long" | "short" | "narrow" | "digital";
  years?: BaseUnitStyle;
  yearsDisplay?: UnitDisplay;
  months?: BaseUnitStyle;
  monthsDisplay?: UnitDisplay;
  weeks?: BaseUnitStyle;
  weeksDisplay?: UnitDisplay;
  days?: BaseUnitStyle;
  daysDisplay?: UnitDisplay;
  hours?: TimeUnitStyle;
  hoursDisplay?: UnitDisplay;
  minutes?: TimeUnitStyle;
  minutesDisplay?: UnitDisplay;
  seconds?: TimeUnitStyle;
  secondsDisplay?: UnitDisplay;
  milliseconds?: SubSecondStyle;
  millisecondsDisplay?: UnitDisplay;
  microseconds?: SubSecondStyle;
  microsecondsDisplay?: UnitDisplay;
  nanoseconds?: SubSecondStyle;
  nanosecondsDisplay?: UnitDisplay;
  fractionalDigits?: number;
}

/**
 * An `Intl.DurationFormat` duration record. All values must be non-negative integers.
 * Not normalized — `{ minutes: 120 }` is passed through as-is, it is not folded into
 * `{ hours: 2 }`. Only number/Date/ISO/shorthand inputs get decomposed; a record you
 * pass in comes back out exactly as given.
 */
export interface DurationRecord {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

/**
 * Accepted duration input:
 *
 * - `Date` — duration between that date and now (absolute value)
 * - `number` — milliseconds, or seconds with `{ unit: "s" }`
 * - `string` — ISO 8601 (`"PT2H30M"`) or shorthand (`"2h 30m"`, `"2 hours 30 minutes"`).
 *   Colon notation (`"1:30"`) is rejected — it's ambiguous between hours:minutes
 *   and minutes:seconds, so it intentionally throws instead of guessing.
 * - `DurationRecord` — passed through to `Intl.DurationFormat`
 */
export type DurationInput = Date | number | string | DurationRecord;

/** Units available for decomposition clamping via `largestUnit` / `smallestUnit`. */
export type DecomposeUnit =
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds";

/**
 * Options for {@linkcode anylong} and {@linkcode anylong.parts}. Everything in
 * {@linkcode DurationFormatOptions} passes straight through to `Intl.DurationFormat`.
 */
export interface AnylongOptions extends DurationFormatOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** How to read a bare `number` input: milliseconds or seconds. Defaults to `"ms"`. */
  unit?: "ms" | "s";
  /** Largest unit produced when decomposing elapsed time (number and Date inputs). Defaults to `"days"`. */
  largestUnit?: DecomposeUnit;
  /** Smallest unit produced when decomposing elapsed time; the value is rounded here. Defaults to `"milliseconds"`. */
  smallestUnit?: DecomposeUnit;
}

/** One piece of formatted output returned by {@linkcode anylong.parts}. */
export interface AnylongPart {
  /** Part kind as reported by `Intl` — `"integer"`, `"literal"`, `"unit"`, … */
  type: string;
  /** The text of this part. Joining all part values reproduces the full string. */
  value: string;
  /** The unit this part belongs to (`"hour"`, `"minute"`, …), when `Intl` reports one. */
  unit?: string;
}

interface DurationFormat {
  format(duration: DurationRecord): string;
  formatToParts(duration: DurationRecord): AnylongPart[];
}

interface DurationFormatCtor {
  new (locales?: Locale, options?: DurationFormatOptions): DurationFormat;
}

const DF = (Intl as { DurationFormat?: DurationFormatCtor }).DurationFormat;

/** `true` when the runtime provides `Intl.DurationFormat` (Baseline 2025). */
const supported: boolean = typeof DF === "function";

const ACCEPTED =
  'a Date, two Dates, a non-negative number (milliseconds, or seconds with { unit: "s" }), ' +
  'an ISO 8601 duration ("PT2H30M"), a shorthand string ("2h 30m", "2 hours 30 minutes"), ' +
  "or a duration object ({ hours: 2, minutes: 30 })";

const RECORD_KEYS = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
  "microseconds",
  "nanoseconds",
] as const;

const UNIT_MS: Record<DecomposeUnit, number> = {
  weeks: 6048e5,
  days: 864e5,
  hours: 36e5,
  minutes: 6e4,
  seconds: 1e3,
  milliseconds: 1,
};

const DECOMPOSE_ORDER: DecomposeUnit[] = [
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
];

/**
 * Shorthand unit spellings, singular. A trailing `s` is stripped before the
 * second lookup, so `hrs`, `mins`, `secs`, `months` all resolve too; `ms` and
 * `s` match directly, before any stripping.
 */
const UNIT_ALIASES: Record<string, keyof DurationRecord> = {
  y: "years",
  yr: "years",
  year: "years",
  mo: "months",
  month: "months",
  w: "weeks",
  wk: "weeks",
  week: "weeks",
  d: "days",
  day: "days",
  h: "hours",
  hr: "hours",
  hour: "hours",
  m: "minutes",
  min: "minutes",
  minute: "minutes",
  s: "seconds",
  sec: "seconds",
  second: "seconds",
  ms: "milliseconds",
  msec: "milliseconds",
  millisecond: "milliseconds",
};

const unitOf = (token: string): keyof DurationRecord | undefined =>
  UNIT_ALIASES[token] ?? (token.endsWith("s") ? UNIT_ALIASES[token.slice(0, -1)] : undefined);

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

/**
 * Cache key for a caller-supplied options object. Keys are sorted, so
 * `{ style, hours }` and `{ hours, style }` share one formatter; `undefined`
 * values are skipped, as `Intl` skips them.
 */
function optKey(o: object): string {
  const r = o as Record<string, unknown>;
  let k = "";
  for (const name of Object.keys(r).sort()) {
    const v = r[name];
    if (v !== undefined) k += `${name}=${v};`;
  }
  return k;
}

const dfCache = new Map<string, DurationFormat>();

function formatter(locale: Locale | undefined, opts: DurationFormatOptions): DurationFormat {
  if (!DF)
    throw new Error(
      "Intl.DurationFormat is not available in this runtime. It requires Node.js 23+, " +
        "Chrome 129+, Firefox 132+, Safari 16.4+ (Baseline 2025), or a polyfill. " +
        "Check the `anylong.supported` flag before calling anylong.",
    );
  return cacheGet(dfCache, `${localeKey(locale)}|${optKey(opts)}`, () => new DF(locale, opts));
}

function decompose(
  totalMs: number,
  largestUnit: DecomposeUnit = "days",
  smallestUnit?: DecomposeUnit,
): DurationRecord {
  const smallest = smallestUnit ?? "milliseconds";
  const li = DECOMPOSE_ORDER.indexOf(largestUnit);
  const si = DECOMPOSE_ORDER.indexOf(smallest);
  if (li > si)
    throw new RangeError(
      `largestUnit "${largestUnit}" is smaller than smallestUnit "${smallest}".`,
    );

  let rem = Math.round(totalMs / UNIT_MS[smallest]) * UNIT_MS[smallest];
  // Nothing left after rounding: render a single zero in the requested unit,
  // or in seconds when none was asked for ("0 sec" reads better than "0 ms").
  if (rem === 0) return { [smallestUnit ?? "seconds"]: 0 };

  const record: DurationRecord = {};
  for (let i = li; i <= si; i++) {
    const u = DECOMPOSE_ORDER[i];
    const v = Math.floor(rem / UNIT_MS[u]);
    if (v > 0) {
      record[u] = v;
      rem -= v * UNIT_MS[u];
    }
  }
  return record;
}

const ISO_RE =
  /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/i;

function parseIso(s: string): DurationRecord {
  if (/^[+-]/.test(s))
    throw new RangeError(
      `Signed ISO 8601 durations are not supported: "${s}". Pass the absolute value.`,
    );
  const m = ISO_RE.exec(s);
  if (!m)
    throw new RangeError(
      `Cannot parse ISO 8601 duration "${s}". Expected forms like "PT2H30M", "P1DT4H", "P3W" ` +
        "(integer components; a fraction is allowed in seconds only).",
    );
  const [, y, mo, w, d, h, min, sec] = m;
  if ([y, mo, w, d, h, min, sec].every((v) => v === undefined))
    throw new RangeError(
      `ISO 8601 duration "${s}" has no components. Expected at least one, e.g. "PT30M".`,
    );

  const rec: DurationRecord = {};
  if (y !== undefined) rec.years = +y;
  if (mo !== undefined) rec.months = +mo;
  if (w !== undefined) rec.weeks = +w;
  if (d !== undefined) rec.days = +d;
  if (h !== undefined) rec.hours = +h;
  if (min !== undefined) rec.minutes = +min;
  if (sec !== undefined) {
    const v = Number(sec.replace(",", "."));
    let whole = Math.trunc(v);
    let ms = Math.round((v % 1) * 1000);
    // Rounding a fraction like .9995 can carry a full second (ms === 1000).
    if (ms === 1000) {
      whole += 1;
      ms = 0;
    }
    rec.seconds = whole;
    if (ms > 0) rec.milliseconds = ms;
  }
  return rec;
}

function parseShorthand(s: string): DurationRecord {
  if (/\d[.,]\d/.test(s))
    throw new RangeError(
      `Fractional values are not supported in shorthand: "${s}". ` +
        'Use ISO 8601 ("PT1.5S"), milliseconds, or a smaller unit ("90m" instead of "1.5h").',
    );

  const rec: DurationRecord = {};
  let rest = s.toLowerCase().replace(/,/g, " ").trim();
  const token = /^(\d+)\s*([a-z]+)\s*/;

  while (rest) {
    const m = token.exec(rest);
    if (!m)
      throw new RangeError(
        `Cannot parse duration string "${s}". Accepted string forms: ` +
          'ISO 8601 ("PT2H30M", "P1DT4H") or shorthand ("2h 30m", "90s", "2 hours 30 minutes").',
      );
    const unit = unitOf(m[2]);
    if (!unit)
      throw new RangeError(
        `Unknown unit "${m[2]}" in "${s}". Known units: y, mo, w, d, h, m, s, ms ` +
          'and their English words ("hours", "minutes", …).',
      );
    if (unit in rec)
      throw new RangeError(`Unit "${unit}" appears more than once in "${s}".`);
    rec[unit] = +m[1];
    rest = rest.slice(m[0].length);
  }
  return rec;
}

function parseString(s: string): DurationRecord {
  const trimmed = s.trim();
  if (!trimmed)
    throw new RangeError(`Cannot parse an empty string as a duration. Accepted inputs: ${ACCEPTED}.`);
  if (trimmed.includes(":"))
    throw new RangeError(
      `"${trimmed}" is ambiguous — colon notation could mean hours:minutes or minutes:seconds, ` +
        'so anylong refuses to guess. Use "1h 30m", "PT1H30M", or { hours: 1, minutes: 30 } instead.',
    );
  if (/^[+-]?p/i.test(trimmed)) return parseIso(trimmed);
  return parseShorthand(trimmed);
}

function fromRecord(input: Record<string, unknown>): DurationRecord {
  const rec: DurationRecord = {};
  for (const k of Object.keys(input)) {
    const v = input[k];
    if (v === undefined) continue;
    if (!(RECORD_KEYS as readonly string[]).includes(k))
      throw new TypeError(
        `Unknown duration key "${k}". Accepted keys: ${RECORD_KEYS.join(", ")}.`,
      );
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0)
      throw new RangeError(
        `Invalid value for "${k}": ${String(v)}. Duration values must be non-negative integers.`,
      );
    rec[k as keyof DurationRecord] = v;
  }
  if (Object.keys(rec).length === 0)
    throw new TypeError(
      "Empty duration object. Provide at least one unit, e.g. { hours: 2, minutes: 30 }.",
    );
  return rec;
}

function toTime(d: Date): number {
  const t = d.getTime();
  if (Number.isNaN(t)) throw new RangeError(`Invalid Date: ${String(d)}.`);
  return t;
}

function fromNumber(
  n: number,
  unit: "ms" | "s" | undefined,
  largestUnit?: DecomposeUnit,
  smallestUnit?: DecomposeUnit,
): DurationRecord {
  if (Number.isNaN(n)) throw new RangeError(`Invalid duration: NaN. Accepted inputs: ${ACCEPTED}.`);
  if (!Number.isFinite(n))
    throw new RangeError(`Invalid duration: ${n}. Accepted inputs: ${ACCEPTED}.`);
  if (n < 0)
    throw new RangeError(
      `Negative durations are not supported: ${n}. Pass the absolute value, ` +
        "or pass two Dates — anylong(dateA, dateB) — which is order-independent.",
    );
  return decompose(unit === "s" ? n * 1000 : n, largestUnit, smallestUnit);
}

function toRecord(
  input: DurationInput,
  unit: "ms" | "s" | undefined,
  largestUnit?: DecomposeUnit,
  smallestUnit?: DecomposeUnit,
): DurationRecord {
  if (input instanceof Date)
    return decompose(Math.abs(Date.now() - toTime(input)), largestUnit, smallestUnit);
  if (typeof input === "number") return fromNumber(input, unit, largestUnit, smallestUnit);
  if (typeof input === "string") return parseString(input);
  if (typeof input === "object" && input !== null && !Array.isArray(input))
    return fromRecord(input as Record<string, unknown>);
  throw new TypeError(
    `Cannot interpret ${input === null ? "null" : typeof input} as a duration. Accepted inputs: ${ACCEPTED}.`,
  );
}

function prepare(
  input: DurationInput,
  b?: Date | AnylongOptions,
  c?: AnylongOptions,
): { record: DurationRecord; locale?: Locale; opts: DurationFormatOptions } {
  const twoDates = b instanceof Date;
  if (!twoDates && c !== undefined)
    throw new TypeError(
      "A third argument is only allowed in the two-date form: anylong(dateA, dateB, options).",
    );

  // anylong's own options come off here; everything left goes to Intl.DurationFormat.
  const { locale, unit, largestUnit, smallestUnit, style = "short", ...intl } =
    (twoDates ? c : b) ?? {};
  const opts: DurationFormatOptions = { style, ...intl };

  let record: DurationRecord;
  if (twoDates) {
    if (!(input instanceof Date))
      throw new TypeError(
        `The two-argument date form needs two Dates; the first argument is ${typeof input}.`,
      );
    record = decompose(Math.abs(toTime(input) - toTime(b)), largestUnit, smallestUnit);
  } else {
    record = toRecord(input, unit, largestUnit, smallestUnit);
  }

  // The default "auto" unit display hides zero-valued units, so an all-zero
  // record would render as "" — force its units visible instead.
  const keys = Object.keys(record) as (keyof DurationRecord)[];
  if (keys.every((k) => record[k] === 0))
    for (const k of keys) (opts as Record<string, unknown>)[`${k}Display`] ??= "always";

  return { record, locale, opts };
}

function format(input: DurationInput, options?: AnylongOptions): string;
function format(dateA: Date, dateB: Date, options?: AnylongOptions): string;
function format(input: DurationInput, b?: Date | AnylongOptions, c?: AnylongOptions): string {
  const { record, locale, opts } = prepare(input, b, c);
  return formatter(locale, opts).format(record);
}

function parts(input: DurationInput, options?: AnylongOptions): AnylongPart[];
function parts(dateA: Date, dateB: Date, options?: AnylongOptions): AnylongPart[];
function parts(input: DurationInput, b?: Date | AnylongOptions, c?: AnylongOptions): AnylongPart[] {
  const { record, locale, opts } = prepare(input, b, c);
  return formatter(locale, opts).formatToParts(record);
}

/**
 * Formats any reasonable representation of a duration as a localized string
 * using native `Intl.DurationFormat`. Input detection is deterministic —
 * ambiguous input (like `"1:30"`) throws instead of guessing.
 *
 * The package exports this one name. Anything beyond the plain call hangs off
 * it: {@linkcode anylong.parts} and {@linkcode anylong.supported}.
 *
 * @example
 * ```ts
 * anylong(9_000_000);                          // "2 hr, 30 min"
 * anylong("PT2H30M", { locale: "ru" });        // "2 ч 30 мин"
 * anylong("2 hours 30 minutes", { style: "long" }); // "2 hours, 30 minutes"
 * anylong({ hours: 2, minutes: 30 }, { style: "digital" }); // "2:30:00"
 * anylong(startedAt, finishedAt);              // duration between two Dates
 * ```
 *
 * @param input A `Date`, a number, an ISO 8601 or shorthand string, or a duration record — see {@linkcode DurationInput}.
 * @param b The second `Date` of the two-date form, or {@linkcode AnylongOptions}.
 * @param c Options for the two-date form.
 * @returns The formatted string.
 * @throws {TypeError | RangeError} On ambiguous, negative, or unparseable input — the message states what was received and what is accepted.
 * @throws {Error} If `Intl.DurationFormat` is unavailable in the runtime (check {@linkcode anylong.supported}).
 */
export const anylong = Object.assign(format, {
  /**
   * Like calling {@linkcode anylong} directly, but returns the output as
   * `{ type, value, unit? }` parts instead of a string — style the numbers
   * apart from the units, or rebuild the output your own way.
   *
   * Takes the same arguments, including the two-date form.
   *
   * @example
   * ```ts
   * anylong.parts("2h 30m", { locale: "en" });
   * // [
   * //   { type: "integer", value: "2", unit: "hour" }, ...
   * // ]
   * ```
   */
  parts,

  /**
   * Whether the runtime provides `Intl.DurationFormat` (Baseline 2025). `false`
   * on Node 22 and older engines, where every anylong call throws — branch on
   * this if you target them.
   *
   * @example
   * ```ts
   * anylong.supported ? anylong(ms) : `${Math.round(ms / 60000)} min`;
   * ```
   */
  supported,
});
