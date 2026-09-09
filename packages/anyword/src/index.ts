/** A BCP 47 locale tag (`"en"`, `"th"`), or an array of tags used as a fallback chain. */
export type Locale = string | readonly string[];

/**
 * Segmentation unit, mapped to `Intl.Segmenter`:
 *
 * - `"word"` — words, locale-aware even without spaces (CJK, Thai) (default)
 * - `"grapheme"` — user-perceived characters, emoji and accents kept whole
 * - `"sentence"` — sentences, per the Unicode sentence-break rules
 */
export type Granularity = "word" | "grapheme" | "sentence";

/** Options for every anyword function. */
export interface AnywordOptions {
  /** Segmentation unit. Defaults to `"word"`. */
  by?: Granularity;
  /** Segmentation locale. Defaults to the runtime locale. */
  locale?: Locale;
  /**
   * Word mode: keep the segments between words — spaces and punctuation.
   * Ignored for `"grapheme"` and `"sentence"`, which never drop anything.
   * Defaults to `false`.
   */
  raw?: boolean;
}

/** Options for {@linkcode anyword.truncate}. */
export interface AnywordTruncateOptions extends AnywordOptions {
  /** Appended when the text was actually cut. Trailing whitespace is trimmed first. Defaults to `""`. */
  ellipsis?: string;
}

/** One segment returned by {@linkcode anyword.parts}. */
export interface AnywordPart {
  /** The segment text. Joining every part of a `raw` pass reproduces the input. */
  segment: string;
  /** Code-unit offset of this segment in the input string. */
  index: number;
  /** Word mode only: whether the segment is word-like rather than whitespace or punctuation. */
  isWordLike?: boolean;
}

