type RelativeUnit = Intl.RelativeTimeFormatUnit;

/** Accepted date input: a `Date`, a unix timestamp in milliseconds, or an ISO 8601 string. */
export type DateInput = Date | number | string;

/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * Rendering strategy.
 *
 * - `"smart"` — context-aware: relative when near, calendar labels for recent days, absolute when far (default)
 * - `"absolute"` — plain `Intl.DateTimeFormat` output
 * - `"relative"` — always relative, past and future
 */
export type Mode = "smart" | "absolute" | "relative";

/** Relative-time wording length, mapped to `Intl.RelativeTimeFormat`: `"3 hours ago"` / `"3 hr. ago"` / `"3h ago"`. */
export type Style = Intl.RelativeTimeFormatStyle;

/** Units whose selection cutoff can be overridden via {@linkcode Thresholds}. */
export type ThresholdUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month";

/**
 * Per-unit cutoffs, in seconds, for picking the display unit in smart and
 * relative modes. Each unit is shown while the distance from `now` is below
 * its cutoff. Override any subset — the rest keep their defaults:
 * `{ second: 45, minute: 2700, hour: 79200, day: 518400, week: 2160000, month: 28512000 }`.
 *
 * @example
 * ```ts
 * anywhen(date, { mode: "relative", thresholds: { minute: 5400 } });
 * // 50 minutes ago → "50 minutes ago" instead of "1 hour ago"
 * ```
 */
export type Thresholds = Partial<Record<ThresholdUnit, number>>;

/** One piece of formatted output returned by {@linkcode anywhenParts}. */
export interface AnywhenPart {
  /** Part kind as reported by `Intl` — `"integer"`, `"literal"`, `"month"`, `"hour"`, … */
  type: string;
  /** The text of this part. Joining all part values reproduces the full string. */
  value: string;
  /** For relative numeric parts: the unit the number refers to (`"minute"`, `"hour"`, …). */
  unit?: string;
}

/** Options for {@linkcode anywhen} and {@linkcode anywhenParts}. Each mode reads only the options that apply to it. */
export interface AnywhenOptions {
  /** Rendering strategy. Defaults to `"smart"`. */
  mode?: Mode;
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** Reference time for smart and relative modes. Pass a fixed value in SSR to keep server and client output stable. Defaults to the current time. */
  now?: DateInput;
  /** IANA time zone for the displayed clock and smart calendar boundaries (today, yesterday, weekday). Smart and absolute modes. Defaults to the runtime time zone. */
  timeZone?: string;
  /** Smart mode: include the clock in today/yesterday/weekday output. Defaults to `true`. */
  time?: boolean;
  /** Relative mode: force numeric output, disabling auto-phrases like `"yesterday"`. Defaults to `false`. */
  numeric?: boolean;
  /** Relative wording length for smart and relative modes. Defaults to `"long"`. */
  style?: Style;
  /** Absolute mode: any `Intl.DateTimeFormatOptions`. Defaults to a short date (`{ day, month, year }`). */
  format?: Intl.DateTimeFormatOptions;
  /** Smart and relative modes: per-unit cutoff overrides in seconds. */
  thresholds?: Thresholds;
}

const MS_DAY = 864e5;
const MS_YEAR = 315360e5;

const THRESHOLDS: [number, ThresholdUnit, number][] = [
  [45, "second", 1e3],
  [2700, "minute", 6e4],
  [79200, "hour", 36e5],
  [518400, "day", MS_DAY],
  [2160000, "week", 6048e5],
  [28512000, "month", 2592e6],
];

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};
const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const CACHE_LIMIT = 50;

function cacheGet<V>(cache: Map<string, V>, k: string, create: () => V): V {
  const hit = cache.get(k);
  if (hit) return hit;
  const v = create();
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(k, v);
  return v;
}

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
const dtfCache = new Map<string, Intl.DateTimeFormat>();

const localeKey = (locale?: Locale) =>
  Array.isArray(locale) ? locale.join("\0") : (locale ?? "");

const rtf = (l: Locale | undefined, n: "always" | "auto", s: Style) =>
  cacheGet(rtfCache, `${localeKey(l)}|${n}|${s}`, () =>
    new Intl.RelativeTimeFormat(l as Intl.LocalesArgument, {
      numeric: n,
      style: s,
    }),
  );

const dtf = (l: Locale | undefined, o: Intl.DateTimeFormatOptions) =>
  cacheGet(dtfCache, `${localeKey(l)}|${JSON.stringify(o)}`, () =>
    new Intl.DateTimeFormat(l as Intl.LocalesArgument, o),
  );

const toDate = (i: DateInput): Date => {
  const d = i instanceof Date ? i : new Date(i);
  if (isNaN(d.getTime())) throw new RangeError(`Invalid date: ${i}`);
  return d;
};

function dayParts(date: Date, timeZone?: string): [number, number, number] {
  if (!timeZone) return [date.getFullYear(), date.getMonth(), date.getDate()];

  const parts = dtf("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone,
    year: "numeric",
  }).formatToParts(date);

  return [
    Number(parts.find((p) => p.type === "year")?.value),
    Number(parts.find((p) => p.type === "month")?.value) - 1,
    Number(parts.find((p) => p.type === "day")?.value),
  ];
}

const dayIndex = (date: Date, timeZone?: string) => {
  const [year, month, day] = dayParts(date, timeZone);
  return Math.floor(Date.UTC(year, month, day) / MS_DAY);
};

const dayDiff = (date: Date, now: Date, timeZone?: string) =>
  dayIndex(date, timeZone) - dayIndex(now, timeZone);

