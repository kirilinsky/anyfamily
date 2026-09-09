type RelativeUnit = Intl.RelativeTimeFormatUnit;

/** Accepted date input: a `Date`, a unix timestamp in milliseconds, or an ISO 8601 string. */
export type DateInput = Date | number | string;

/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * Rendering strategy.
 *
 * - `"smart"` — context-aware: relative when near, calendar labels for nearby days (past and future), absolute when far (default)
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

/** One piece of formatted output returned by {@linkcode anywhen.parts}. */
export interface AnywhenPart {
  /** Part kind as reported by `Intl` — `"integer"`, `"literal"`, `"month"`, `"hour"`, … */
  type: string;
  /** The text of this part. Joining all part values reproduces the full string. */
  value: string;
  /** For relative numeric parts: the unit the number refers to (`"minute"`, `"hour"`, …). */
  unit?: string;
}

/** Options for {@linkcode anywhen} and {@linkcode anywhen.parts}. Each mode reads only the options that apply to it. */
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

/**
 * The fixed `Intl.DateTimeFormat` option sets smart mode uses. Keyed by name
 * in the cache, so the hot path never spreads or stringifies an object.
 */
const PRESETS = {
  date: { day: "numeric", month: "short", year: "numeric" },
  time: { hour: "2-digit", minute: "2-digit" },
  weekday: { weekday: "long" },
  ymd: { day: "numeric", month: "numeric", year: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

type Preset = keyof typeof PRESETS;

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
 * `{ day, month }` and `{ month, day }` share one formatter; `undefined`
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

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
const dtfCache = new Map<string, Intl.DateTimeFormat>();

const rtf = (l: Locale | undefined, numeric: "always" | "auto", style: Style) =>
  cacheGet(rtfCache, `${localeKey(l)}|${numeric}|${style}`, () =>
    new Intl.RelativeTimeFormat(l, { numeric, style }),
  );

/** A formatter for one of the fixed presets, in a time zone. */
const preset = (l: Locale | undefined, p: Preset, timeZone?: string) =>
  cacheGet(dtfCache, `${localeKey(l)}|${p}|${timeZone ?? ""}`, () =>
    new Intl.DateTimeFormat(l, { ...PRESETS[p], timeZone }),
  );

/** A formatter for caller-supplied `Intl.DateTimeFormatOptions`; `timeZone` wins over the object's own. */
const custom = (l: Locale | undefined, o: Intl.DateTimeFormatOptions, timeZone?: string) =>
  cacheGet(dtfCache, `${localeKey(l)}|f|${optKey(o)}|${timeZone ?? ""}`, () =>
    new Intl.DateTimeFormat(l, timeZone ? { ...o, timeZone } : o),
  );

const toDate = (i: DateInput): Date => {
  const d = i instanceof Date ? i : new Date(i);
  if (isNaN(d.getTime())) throw new RangeError(`Invalid date: ${i}`);
  return d;
};

/** Days since the epoch, on the calendar of `timeZone` (or the runtime's when unset). */
function dayIndex(date: Date, timeZone?: string): number {
  let y: number, m: number, d: number;
  if (timeZone) {
    y = m = d = 0;
    for (const p of preset("en-US", "ymd", timeZone).formatToParts(date)) {
      if (p.type === "year") y = +p.value;
      else if (p.type === "month") m = +p.value - 1;
      else if (p.type === "day") d = +p.value;
    }
  } else {
    y = date.getFullYear();
    m = date.getMonth();
    d = date.getDate();
  }
  return Math.floor(Date.UTC(y, m, d) / MS_DAY);
}

/** Rounds half away from zero, so `-1.5` is `-2` like `1.5` is `2`. */
const round = (n: number) => Math.sign(n) * Math.round(Math.abs(n));

function unit(ms: number, t?: Thresholds): [number, RelativeUnit] {
  const s = Math.abs(ms) / 1000;
  for (const [th, u, div] of THRESHOLDS)
    if (s < (t?.[u] ?? th)) return [round(ms / div), u];
  return [round(ms / MS_YEAR), "year"];
}

/** One piece of planned output: a relative phrase, a date-time render, or a literal. */
type Seg =
  | { f: Intl.RelativeTimeFormat; v: number; u: RelativeUnit }
  | { f: Intl.DateTimeFormat; d: Date }
  | { t: string };

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
    time ? [...segs, { t: ", " }, { f: preset(locale, "time", timeZone), d: date }] : segs;

  if (abs < (t?.second ?? 45)) return rel(0, "second");
  if (abs < (t?.minute ?? 3600)) {
    const m = round(ms / 6e4);
    if (Math.abs(m) < 60) return rel(m, "minute");
  }

  const days = dayIndex(date, timeZone) - dayIndex(now, timeZone);

  if (days >= -1 && days <= 1) return withTime(rel(days, "day"));
  if (days > -7 && days < 7)
    return withTime([{ f: preset(locale, "weekday", timeZone), d: date }]);

  return [{ f: preset(locale, "date", timeZone), d: date }];
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

  if (mode === "absolute")
    return [{ f: format ? custom(locale, format, timeZone) : preset(locale, "date", timeZone), d: date }];
  if (mode === "relative") {
    const [v, u] = unit(date.getTime() - anchor.getTime(), thresholds);
    return [{ f: rtf(locale, numeric ? "always" : "auto", style), v, u }];
  }
  if (mode === "smart")
    return smartSegs(date, anchor, locale, time, timeZone, style, thresholds);

  throw new RangeError(`Invalid mode: ${String(mode)}`);
}

function format(input: DateInput, options: AnywhenOptions = {}): string {
  let out = "";
  for (const s of plan(input, options))
    out += "t" in s ? s.t : "d" in s ? s.f.format(s.d) : s.f.format(s.v, s.u);
  return out;
}

function parts(input: DateInput, options: AnywhenOptions = {}): AnywhenPart[] {
  return plan(input, options).flatMap((s) =>
    "t" in s
      ? { type: "literal", value: s.t }
      : "d" in s
        ? s.f.formatToParts(s.d)
        : s.f.formatToParts(s.v, s.u),
  );
}

/**
 * Formats a date as a human-readable, localized string using native `Intl`.
 *
 * The package exports this one name. Anything beyond the plain call hangs off
 * it — currently {@linkcode anywhen.parts}.
 *
 * @example
 * ```ts
 * anywhen(date);                                    // "yesterday, 2:35 PM"
 * anywhen(date, { mode: "absolute", locale: "ja" }); // "2016年2月5日"
 * anywhen(date, { mode: "relative", locale: "en" }); // "3 hours ago"
 *
 * anywhen.parts(date, { mode: "relative", locale: "en" });
 * // [
 * //   { type: "integer", value: "3", unit: "hour" },
 * //   { type: "literal", value: " hours ago" },
 * // ]
 * ```
 *
 * @param input A `Date`, unix timestamp in milliseconds, or ISO 8601 string.
 * @param options See {@linkcode AnywhenOptions}.
 * @returns The formatted string.
 * @throws {RangeError} If `input` or `options.now` is not a valid date, or `options.mode` is unknown.
 */
export const anywhen = Object.assign(format, {
  /**
   * Like calling {@linkcode anywhen} directly, but returns the output as
   * `{ type, value, unit? }` parts instead of a string — style the number
   * apart from the unit, or rebuild the output your own way.
   *
   * Takes the same arguments and throws on the same inputs.
   *
   * @example
   * ```ts
   * anywhen.parts(date, { mode: "relative", locale: "en" });
   * // [
   * //   { type: "integer", value: "3", unit: "hour" },
   * //   { type: "literal", value: " hours ago" },
   * // ]
   *
   * // React: bold the number
   * anywhen.parts(date, { mode: "relative" }).map((p, i) =>
   *   p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
   * );
   * ```
   */
  parts,
});
