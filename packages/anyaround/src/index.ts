/**
 * A locale, or a priority list of locales, forwarded verbatim to
 * {@linkcode Intl.DisplayNames}. `undefined` uses the runtime default.
 *
 * @example "de"
 * @example ["fr-CA", "fr"]
 */
export type Locale = string | readonly string[];

/**
 * How a code is interpreted. `"smart"` (the default) auto-detects the kind
 * from the shape of the code; every other value pins it explicitly.
 *
 * @see {@linkcode anyaround}
 */
export type Mode = "smart" | DisplayType;

/**
 * The five {@linkcode Intl.DisplayNames} kinds this library resolves. This is
 * also the value of {@linkcode AnyaroundInfo.type} after smart detection.
 */
export type DisplayType = "region" | "language" | "script" | "currency" | "calendar";

/**
 * Verbosity of the localized name, forwarded to {@linkcode Intl.DisplayNames}.
 * Defaults to `"long"`.
 */
export type Style = "long" | "short" | "narrow";

/**
 * What {@linkcode anyaround} returns. Only affects `region` codes that carry a
 * flag; for everything else the plain `name` is returned regardless.
 *
 * - `"name"` — the localized name (default), e.g. `"United States"`
 * - `"flag"` — the flag emoji alone, e.g. `"🇺🇸"`
 * - `"flag-name"` — flag then name, e.g. `"🇺🇸 United States"`
 * - `"name-flag"` — name then flag, e.g. `"United States 🇺🇸"`
 */
export type Display = "name" | "flag" | "flag-name" | "name-flag";

/**
 * What `name` becomes when a code is structurally valid but has no known name.
 *
 * - `"code"` — the (canonicalized) code, e.g. `"QZ"` (default)
 * - `"none"` — an empty string `""`
 *
 * Either way {@linkcode AnyaroundInfo.found} is `false` on a miss, so the two
 * are always distinguishable.
 */
export type Fallback = "code" | "none";

interface BaseOptions {
  /** Locale for the resolved name. Defaults to the runtime locale. */
  locale?: Locale;
  /** Name verbosity. Defaults to `"long"`. */
  style?: Style;
  /** Unknown-code behavior. Defaults to `"code"`. */
  fallback?: Fallback;
}

/**
 * Default mode: the kind is inferred from the code's shape.
 *
 * @see {@linkcode anyaround} for the detection rules.
 */
export interface SmartOptions extends BaseOptions {
  mode?: "smart";
  /** Output shape for flag-bearing regions. Defaults to `"name"`. */
  display?: Display;
}

/** Force region interpretation (ISO 3166-1 alpha-2 or UN M49). */
export interface RegionOptions extends BaseOptions {
  mode: "region";
  /** Output shape for flag-bearing regions. Defaults to `"name"`. */
  display?: Display;
}

/** Force language interpretation (BCP 47 / ISO 639). */
export interface LanguageOptions extends BaseOptions {
  mode: "language";
  /** `"dialect"` (default) or `"standard"` naming, e.g. dialect `"US English"`. */
  languageDisplay?: "dialect" | "standard";
}

/** Force script interpretation (ISO 15924, e.g. `"Latn"`). */
export interface ScriptOptions extends BaseOptions {
  mode: "script";
}

/** Force currency interpretation (ISO 4217, e.g. `"EUR"`). Returns the name, not a rate. */
export interface CurrencyOptions extends BaseOptions {
  mode: "currency";
}

/** Force calendar interpretation (e.g. `"gregory"`, `"islamic"`). Never smart-detected. */
export interface CalendarOptions extends BaseOptions {
  mode: "calendar";
}

/**
 * Options accepted by {@linkcode anyaround} and {@linkcode anyaround.info}, a
 * discriminated union on `mode`. `display` is only valid for `smart`/`region`;
 * `languageDisplay` only for `language`.
 */
