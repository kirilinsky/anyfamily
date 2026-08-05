/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/** Text direction of a locale's script. */
export type Direction = "ltr" | "rtl";

/**
 * A day of the week in ISO-8601 numbering — `1` is Monday, `7` is Sunday.
 *
 * This is CLDR's numbering, not JavaScript's: `Date.prototype.getDay()` returns
 * `0` for Sunday. Convert with `iso % 7`.
 */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Everything native `Intl` knows about how a locale behaves.
 *
 * Properties are computed on access, so reading only `direction` never asks the
 * runtime for calendars or time zones. They are still plain own enumerable
 * properties, so spreading and `JSON.stringify` work as expected.
 */
export interface AnylocaleInfo {
  /** The canonical tag the runtime resolved the input to — `"en-us"` → `"en-US"`. */
  tag: string;
  /** Text direction of the locale's script. `"ltr"` when the runtime does not say. */
  direction: Direction;
  /** First day of the week, ISO numbering (1 = Monday … 7 = Sunday). */
  weekStart: Weekday;
  /** Days the locale counts as the weekend, ISO numbering. Not always two — `fa-IR` has only Friday. */
  weekend: Weekday[];
  /** Days of a week that must fall in a year for it to count as that year's first week. */
  minimalDays: number;
  /** Calendars the locale can use, preferred first — `["persian", "gregory", …]`. */
  calendars: string[];
  /** IANA time zones for the region, when the tag carries one. Empty for language-only tags. */
  timeZones: string[];
  /** Hour cycles the locale uses, preferred first — `"h12"`, `"h23"`, … */
  hourCycles: string[];
  /** Numbering systems the locale uses, preferred first — `"latn"`, `"arab"`, … */
  numberingSystems: string[];
}

type WeekInfo = {
  firstDay?: number;
  weekend?: number[];
  minimalDays?: number;
};

/**
 * The Intl Locale Info data moved from properties (`locale.weekInfo`) to methods
 * (`locale.getWeekInfo()`) late in standardisation, and engines are split: Node
 * 22 ships only the properties, newer engines only the methods. Read whichever
 * the runtime has.
 */
function read<T>(locale: Intl.Locale, name: string): T | undefined {
  const l = locale as unknown as Record<string, unknown>;
  const method = l[`get${name[0].toUpperCase()}${name.slice(1)}`];
  if (typeof method === "function") {
    return (method as () => T).call(locale);
  }
  return l[name] as T | undefined;
}

function probe(): boolean {
  if (typeof Intl?.Locale !== "function") return false;
  try {
    const l = new Intl.Locale("en");
    return read<WeekInfo>(l, "weekInfo") !== undefined;
  } catch {
    return false;
  }
}

/** `true` when the runtime exposes Intl Locale Info in either shape. */
const supported: boolean = probe();

const CACHE_LIMIT = 50;
const cache = new Map<string, AnylocaleInfo>();

const isWeekday = (n: unknown): n is Weekday =>
  typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 7;

/**
 * Whether the runtime actually has data for a tag.
 *
 * `new Intl.Locale("xx-Nope")` does **not** throw — that tag is structurally
 * valid BCP 47, it just has no data behind it. Parsing alone would make a
 * fallback chain stop at the first well-formed tag rather than the first useful
 * one, so ask Intl what it can really serve.
 */
function hasData(tag: string): boolean {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([tag]).length > 0;
  } catch {
    return false;
  }
}

/**
 * Resolves a fallback chain to one locale. `Intl.Locale` takes a single tag, so
 * the chain is walked by hand: the first tag with data wins, and if none has
 * data the first well-formed tag is used rather than throwing — the runtime
 * still answers with its own defaults, which beats no answer at all.
 */