const round = (n: number) => Math.sign(n) * Math.round(Math.abs(n));

function unit(ms: number, t?: Thresholds): [number, RelativeUnit] {
  const s = Math.abs(ms) / 1000;
  for (const [th, u, div] of THRESHOLDS)
    if (s < (t?.[u] ?? th)) return [round(ms / div), u];
  return [round(ms / MS_YEAR), "year"];
}

type Seg =
  | { f: Intl.RelativeTimeFormat; v: number; u: RelativeUnit }
  | { f: Intl.DateTimeFormat; d: Date }
  | { t: string };

function relativeSegs(
  date: Date,
  now: Date,
  locale: Locale | undefined,
  numeric: boolean,
  style: Style,
  t?: Thresholds,
): Seg[] {
  const ms = date.getTime() - now.getTime();
  const [v, u] = unit(ms, t);
  return [{ f: rtf(locale, numeric ? "always" : "auto", style), v, u }];
}

function absoluteSegs(
  date: Date,
  locale: Locale | undefined,
  format: Intl.DateTimeFormatOptions | undefined,
  timeZone: string | undefined,
): Seg[] {
  const opts = format ?? DATE_OPTS;
  return [{ f: dtf(locale, timeZone ? { ...opts, timeZone } : opts), d: date }];
}

function smartSegs(
  date: Date,
  now: Date,
  locale: Locale | undefined,
  time: boolean,
  timeZone: string | undefined,
  style: Style,
  t?: Thresholds,
): Seg[] {
  const ms = date.getTime() - now.getTime();
  const abs = Math.abs(ms) / 1000;
  const rel = (v: number, u: RelativeUnit): Seg[] => [
    { f: rtf(locale, "auto", style), v, u },
  ];
  const withTime = (segs: Seg[]): Seg[] =>
    time
      ? [
          ...segs,
          { t: ", " },
          { f: dtf(locale, { ...TIME_OPTS, timeZone }), d: date },
        ]
      : segs;

  if (abs < (t?.second ?? 45)) return rel(0, "second");
  if (abs < 3600) {
    const m = round(ms / 6e4);
    if (Math.abs(m) < 60) return rel(m, "minute");
  }

  if (ms > 0) {
    const [v, u] = unit(ms, t);
    return rel(v, u);
  }

  const calendarDiff = dayDiff(date, now, timeZone);

  if (calendarDiff === 0) return withTime(rel(0, "day"));
  if (calendarDiff === -1) return withTime(rel(-1, "day"));
  if (calendarDiff < -1 && calendarDiff > -7)
    return withTime([{ f: dtf(locale, { timeZone, weekday: "long" }), d: date }]);

  return [{ f: dtf(locale, { ...DATE_OPTS, timeZone }), d: date }];
}

function plan(input: DateInput, options: AnywhenOptions): Seg[] {
  const {
    mode = "smart",
    locale,
    now,
    timeZone,
    time = true,
    numeric = false,
    style = "long",
    format,
    thresholds,
  } = options;

  const date = toDate(input);
  const anchor = now === undefined ? new Date() : toDate(now);

  if (mode === "relative")
    return relativeSegs(date, anchor, locale, numeric, style, thresholds);
  if (mode === "absolute") return absoluteSegs(date, locale, format, timeZone);
  if (mode === "smart")
    return smartSegs(date, anchor, locale, time, timeZone, style, thresholds);

  throw new RangeError(`Invalid mode: ${String(mode)}`);
}

/**
 * Formats a date as a human-readable, localized string using native `Intl`.
 *
 * @example
 * ```ts
 * anywhen(date);                                    // "yesterday, 2:35 PM"
 * anywhen(date, { mode: "absolute", locale: "ja" }); // "2016年2月5日"
 * anywhen(date, { mode: "relative", locale: "en" }); // "3 hours ago"
 * ```
 *
 * @param input A `Date`, unix timestamp in milliseconds, or ISO 8601 string.
 * @param options See {@linkcode AnywhenOptions}.
 * @returns The formatted string.
 * @throws {RangeError} If `input` or `options.now` is not a valid date, or `options.mode` is unknown.
 */
export function anywhen(input: DateInput, options: AnywhenOptions = {}): string {
  return plan(input, options)
    .map((s) => ("t" in s ? s.t : "d" in s ? s.f.format(s.d) : s.f.format(s.v, s.u)))
    .join("");
}

/**
 * Like {@linkcode anywhen}, but returns the output as `{ type, value, unit? }`
 * parts instead of a string — style the number apart from the unit, or
 * rebuild the output your own way.
 *
 * @example
 * ```ts
 * anywhenParts(date, { mode: "relative", locale: "en" });
 * // [
 * //   { type: "integer", value: "3", unit: "hour" },
 * //   { type: "literal", value: " hours ago" },
 * // ]
 * ```
 *
 * @param input A `Date`, unix timestamp in milliseconds, or ISO 8601 string.
 * @param options See {@linkcode AnywhenOptions} — same options as {@linkcode anywhen}.
 * @returns The formatted output as an array of parts.
 * @throws {RangeError} If `input` or `options.now` is not a valid date, or `options.mode` is unknown.
 */
export function anywhenParts(
  input: DateInput,
  options: AnywhenOptions = {},
): AnywhenPart[] {
  return plan(input, options).flatMap((s) =>
    "t" in s
      ? { type: "literal", value: s.t }
      : "d" in s
        ? s.f.formatToParts(s.d)
        : s.f.formatToParts(s.v, s.u),
  );
}
