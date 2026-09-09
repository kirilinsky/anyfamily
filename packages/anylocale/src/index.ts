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
function read<T>(locale: Intl.Locale, method: string, prop: string): T | undefined {
  const l = locale as unknown as Record<string, unknown>;
  const fn = l[method];
  return typeof fn === "function" ? (fn as () => T).call(locale) : (l[prop] as T | undefined);
}

function probe(): boolean {
  if (typeof Intl?.Locale !== "function") return false;
  try {
    return read<WeekInfo>(new Intl.Locale("en"), "getWeekInfo", "weekInfo") !== undefined;
  } catch {
    return false;
  }
}

/** `true` when the runtime exposes Intl Locale Info in either shape. */
const supported: boolean = probe();

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

/**
 * Two caches, because resolving a tag costs far more than reading one.
 *
 * `byTag` is keyed on the canonical tag, so `"en-us"` and `"en-US"` share one
 * record. Reaching it means having already run `new Intl.Locale()` and
 * `supportedLocalesOf()` — together ~3.6µs, which dwarfs the ~0.2µs the record
 * itself costs to read.
 *
 * `byInput` is keyed on the argument exactly as it arrived and is consulted
 * first, so a repeated call skips resolution entirely. The two are bounded
 * separately; a chain and the tag it resolves to are different keys pointing at
 * the same record.
 */
const byTag = new Map<string, AnylocaleInfo>();
const byInput = new Map<string, AnylocaleInfo>();

/**
 * `"s:"` and `"a:"` keep a string apart from a one-element chain, and the NUL
 * joiner stops a tag from colliding with a chain that spells the same text.
 */
const inputKey = (input: Locale): string =>
  typeof input === "string" ? `s:${input}` : `a:${input.join("\0")}`;

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
  // Getters in an object literal are own + enumerable, so spreading and
  // JSON.stringify see every field.
  const week = () => read<WeekInfo>(locale, "getWeekInfo", "weekInfo");
  return {
    tag: locale.toString(),
    get direction(): Direction {
      const d = read<{ direction?: string }>(locale, "getTextInfo", "textInfo")?.direction;
      return d === "rtl" ? "rtl" : "ltr";
    },
    get weekStart(): Weekday {
      const day = week()?.firstDay;
      return isWeekday(day) ? day : 1;
    },
    get weekend(): Weekday[] {
      const days = week()?.weekend;
      return Array.isArray(days) ? days.filter(isWeekday) : [6, 7];
    },
    get minimalDays(): number {
      return week()?.minimalDays ?? 1;
    },
    get calendars(): string[] {
      return read<string[]>(locale, "getCalendars", "calendars") ?? [];
    },
    get timeZones(): string[] {
      return read<string[]>(locale, "getTimeZones", "timeZones") ?? [];
    },
    get hourCycles(): string[] {
      return read<string[]>(locale, "getHourCycles", "hourCycles") ?? [];
    },
    get numberingSystems(): string[] {
      return read<string[]>(locale, "getNumberingSystems", "numberingSystems") ?? [];
    },
  };
}

function info(input: Locale): AnylocaleInfo {
  if (!supported) {
    throw new Error(
      "Intl Locale Info is not available in this runtime. It requires Node.js 18+ " +
        "(properties) or a newer engine (methods). Check the `anylocale.supported` " +
        "flag before calling anylocale.",
    );
  }

  // The input cache goes first: everything below it — walking the chain,
  // constructing Intl.Locale, asking whether the runtime has data — is the
  // expensive part, and a repeated call needs none of it. Invalid input throws
  // during resolution, so it never reaches either cache.
  return cacheGet(byInput, inputKey(input), () => {
    const locale = toLocale(input);
    return cacheGet(byTag, locale.toString(), () => build(locale));
  });
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
