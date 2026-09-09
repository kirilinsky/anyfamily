/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * Plural-rules kind, mapped to `Intl.PluralRules`:
 *
 * - `"cardinal"` — counting (`"1 item"`, `"5 items"`) (default)
 * - `"ordinal"` — ranking (`"1st"`, `"3rd"`)
 */
export type PluralType = "cardinal" | "ordinal";

/** The CLDR plural categories `Intl.PluralRules` can return. */
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/**
 * Word forms keyed by plural category. Provide `other` as the catch-all —
 * it is the terminal fallback for every locale and category. Locales that
 * never resolve to a given category for integers (ru cardinal never hits
 * `other`) may omit it, but a form that resolves to a missing category with
 * no reachable fallback throws at runtime.
 *
 * @example
 * ```ts
 * { one: "год", few: "года", many: "лет" }  // ru cardinal
 * { one: "st", two: "nd", few: "rd", other: "th" }  // en ordinal
 * ```
 */
export type Forms = Partial<Record<PluralCategory, string>>;

/** Options for {@linkcode anyplural} and {@linkcode anyplural.parts}. */
export interface AnypluralOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** Cardinal (counting) or ordinal (ranking). Defaults to `"cardinal"`. */
  type?: PluralType;
  /**
   * Formatting for the count, passed to `Intl.NumberFormat` — grouping,
   * decimals, currency, and so on. Defaults to plain integer formatting.
   *
   * @example
   * ```ts
   * anyplural(1500, { other: "items" }, { locale: "en" });
   * // "1,500 items"
   * ```
   */
  format?: Intl.NumberFormatOptions;
}

/** One piece of formatted output returned by {@linkcode anyplural.parts}. */
export interface AnypluralPart {
  /** Part kind — `"integer"`, `"group"`, `"decimal"`, `"literal"`, … as reported by `Intl.NumberFormat`, or `"literal"` for the word. */
  type: string;
  /** The text of this part. Joining all part values reproduces the full string. */
  value: string;
}

/**
 * Category fallback chains. A category missing from {@linkcode Forms} resolves
 * to the first present entry in its chain; `other` is always required, so the
 * chain never runs dry.
 */
const FALLBACK: Record<PluralCategory, PluralCategory[]> = {
  zero: ["other"],
  one: ["other"],
  two: ["few", "many", "other"],
  few: ["many", "other"],
  many: ["other"],
  other: [],
};

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
 * `{ style, currency }` and `{ currency, style }` share one formatter;
 * `undefined` values are skipped, as `Intl` skips them.
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

const prCache = new Map<string, Intl.PluralRules>();
const nfCache = new Map<string, Intl.NumberFormat>();

const pr = (l: Locale | undefined, type: PluralType) =>
  cacheGet(prCache, `${localeKey(l)}|${type}`, () => new Intl.PluralRules(l, { type }));

const nf = (l: Locale | undefined, o?: Intl.NumberFormatOptions) =>
  cacheGet(nfCache, `${localeKey(l)}|${o ? optKey(o) : ""}`, () => new Intl.NumberFormat(l, o));

/** Resolve the word for `category`, walking the fallback chain to `other`. */
function pick(forms: Forms, category: PluralCategory): string {
  const direct = forms[category];
  if (direct !== undefined) return direct;
  for (const f of FALLBACK[category]) {
    const v = forms[f];
    if (v !== undefined) return v;
  }
  throw new RangeError(`No form for plural category "${category}" and no "other" fallback`);
}

/**
 * What a call renders: the number formatter plus the word (separator
 * included), or a bare string when an explicit `zero` form replaces the whole
 * output.
 */
type Plan = { f: Intl.NumberFormat; word: string } | string;

function plan(count: number, forms: Forms, options: AnypluralOptions): Plan {
  if (typeof count !== "number" || !isFinite(count))
    throw new RangeError(`Invalid count: ${count}`);

  const { locale, type = "cardinal", format } = options;

  // Exact-zero shortcut: an explicit `zero` form replaces the whole output,
  // number and all, before the plural select runs (`"нет писем"`).
  if (count === 0 && forms.zero !== undefined) return forms.zero;

  const category = pr(locale, type).select(count) as PluralCategory;
  // Ordinal forms are suffixes and attach to the number; cardinals get a space.
  const word = (type === "ordinal" ? "" : " ") + pick(forms, category);
  return { f: nf(locale, format), word };
}

function format(count: number, forms: Forms, options: AnypluralOptions = {}): string {
  const p = plan(count, forms, options);
  return typeof p === "string" ? p : p.f.format(count) + p.word;
}

function parts(count: number, forms: Forms, options: AnypluralOptions = {}): AnypluralPart[] {
  const p = plan(count, forms, options);
  if (typeof p === "string") return [{ type: "literal", value: p }];
  const out: AnypluralPart[] = p.f.formatToParts(count);
  out.push({ type: "literal", value: p.word });
  return out;
}

/**
 * Picks the correct plural form for `count` in the given locale, formats the
 * count via native `Intl.NumberFormat`, and interpolates the two.
 *
 * The package exports this one name. Anything beyond the plain call hangs off
 * it — currently {@linkcode anyplural.parts}.
 *
 * @example
 * ```ts
 * anyplural(1, { one: "item", other: "items" });          // "1 item"
 * anyplural(5, { one: "item", other: "items" });          // "5 items"
 * anyplural(5, { one: "год", few: "года", many: "лет" }, { locale: "ru" }); // "5 лет"
 * anyplural(0, { zero: "нет писем", one: "письмо", many: "писем" });        // "нет писем"
 * anyplural(3, { one: "st", two: "nd", few: "rd", other: "th" }, { type: "ordinal" }); // "3rd"
 * ```
 *
 * @param count The number to pluralize.
 * @param forms Word forms keyed by plural category — `other` is required.
 * @param options See {@linkcode AnypluralOptions}.
 * @returns The formatted string.
 * @throws {RangeError} If `count` is not a finite number, or no form resolves for its category.
 */
export const anyplural = Object.assign(format, {
  /**
   * Like calling {@linkcode anyplural} directly, but returns the output as
   * `{ type, value }` parts instead of a string — style the number apart from
   * the word, or rebuild the output your own way.
   *
   * Takes the same arguments and throws on the same inputs.
   *
   * @example
   * ```ts
   * anyplural.parts(5, { one: "item", other: "items" }, { locale: "en" });
   * // [
   * //   { type: "integer", value: "5" },
   * //   { type: "literal", value: " items" },
   * // ]
   * ```
   */
  parts,
});