export type AnyaroundOptions =
  | SmartOptions
  | RegionOptions
  | LanguageOptions
  | ScriptOptions
  | CurrencyOptions
  | CalendarOptions;

type ResolvedOptions = BaseOptions & {
  mode?: Mode;
  display?: Display;
  languageDisplay?: "dialect" | "standard";
};

/**
 * The structured result of resolving a code, returned by
 * {@linkcode anyaround.info}.
 */
export interface AnyaroundInfo {
  /** The canonicalized input code. */
  code: string;
  /** The kind it was resolved as (after smart detection). */
  type: DisplayType;
  /**
   * Localized name. When the code has no known name, this is the
   * canonicalized code (`fallback: "code"`, the default) or `""`
   * (`fallback: "none"`). Check {@linkcode AnyaroundInfo.found} to tell them
   * apart.
   */
  name: string;
  /** Flag emoji, or `""` when the code is not a flag-bearing alpha-2 region. */
  flag: string;
  /**
   * `true` when `Intl` had a localized name for the code, `false` when `name`
   * is a fallback (the code or `""`). Lets callers distinguish a real hit from
   * a miss.
   */
  found: boolean;
}

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

const dnCache = new Map<string, Intl.DisplayNames>();

/**
 * Resolved names, keyed by formatter and code. `Intl.DisplayNames.of` is the
 * whole cost of a call (~1.2µs), and a name is a fixed fact about
 * (locale, kind, style, code), so remembering it makes a re-render of a
 * 250-entry country picker cheap. Sized for that: a full list of regions in
 * two styles still fits. `null` records a miss, so a code with no name is
 * not looked up twice either.
 */
const nameCache = new Map<string, string | null>();
const NAME_LIMIT = 500;

const TYPES: readonly DisplayType[] = ["region", "language", "script", "currency", "calendar"];

const REGION_M49 = /^\d{3}$/;
const ALPHA4 = /^[A-Za-z]{4}$/;
const ALPHA2 = /^[A-Za-z]{2}$/;
const UPPER2 = /^[A-Z]{2}$/;
const UPPER3 = /^[A-Z]{3}$/;

/**
 * Infer the {@linkcode DisplayType} from a code's shape. Case-sensitive by
 * convention: uppercase two-letter → region, uppercase three-letter →
 * currency, lowercase → language.
 *
 * - `/^\d{3}$/` → `region` (UN M49, e.g. `"419"`)
 * - four letters → `script` (e.g. `"Latn"`)
 * - two uppercase letters → `region` (e.g. `"US"`)
 * - three uppercase letters → `currency` (e.g. `"USD"`)
 * - everything else → `language` (e.g. `"en"`, `"zh-Hant"`, `"eng"`)
 *
 * `calendar` is never inferred — pass `mode: "calendar"` explicitly.
 */
function detect(code: string): DisplayType {
  if (REGION_M49.test(code)) return "region";
  if (ALPHA4.test(code)) return "script";
  if (ALPHA2.test(code)) return UPPER2.test(code) ? "region" : "language";
  if (UPPER3.test(code)) return "currency";
  return "language";
}

/** Canonical casing per kind so {@linkcode Intl.DisplayNames.of} is happy. */
function canonical(code: string, type: DisplayType): string {
  if (type === "region" || type === "currency") return code.toUpperCase();
  if (type === "script") return code[0].toUpperCase() + code.slice(1).toLowerCase();
  return code.toLowerCase();
}

/**
 * The flag emoji for a canonical ISO 3166-1 alpha-2 region code: each letter
 * becomes its Regional Indicator Symbol. `""` for anything that is not two
 * uppercase ASCII letters (numeric M49 regions have no flag).
 */
const toFlag = (code: string): string =>
  UPPER2.test(code)
    ? String.fromCodePoint(127397 + code.charCodeAt(0), 127397 + code.charCodeAt(1))
    : "";

