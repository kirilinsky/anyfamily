/** A BCP 47 locale tag (`"en"`, `"pt-BR"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * How to sort items before joining, mapped to `Intl.Collator`:
 *
 * - `true` — default collation for the locale
 * - `"numeric"` — numeric collation (`"файл2"` before `"файл10"`)
 * - `Intl.CollatorOptions` — full control (`{ sensitivity: "base" }`, `{ caseFirst: "upper" }`, …)
 */
export type Sort = boolean | "numeric" | Intl.CollatorOptions;

/** One piece of formatted output returned by {@linkcode anymanyParts}. */
export interface AnymanyPart {
  /** Part kind as reported by `Intl.ListFormat` — `"element"` or `"literal"`. */
  type: string;
  /** The text of this part. Joining all part values reproduces the full string. */
  value: string;
}

/** Options for {@linkcode anymany} and {@linkcode anymanyParts}. */
export interface AnymanyOptions {
  /** Output locale. Defaults to the runtime locale. */
  locale?: Locale;
  /** List flavor, mapped to `Intl.ListFormat`: `"a, b, and c"` / `"a, b, or c"` / `"a, b, c"`. Defaults to `"conjunction"`. */
  type?: Intl.ListFormatType;
  /** Joiner wording length, mapped to `Intl.ListFormat`: `"and"` / `"&"` / none. Defaults to `"long"`. */
  style?: Intl.ListFormatStyle;
  /**
   * Sort items with `Intl.Collator` before joining. `true` = default
   * collation, `"numeric"` = numeric collation (`"файл2"` before `"файл10"`),
   * or any `Intl.CollatorOptions` for full control. The input array is never
   * mutated. Defaults to no sorting.
   */
  sort?: Sort;
  /**
   * Maximum items to show. The rest collapse into a trailing `"+N"` counter
   * (digits localized via `Intl.NumberFormat` — no words, locale-safe).
   * Applied after sorting. Defaults to no limit.
   */
  max?: number;
  /**
   * Custom overflow label builder, replaces the default `"+N"`. Receives the
   * number of hidden items. The returned label joins the list verbatim as a
   * regular element — localizing it is the callback's responsibility.
   *
   * @example
   * ```ts
   * anymany(items, { max: 3, overflow: (n) => `and ${n} more` });
   * ```
   */
  overflow?: (hidden: number) => string;
}

const CACHE_LIMIT = 50;

function cacheGet<V>(cache: Map<string, V>, k: string, create: () => V): V {
  const hit = cache.get(k);
  if (hit) {
    // re-insert so Map order tracks recency — eviction below is LRU, not FIFO
    cache.delete(k);
    cache.set(k, hit);
    return hit;
  }
  const v = create();
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(k, v);
  return v;
}

const lfCache = new Map<string, Intl.ListFormat>();
const colCache = new Map<string, Intl.Collator>();
const nfCache = new Map<string, Intl.NumberFormat>();

const localeKey = (locale?: Locale) =>
  Array.isArray(locale) ? locale.join("\0") : (locale ?? "");

const lf = (
  l: Locale | undefined,
  type: Intl.ListFormatType,
  style: Intl.ListFormatStyle,
) =>
  cacheGet(lfCache, `${localeKey(l)}|${type}|${style}`, () =>
    new Intl.ListFormat(l as Intl.LocalesArgument, { style, type }),
  );

const collator = (l: Locale | undefined, o: Intl.CollatorOptions) =>
  cacheGet(colCache, `${localeKey(l)}|${JSON.stringify(o)}`, () =>
    new Intl.Collator(l as Intl.LocalesArgument, o),
  );

const nf = (l: Locale | undefined) =>
  cacheGet(nfCache, `${localeKey(l)}`, () =>
    new Intl.NumberFormat(l as Intl.LocalesArgument),
  );

interface Plan {
  f: Intl.ListFormat;
  items: string[];
}

function plan(items: readonly string[], options: AnymanyOptions): Plan {
  const {
    locale,
    type = "conjunction",
    style = "long",
    sort,
    max,
    overflow,
  } = options;

  const list = Array.from(items, String);

  if (sort) {
    const opts: Intl.CollatorOptions =
      sort === true ? {} : sort === "numeric" ? { numeric: true } : sort;
    list.sort(collator(locale, opts).compare);
  }

  if (max !== undefined) {
    if (!Number.isInteger(max) || max <= 0)
      throw new RangeError(`Invalid max: ${max}`);
    if (list.length > max) {
      const hidden = list.length - max;
      list.length = max;
      list.push(overflow ? overflow(hidden) : `+${nf(locale).format(hidden)}`);
    }
  }

  return { f: lf(locale, type, style), items: list };
}

/**
 * Joins an array of strings into a human-readable, localized list using
 * native `Intl` — sorted right, joined right, in any locale.
 *
 * Non-string items are coerced via `String()`. An empty array returns `""`;
 * a single item is returned as-is.
 *
 * @example
 * ```ts
 * anymany(["banana", "apple", "cherry"]);                     // "banana, apple, and cherry"
 * anymany(["a", "b", "c"], { type: "disjunction", locale: "ru" }); // "a, b или c"
 * anymany(["Öl", "Zebra", "Apfel"], { sort: true, locale: "de" }); // "Apfel, Öl und Zebra"
 * anymany(["x", "y", "z", "a", "b", "c", "d"], { max: 3 });   // "x, y, z, and +4"
 * ```
 *
 * @param items The strings to join.
 * @param options See {@linkcode AnymanyOptions}.
 * @returns The formatted list as a string.
 * @throws {RangeError} If `options.max` is not a positive integer, or `options.locale` is invalid.
 */
export function anymany(
  items: readonly string[],
  options: AnymanyOptions = {},
): string {
  const p = plan(items, options);
  return p.f.format(p.items);
}

/**
 * Like {@linkcode anymany}, but returns the output as `{ type, value }`
 * parts instead of a string — style the items apart from the separators, or
 * rebuild the output your own way.
 *
 * @example
 * ```ts
 * anymanyParts(["a", "b"]);
 * // [
 * //   { type: "element", value: "a" },
 * //   { type: "literal", value: " and " },
 * //   { type: "element", value: "b" },
 * // ]
 * ```
 *
 * @param items The strings to join.
 * @param options See {@linkcode AnymanyOptions} — same options as {@linkcode anymany}.
 * @returns The formatted output as an array of parts.
 * @throws {RangeError} If `options.max` is not a positive integer, or `options.locale` is invalid.
 */
export function anymanyParts(
  items: readonly string[],
  options: AnymanyOptions = {},
): AnymanyPart[] {
  const p = plan(items, options);
  return p.f.formatToParts(p.items);
}
