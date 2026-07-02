type RelativeUnit = Intl.RelativeTimeFormatUnit;

export type DateInput = Date | number | string;
export type Locale = string | readonly string[];
export type Mode = "smart" | "absolute" | "relative";
export type Style = Intl.RelativeTimeFormatStyle;
export type ThresholdUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month";
export type Thresholds = Partial<Record<ThresholdUnit, number>>;

export interface AnywhenPart {
  type: string;
  value: string;
  unit?: string;
}

export interface AnywhenOptions {
  mode?: Mode;
  locale?: Locale;
  now?: DateInput;
  timeZone?: string;
  time?: boolean;
  numeric?: boolean;
  style?: Style;
  format?: Intl.DateTimeFormatOptions;
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

export function anywhen(input: DateInput, options: AnywhenOptions = {}): string {
  return plan(input, options)
    .map((s) => ("t" in s ? s.t : "d" in s ? s.f.format(s.d) : s.f.format(s.v, s.u)))
    .join("");
}

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
