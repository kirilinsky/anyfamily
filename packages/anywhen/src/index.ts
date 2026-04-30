type RelativeUnit = Intl.RelativeTimeFormatUnit;
export type DateInput = Date | number | string;
export type LocaleInput = string | readonly string[];

export interface AnyagoOptions {
  locale?: LocaleInput;
  now?: DateInput;
  numeric?: boolean;
}

export interface AnydateOptions extends Intl.DateTimeFormatOptions {
  locale?: LocaleInput;
}

export interface AnywhenOptions {
  locale?: LocaleInput;
  now?: DateInput;
  time?: boolean;
  timeZone?: string;
}

export interface AnywhereInstance {
  anyago(
    input: DateInput,
    options?: boolean | Omit<AnyagoOptions, "locale">,
  ): string;
  anydate(input: DateInput, options?: Intl.DateTimeFormatOptions): string;
  anywhen(
    input: DateInput,
    options?: boolean | Omit<AnywhenOptions, "locale">,
  ): string;
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

const localeKey = (locale?: LocaleInput) =>
  Array.isArray(locale) ? locale.join("\0") : (locale ?? "");

const rtf = (l: LocaleInput | undefined, n: "always" | "auto") =>
  cacheGet(rtfCache, `${localeKey(l)}|${n}`, () =>
    new Intl.RelativeTimeFormat(l as Intl.LocalesArgument, { numeric: n }),
  );

const dtf = (l: LocaleInput | undefined, o: Intl.DateTimeFormatOptions) =>
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

const sameDay = (a: Date, b: Date, timeZone?: string) => {
  const [ay, am, ad] = dayParts(a, timeZone);
  const [by, bm, bd] = dayParts(b, timeZone);
  return ay === by && am === bm && ad === bd;
};

function unit(ms: number): [number, RelativeUnit] {
  const s = Math.abs(ms) / 1000;
  for (const [th, u, div] of THRESHOLDS)
    if (s < th) return [Math.round(ms / div), u];
  return [Math.round(ms / MS_YEAR), "year"];
}

const isLocaleInput = (value: unknown): value is LocaleInput =>
  typeof value === "string" || Array.isArray(value);

function resolveAnyagoArgs(
  localeOrOptions?: LocaleInput | boolean | AnyagoOptions,
  numeric = false,
): [LocaleInput | undefined, boolean, Date | undefined] {
  if (typeof localeOrOptions === "boolean")
    return [undefined, localeOrOptions, undefined];
  if (isLocaleInput(localeOrOptions))
    return [localeOrOptions, numeric, undefined];
  return [
    localeOrOptions?.locale,
    localeOrOptions?.numeric ?? numeric,
    localeOrOptions?.now === undefined ? undefined : toDate(localeOrOptions.now),
  ];
}

function resolveAnydateArgs(
  localeOrOptions?: LocaleInput | AnydateOptions,
  options?: Intl.DateTimeFormatOptions,
): [LocaleInput | undefined, Intl.DateTimeFormatOptions] {
  if (isLocaleInput(localeOrOptions))
    return [localeOrOptions, options ?? DATE_OPTS];
  if (!localeOrOptions) return [undefined, options ?? DATE_OPTS];

  const { locale, ...dateOptions } = localeOrOptions;
  return [
    locale,
    Object.keys(dateOptions).length > 0 ? dateOptions : options ?? DATE_OPTS,
  ];
}

function resolveAnywhenArgs(
  localeOrOptions?: LocaleInput | boolean | AnywhenOptions,
  time = true,
): [LocaleInput | undefined, boolean, Date | undefined, string | undefined] {
  if (typeof localeOrOptions === "boolean")
    return [undefined, localeOrOptions, undefined, undefined];
  if (isLocaleInput(localeOrOptions))
    return [localeOrOptions, time, undefined, undefined];
  return [
    localeOrOptions?.locale,
    localeOrOptions?.time ?? time,
    localeOrOptions?.now === undefined ? undefined : toDate(localeOrOptions.now),
    localeOrOptions?.timeZone,
  ];
}

export function anyago(input: DateInput): string;
export function anyago(input: DateInput, numeric: boolean): string;
export function anyago(
  input: DateInput,
  locale: LocaleInput,
  numeric?: boolean,
): string;
export function anyago(input: DateInput, options: AnyagoOptions): string;
export function anyago(
  input: DateInput,
  localeOrOptions?: LocaleInput | boolean | AnyagoOptions,
  numeric = false,
): string {
  const [locale, numericValue, now] = resolveAnyagoArgs(
    localeOrOptions,
    numeric,
  );
  const [v, u] = unit(
    toDate(input).getTime() - (now?.getTime() ?? Date.now()),
  );
  return rtf(locale, numericValue ? "always" : "auto").format(v, u);
}

export function anydate(input: DateInput): string;
export function anydate(
  input: DateInput,
  locale: LocaleInput,
  options?: Intl.DateTimeFormatOptions,
): string;
export function anydate(input: DateInput, options: AnydateOptions): string;
export function anydate(
  input: DateInput,
  localeOrOptions?: LocaleInput | AnydateOptions,
  options?: Intl.DateTimeFormatOptions,
): string {
  const [locale, dateOptions] = resolveAnydateArgs(localeOrOptions, options);
  return dtf(locale, dateOptions).format(toDate(input));
}

export function anywhen(input: DateInput): string;
export function anywhen(input: DateInput, time: boolean): string;
export function anywhen(
  input: DateInput,
  locale: LocaleInput,
  time?: boolean,
): string;
export function anywhen(input: DateInput, options: AnywhenOptions): string;
export function anywhen(
  input: DateInput,
  localeOrOptions?: LocaleInput | boolean | AnywhenOptions,
  time = true,
): string {
  const [locale, timeValue, explicitNow, timeZone] = resolveAnywhenArgs(
    localeOrOptions,
    time,
  );
  const date = toDate(input);
  const now = explicitNow ?? new Date();
  const ms = date.getTime() - now.getTime();
  const abs = Math.abs(ms) / 1000;
  const timeStr = () => dtf(locale, { ...TIME_OPTS, timeZone }).format(date);

  if (abs < 45) return rtf(locale, "auto").format(0, "second");
  if (abs < 3600)
    return rtf(locale, "auto").format(Math.round(ms / 6e4), "minute");

  if (ms > 0) {
    const [v, u] = unit(ms);
    return rtf(locale, "auto").format(v, u);
  }

  if (sameDay(date, now, timeZone))
    return timeValue
      ? `${rtf(locale, "auto").format(0, "day")}, ${timeStr()}`
      : rtf(locale, "auto").format(0, "day");

  const yest = new Date(now.getTime() - MS_DAY);
  if (sameDay(date, yest, timeZone)) {
    const s = rtf(locale, "auto").format(-1, "day");
    return timeValue ? `${s}, ${timeStr()}` : s;
  }

  if (Math.abs(ms) / MS_DAY < 7) {
    const w = dtf(locale, { timeZone, weekday: "long" }).format(date);
    return timeValue ? `${w}, ${timeStr()}` : w;
  }

  return dtf(locale, { ...DATE_OPTS, timeZone }).format(date);
}

export function anywhere(locale?: LocaleInput): AnywhereInstance {
  return {
    anyago: (input, options) =>
      typeof options === "object"
        ? anyago(input, { ...options, locale })
        : anyago(input, { locale, numeric: options }),
    anydate: (input, options) => anydate(input, { ...options, locale }),
    anywhen: (input, options) =>
      typeof options === "object"
        ? anywhen(input, { ...options, locale })
        : anywhen(input, { locale, time: options }),
  };
}