const SEG =
  typeof Intl !== "undefined"
    ? (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter
    : undefined;

/** `true` when the runtime provides `Intl.Segmenter` (Baseline 2024). */
const supported: boolean = typeof SEG === "function";

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

const segCache = new Map<string, Intl.Segmenter>();

const GRANULARITIES: readonly Granularity[] = ["word", "grapheme", "sentence"];

function segmenter(locale: Locale | undefined, by: Granularity): Intl.Segmenter {
  if (!SEG)
    throw new Error(
      "Intl.Segmenter is not available in this runtime. " +
        "Check the `anyword.supported` flag before calling anyword.",
    );
  if (!GRANULARITIES.includes(by)) throw new RangeError(`Invalid granularity: ${String(by)}`);

  return cacheGet(segCache, `${localeKey(locale)}|${by}`, () =>
    new SEG(locale, { granularity: by }),
  );
}

/**
 * Visits each segment of `text` in order. In word mode, non-word segments —
 * spaces and punctuation — are skipped unless `raw`; the other granularities
 * keep everything. `visit` returns `true` to stop early.
 */
function each(
  text: string,
  options: AnywordOptions,
  visit: (s: Intl.SegmentData) => boolean | void,
): void {
  if (typeof text !== "string") throw new TypeError(`Invalid text: ${String(text)}`);

  const { by = "word", locale, raw = false } = options;
  const keepAll = raw || by !== "word";

  for (const s of segmenter(locale, by).segment(text))
    if ((keepAll || s.isWordLike) && visit(s)) return;
}

function segment(text: string, options: AnywordOptions = {}): string[] {
  const out: string[] = [];
  each(text, options, (s) => {
    out.push(s.segment);
  });
  return out;
}

function parts(text: string, options: AnywordOptions = {}): AnywordPart[] {
  const out: AnywordPart[] = [];
  each(text, options, (s) => {
    out.push(
      s.isWordLike === undefined
        ? { segment: s.segment, index: s.index }
        : { segment: s.segment, index: s.index, isWordLike: s.isWordLike },
    );
  });
  return out;
}

function count(text: string, options: AnywordOptions = {}): number {
  let n = 0;
  each(text, options, () => {
    n++;
  });
  return n;
}

function truncate(text: string, limit: number, options: AnywordTruncateOptions = {}): string {
  if (typeof limit !== "number" || !isFinite(limit) || limit < 0)
    throw new RangeError(`Invalid limit: ${limit}`);

  const { ellipsis = "", by = "grapheme", ...rest } = options;
  // "At most `limit` segments": a fractional limit keeps its floor.
  const keep = Math.floor(limit);

  let kept = 0;
  let cut = -1;
  each(text, { ...rest, by }, (s) => {
    if (kept === keep) {
      cut = s.index;
      return true;
    }
    kept++;
  });

  if (cut < 0) return text;

  const head = text.slice(0, cut);
  return ellipsis ? head.trimEnd() + ellipsis : head;
}

/**
 * Splits text into locale-correct segments using native `Intl.Segmenter` —
 * words by default, or graphemes and sentences via `by`.
 *
 * Unlike `.split(" ")` it finds words in scripts without spaces, and unlike
 * `[...str]` it never rips a composite emoji or a combining accent apart.
 *
 * The package exports this one name. Everything else hangs off it:
 * {@linkcode anyword.parts}, {@linkcode anyword.count},
 * {@linkcode anyword.truncate} and {@linkcode anyword.supported}.
 *
 * @example
 * ```ts
 * anyword("don't stop 世界");                 // ["don't", "stop", "世界"]
 * anyword("don't stop", { raw: true });      // ["don't", " ", "stop"]
 * anyword("👨‍👩‍👧 hi", { by: "grapheme" });      // ["👨‍👩‍👧", " ", "h", "i"]
 * anyword("Hi. Go now!", { by: "sentence" }); // ["Hi. ", "Go now!"]
 * anyword.count("héllo", { by: "grapheme" }); // 5
 * anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" }); // "héllo…"
 * ```
 *
 * @param text The text to segment.
 * @param options See {@linkcode AnywordOptions}.
 * @returns The segments, in order.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If `options.by` is unknown.
 * @throws {Error} If `Intl.Segmenter` is unavailable in the runtime (check {@linkcode anyword.supported}).
 */
export const anyword = Object.assign(segment, {
  /**
   * Like calling {@linkcode anyword} directly, but returns
   * `{ segment, index, isWordLike? }` parts instead of plain strings — the
   * offsets let you highlight, slice, or animate the original text without
   * searching it again.
   *
   * Takes the same arguments and throws on the same inputs.
   *
   * @example
   * ```ts
   * anyword.parts("世界 test");
   * // [
   * //   { segment: "世界", index: 0, isWordLike: true },
   * //   { segment: "test", index: 3, isWordLike: true },
   * // ]
   * ```
   */
  parts,

  /**
   * Counts segments — words by default, graphemes or sentences via `by`.
   *
   * A grapheme count is the character count users actually see: `"👨‍👩‍👧".length`
   * is 8, `anyword.count("👨‍👩‍👧", { by: "grapheme" })` is 1.
   *
   * @example
   * ```ts
   * anyword.count("世界 test");                 // 2
   * anyword.count("héllo", { by: "grapheme" }); // 5
   * ```
   *
   * @returns The number of segments.
   * @throws The same errors as {@linkcode anyword}.
   */
  count,

  /**
   * Cuts text to at most `limit` segments — graphemes by default, so an emoji
   * or an accented letter is never split in half.
   *
   * The cut lands on a segment boundary and keeps everything before it
   * verbatim, trailing whitespace included. With `ellipsis`, that whitespace
   * is trimmed and the ellipsis appended — and only when the text was
   * actually too long, so short input comes back untouched. The ellipsis does
   * not count toward `limit`.
   *
   * @example
   * ```ts
   * anyword.truncate("héllo 👨‍👩‍👧", 6);                       // "héllo "
   * anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" });     // "héllo…"
   * anyword.truncate("one two three", 2, { by: "word" });   // "one two "
   * anyword.truncate("short", 99);                          // "short"
   * ```
   *
   * @param text The text to cut.
   * @param limit Maximum number of segments to keep. A non-negative finite number.
   * @param options See {@linkcode AnywordTruncateOptions}. `by` defaults to `"grapheme"` here.
   * @returns The truncated text, or `text` unchanged if it already fits.
   * @throws {RangeError} If `limit` is negative or not finite — plus the same errors as {@linkcode anyword}.
   */
  truncate,

  /**
   * Whether `Intl.Segmenter` exists in this runtime. `false` on older engines,
   * where every anyword call throws — branch on this if you support them.
   *
   * @example
   * ```ts
   * anyword.supported ? anyword(text) : text.split(/\s+/);
   * ```
   */
  supported,
});
