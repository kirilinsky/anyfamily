type RelativeUnit = Intl.RelativeTimeFormatUnit;

export type DateInput = Date | number | string;
export type Locale = string | readonly string[];
export type Mode = "smart" | "absolute" | "relative";

export interface AnywhenOptions {
  mode?: Mode;
  locale?: Locale;
  now?: DateInput;
  timeZone?: string;
  time?: boolean;
  numeric?: boolean;
  format?: Intl.DateTimeFormatOptions;
}

const MS_DAY = 864e5;
const MS_YEAR = 315360e5;

const THRESHOLDS: [number, RelativeUnit, number][] = [
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

const rtf = (l: Locale | undefined, n: "always" | "auto") =>
  cacheGet(rtfCache, `${localeKey(l)}|${n}`, () =>
    new Intl.RelativeTimeFormat(l as Intl.LocalesArgument, { numeric: n }),
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

function unit(ms: number): [number, RelativeUnit] {
  const s = Math.abs(ms) / 1000;
  for (const [th, u, div] of THRESHOLDS)
    if (s < th) return [Math.round(ms / div), u];
  return [Math.round(ms / MS_YEAR), "year"];
}

function renderRelative(
  date: Date,
  now: Date,
  locale: Locale | undefined,
  numeric: boolean,
): string {
  const ms = date.getTime() - now.getTime();
  const [v, u] = unit(ms);
  return rtf(locale, numeric ? "always" : "auto").format(v, u);
}

function renderAbsolute(
  date: Date,
  locale: Locale | undefined,
  format: Intl.DateTimeFormatOptions | undefined,
  timeZone: string | undefined,
): string {
  const opts = format ?? DATE_OPTS;
  return dtf(locale, timeZone ? { ...opts, timeZone } : opts).format(date);
}

function renderSmart(
  date: Date,
  now: Date,
  locale: Locale | undefined,
  time: boolean,
  timeZone: string | undefined,
): string {
  const ms = date.getTime() - now.getTime();
  const abs = Math.abs(ms) / 1000;
  const calendarDiff = dayDiff(date, now, timeZone);
  const timeStr = () => dtf(locale, { ...TIME_OPTS, timeZone }).format(date);

  if (abs < 45) return rtf(locale, "auto").format(0, "second");
  if (abs < 3600)
    return rtf(locale, "auto").format(Math.round(ms / 6e4), "minute");

  if (ms > 0) {
    const [v, u] = unit(ms);
    return rtf(locale, "auto").format(v, u);
  }

  if (calendarDiff === 0) {
    const s = rtf(locale, "auto").format(0, "day");
    return time ? `${s}, ${timeStr()}` : s;
  }

  if (calendarDiff === -1) {
    const s = rtf(locale, "auto").format(-1, "day");
    return time ? `${s}, ${timeStr()}` : s;
  }

  if (calendarDiff < -1 && calendarDiff > -7) {
    const w = dtf(locale, { timeZone, weekday: "long" }).format(date);
    return time ? `${w}, ${timeStr()}` : w;
  }

  return dtf(locale, { ...DATE_OPTS, timeZone }).format(date);
}

export function anywhen(input: DateInput, options: AnywhenOptions = {}): string {
  const {
    mode = "smart",
    locale,
    now,
    timeZone,
    time = true,
    numeric = false,
    format,
  } = options;

  const date = toDate(input);
  const anchor = now === undefined ? new Date() : toDate(now);

  if (mode === "relative") return renderRelative(date, anchor, locale, numeric);
  if (mode === "absolute") return renderAbsolute(date, locale, format, timeZone);
  if (mode === "smart") return renderSmart(date, anchor, locale, time, timeZone);

  throw new RangeError(`Invalid mode: ${String(mode)}`);
}
