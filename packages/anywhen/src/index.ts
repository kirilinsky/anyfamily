type RelativeUnit = Intl.RelativeTimeFormatUnit;
type DateInput = Date | number | string;

export interface AnywhereInstance {
  anyago(input: DateInput, numeric?: boolean): string;
  anydate(input: DateInput, options?: Intl.DateTimeFormatOptions): string;
  anywhen(input: DateInput, time?: boolean): string;
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

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
const dtfCache = new Map<string, Intl.DateTimeFormat>();

const rtf = (l: string, n: "always" | "auto") => {
  const k = l + n;
  return (
    rtfCache.get(k) ??
    rtfCache.set(k, new Intl.RelativeTimeFormat(l, { numeric: n })).get(k)!
  );
};

const dtf = (l: string, o: Intl.DateTimeFormatOptions) => {
  const k = `${l}|${o.weekday}|${o.month}|${o.year}|${o.day}|${o.hour}|${o.minute}`;
  return dtfCache.get(k) ?? dtfCache.set(k, new Intl.DateTimeFormat(l, o)).get(k)!;
};

const toDate = (i: DateInput) => (i instanceof Date ? i : new Date(i));

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function unit(ms: number): [number, RelativeUnit] {
  const s = Math.abs(ms) / 1000;
  for (const [th, u, div] of THRESHOLDS) if (s < th) return [Math.round(ms / div), u];
  return [Math.round(ms / MS_YEAR), "year"];
}

export function anyago(
  input: DateInput,
  locale: string,
  numeric = false,
): string {
  const [v, u] = unit(toDate(input).getTime() - Date.now());
  return rtf(locale, numeric ? "always" : "auto").format(v, u);
}

export function anydate(
  input: DateInput,
  locale: string,
  options: Intl.DateTimeFormatOptions = DATE_OPTS,
): string {
  return dtf(locale, options).format(toDate(input));
}

export function anywhen(input: DateInput, locale: string, time = true): string {
  const date = toDate(input);
  const now = new Date();
  const ms = date.getTime() - now.getTime();
  const abs = Math.abs(ms) / 1000;
  const timeStr = () => dtf(locale, TIME_OPTS).format(date);

  if (abs < 45) return rtf(locale, "auto").format(0, "second");
  if (abs < 3600) return rtf(locale, "auto").format(Math.round(ms / 6e4), "minute");

  if (ms > 0) {
    const [v, u] = unit(ms);
    return rtf(locale, "auto").format(v, u);
  }

  if (sameDay(date, now))
    return time
      ? `${rtf(locale, "auto").format(0, "day")}, ${timeStr()}`
      : dtf(locale, { day: "numeric", month: "short" }).format(date);

  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (sameDay(date, yest)) {
    const s = rtf(locale, "auto").format(-1, "day");
    return time ? `${s}, ${timeStr()}` : s;
  }

  if (Math.abs(ms) / MS_DAY < 7) {
    const w = dtf(locale, { weekday: "long" }).format(date);
    return time ? `${w}, ${timeStr()}` : w;
  }

  return dtf(locale, DATE_OPTS).format(date);
}

export function anywhere(locale: string): AnywhereInstance {
  return {
    anyago: (input, numeric) => anyago(input, locale, numeric),
    anydate: (input, options) => anydate(input, locale, options),
    anywhen: (input, time) => anywhen(input, locale, time),
  };
}