function resolve(code: string, options: AnyaroundOptions = {}): AnyaroundInfo {
  if (typeof code !== "string" || code.trim() === "")
    throw new TypeError(`Invalid code: ${String(code)}`);

  const {
    mode = "smart",
    locale,
    style = "long",
    fallback = "code",
    languageDisplay,
  } = options as ResolvedOptions;

  const trimmed = code.trim();
  const type = mode === "smart" ? detect(trimmed) : mode;
  if (!TYPES.includes(type)) throw new RangeError(`Invalid mode: ${String(mode)}`);

  const c = canonical(trimmed, type);
  const ld = type === "language" ? languageDisplay : undefined;
  const key = `${localeKey(locale)}|${type}|${style}|${ld ?? ""}`;

  // Always ask ICU with fallback "none" so a miss surfaces as `undefined`;
  // the caller's `fallback` is applied here and reported via `found`.
  const resolved = cacheGet(
    nameCache,
    `${key}|${c}`,
    () =>
      cacheGet(dnCache, key, () =>
        new Intl.DisplayNames(locale, { type, style, fallback: "none", languageDisplay: ld }),
      ).of(c) ?? null,
    NAME_LIMIT,
  );

  const found = resolved !== null;
  return {
    code: c,
    type,
    name: found ? resolved : fallback === "none" ? "" : c,
    flag: type === "region" ? toFlag(c) : "",
    found,
  };
}

function format(code: string, options: AnyaroundOptions = {}): string {
  const { name, flag } = resolve(code, options);
  if (!flag) return name;
  const { display = "name" } = options as ResolvedOptions;
  if (display === "flag") return flag;
  if (display === "flag-name") return `${flag} ${name}`;
  if (display === "name-flag") return `${name} ${flag}`;
  return name;
}

/**
 * Resolve a region / language / script / currency / calendar code to its
 * localized name, optionally decorated with a country flag emoji.
 *
 * The default `smart` mode infers the kind from the code's shape (see
 * {@linkcode detect}); pass `mode` to pin it. Flags are derived from ISO
 * 3166-1 alpha-2 region codes and surfaced via the `display` option.
 *
 * The package exports this one name. Anything beyond the plain call hangs off
 * it — currently {@linkcode anyaround.info}.
 *
 * @example
 * anyaround("US");                                  // "United States"
 * anyaround("US", { display: "flag-name" });        // "🇺🇸 United States"
 * anyaround("US", { locale: "ru" });                // "Соединенные Штаты"
 * anyaround("en");                                  // "English"
 * anyaround("Cyrl");                                // "Cyrillic"
 * anyaround("EUR");                                 // "Euro"
 * anyaround("gregory", { mode: "calendar" });       // "Gregorian Calendar"
 *
 * @param code - A region, language, script, currency, or calendar code.
 * @param options - Interpretation and formatting options.
 * @returns The localized string.
 * @throws {TypeError} If `code` is empty or not a string.
 * @throws {RangeError} If `mode` is not a recognized kind, or the code is
 * structurally invalid for its kind (propagated from {@linkcode Intl.DisplayNames}).
 * @see {@linkcode anyaround.info} for the structured `{ code, type, name, flag }` form.
 */
export const anyaround = Object.assign(format, {
  /**
   * Like calling {@linkcode anyaround} directly, but returns the structured
   * {@linkcode AnyaroundInfo} — the canonical `code`, resolved `type`,
   * localized `name`, `flag` (empty when not applicable) and `found` — so
   * callers can compose their own output. Every call returns a fresh object.
   *
   * Takes the same arguments; `display` is ignored.
   *
   * @example
   * ```ts
   * anyaround.info("US");
   * // { code: "US", type: "region", name: "United States", flag: "🇺🇸", found: true }
   * anyaround.info("en", { locale: "fr" });
   * // { code: "en", type: "language", name: "anglais", flag: "", found: true }
   * anyaround.info("QZ", { mode: "region" });
   * // { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }
   * ```
   */
  info: resolve,
});