function toLocale(input: Locale): Intl.Locale {
  const tags = typeof input === "string" ? [input] : input;
  if (tags.length === 0) {
    throw new TypeError("anylocale: expected a BCP 47 tag, received an empty list");
  }

  let firstParsed: Intl.Locale | undefined;
  let last: unknown;

  for (const tag of tags) {
    let locale: Intl.Locale;
    try {
      locale = new Intl.Locale(tag);
    } catch (error) {
      last = error;
      continue;
    }
    if (hasData(locale.toString())) return locale;
    firstParsed ??= locale;
  }

  if (firstParsed) return firstParsed;

  throw new RangeError(
    `anylocale: no valid BCP 47 tag in ${JSON.stringify(tags)}` +
      (last instanceof Error ? ` — ${last.message}` : ""),
  );
}

function build(locale: Intl.Locale): AnylocaleInfo {
  // Each getter is lazy: asking for `direction` never builds the calendar list.
  const info = {
    tag: locale.toString(),
    get direction(): Direction {
      const d = read<{ direction?: string }>(locale, "textInfo")?.direction;
      return d === "rtl" ? "rtl" : "ltr";
    },
    get weekStart(): Weekday {
      const day = read<WeekInfo>(locale, "weekInfo")?.firstDay;
      return isWeekday(day) ? day : 1;
    },
    get weekend(): Weekday[] {
      const days = read<WeekInfo>(locale, "weekInfo")?.weekend;
      return Array.isArray(days) ? days.filter(isWeekday) : [6, 7];
    },
    get minimalDays(): number {
      return read<WeekInfo>(locale, "weekInfo")?.minimalDays ?? 1;
    },
    get calendars(): string[] {
      return read<string[]>(locale, "calendars") ?? [];
    },
    get timeZones(): string[] {
      return read<string[]>(locale, "timeZones") ?? [];
    },
    get hourCycles(): string[] {
      return read<string[]>(locale, "hourCycles") ?? [];
    },
    get numberingSystems(): string[] {
      return read<string[]>(locale, "numberingSystems") ?? [];
    },
  };

  // Getters defined in an object literal are already own + enumerable, so
  // spreading and JSON.stringify see every field.
  return info;
}

function info(input: Locale): AnylocaleInfo {
  if (!supported) {
    throw new Error(
      "Intl Locale Info is not available in this runtime. It requires Node.js 18+ " +
        "(properties) or a newer engine (methods). Check the `anylocale.supported` " +
        "flag before calling anylocale.",
    );
  }

  const locale = toLocale(input);
  const key = locale.toString();

  const hit = cache.get(key);
  if (hit) return hit;

  const built = build(locale);
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(key, built);
  return built;
}

/**
 * Reads what native `Intl` knows about how a locale behaves — text direction,
 * first day of the week, weekend days, available calendars, time zones, hour
 * cycles and numbering systems.
 *
 * This is the behaviour side of a locale, not the naming side: for "what is this
 * code called in language X" reach for `anyaround` instead.
 *
 * The package exports this one name; the support flag hangs off it as
 * {@linkcode anylocale.supported}.
 *
 * @example
 * ```ts
 * anylocale("ar-EG").direction;  // "rtl"
 * anylocale("en-GB").weekStart;  // 1 — Monday, while en-US is 7
 * anylocale("fa-IR").weekend;    // [5] — Friday only
 * anylocale("ar-EG").timeZones;  // ["Africa/Cairo"]
 * ```
 *
 * @param input A BCP 47 tag, or an array of tags used as a fallback chain.
 * @returns The locale's {@linkcode AnylocaleInfo}. Fields are computed on access.
 * @throws {TypeError} If the fallback chain is empty.
 * @throws {RangeError} If no tag in the chain is a well-formed BCP 47 tag.
 * @throws {Error} If the runtime has no Intl Locale Info (check {@linkcode anylocale.supported}).
 */
export const anylocale = Object.assign(info, {
  /**
   * Whether this runtime exposes Intl Locale Info, in either the property or the
   * method shape. `false` on engines that predate the proposal, where every
   * anylocale call throws.
   *
   * @example
   * ```ts
   * const dir = anylocale.supported ? anylocale(tag).direction : "ltr";
   * ```
   */
  supported,
});
