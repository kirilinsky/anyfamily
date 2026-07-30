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

/** Options for {@linkcode anywordTruncate}. */
export interface AnywordTruncateOptions extends AnywordOptions {
  /** Appended when the text was actually cut. Trailing whitespace is trimmed first. Defaults to `""`. */
  ellipsis?: string;
}

/** One segment returned by {@linkcode anywordParts}. */
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

/**
 * Whether `Intl.Segmenter` exists in this runtime. `false` on older engines —
 * every anyword function throws there, so branch on this flag if you support them.
 *
 * @example
 * ```ts
 * import { anyword, supported } from "anyword";
 *
 * supported ? anyword(text) : text.split(/\s+/);
 * ```
 */
export const supported: boolean = typeof SEG === "function";

const CACHE_LIMIT = 50;

function cacheGet<V>(cache: Map<string, V>, k: string, create: () => V): V {
  const hit = cache.get(k);
  if (hit) return hit;
  const v = create();
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(k, v);
  return v;
}

const segCache = new Map<string, Intl.Segmenter>();

const localeKey = (locale?: Locale) =>
  Array.isArray(locale) ? locale.join("\0") : (locale ?? "");

const GRANULARITIES: Granularity[] = ["word", "grapheme", "sentence"];

function segmenter(locale: Locale | undefined, by: Granularity) {
  if (!SEG)
    throw new Error(
      "Intl.Segmenter is not available in this runtime. " +
        "Check the exported `supported` flag before calling anyword.",
    );
  if (!GRANULARITIES.includes(by)) throw new RangeError(`Invalid granularity: ${String(by)}`);

  return cacheGet(
    segCache,
    `${localeKey(locale)}|${by}`,
    () => new SEG(locale as Intl.LocalesArgument, { granularity: by }),
  );
}

/** Segment `text`, dropping non-word segments unless `raw` or a non-word granularity. */
function* walk(text: string, options: AnywordOptions) {
  if (typeof text !== "string") throw new TypeError(`Invalid text: ${String(text)}`);

  const { by = "word", locale, raw = false } = options;
  const keepAll = raw || by !== "word";

  for (const s of segmenter(locale, by).segment(text))
    if (keepAll || s.isWordLike) yield s;
}

/**
 * Splits text into locale-correct segments using native `Intl.Segmenter` —
 * words by default, or graphemes and sentences via `by`.
 *
 * Unlike `.split(" ")` it finds words in scripts without spaces, and unlike
 * `[...str]` it never rips a composite emoji or a combining accent apart.
 *
 * @example
 * ```ts
 * anyword("don't stop 世界");                 // ["don't", "stop", "世界"]
 * anyword("don't stop", { raw: true });      // ["don't", " ", "stop"]
 * anyword("👨‍👩‍👧 hi", { by: "grapheme" });      // ["👨‍👩‍👧", " ", "h", "i"]
 * anyword("Hi. Go now!", { by: "sentence" }); // ["Hi. ", "Go now!"]
 * ```
 *
 * @param text The text to segment.
 * @param options See {@linkcode AnywordOptions}.
 * @returns The segments, in order.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If `options.by` is unknown.
 * @throws {Error} If `Intl.Segmenter` is unavailable in the runtime (check {@linkcode supported}).
 */
export function anyword(text: string, options: AnywordOptions = {}): string[] {
  const out: string[] = [];
  for (const s of walk(text, options)) out.push(s.segment);
  return out;
}

/**
 * Like {@linkcode anyword}, but returns `{ segment, index, isWordLike? }` parts
 * instead of plain strings — the offsets let you highlight, slice, or animate
 * the original text without re-searching it.
 *
 * @example
 * ```ts
 * anywordParts("世界 test");
 * // [
 * //   { segment: "世界", index: 0, isWordLike: true },
 * //   { segment: "test", index: 3, isWordLike: true },
 * // ]
 * ```
 *
 * @param text The text to segment.
 * @param options See {@linkcode AnywordOptions} — same options as {@linkcode anyword}.
 * @returns The segments as parts, in order.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If `options.by` is unknown.
 * @throws {Error} If `Intl.Segmenter` is unavailable in the runtime (check {@linkcode supported}).
 */
export function anywordParts(
  text: string,
  options: AnywordOptions = {},
): AnywordPart[] {
  const out: AnywordPart[] = [];
  for (const s of walk(text, options))
    out.push(
      s.isWordLike === undefined
        ? { segment: s.segment, index: s.index }
        : { segment: s.segment, index: s.index, isWordLike: s.isWordLike },
    );
  return out;
}

/**
 * Counts segments — words by default, graphemes or sentences via `by`.
 *
 * A grapheme count is the character count users actually see: `"👨‍👩‍👧".length`
 * is 8, `anywordCount("👨‍👩‍👧", { by: "grapheme" })` is 1.
 *
 * @example
 * ```ts
 * anywordCount("世界 test");                 // 2
 * anywordCount("héllo", { by: "grapheme" }); // 5
 * ```
 *
 * @param text The text to count in.
 * @param options See {@linkcode AnywordOptions} — same options as {@linkcode anyword}.
 * @returns The number of segments.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If `options.by` is unknown.
 * @throws {Error} If `Intl.Segmenter` is unavailable in the runtime (check {@linkcode supported}).
 */
export function anywordCount(text: string, options: AnywordOptions = {}): number {
  let n = 0;
  for (const _ of walk(text, options)) n++;
  return n;
}

/**
 * Cuts text to at most `limit` segments — graphemes by default, so an emoji or
 * an accented letter is never split in half.
 *
 * The cut lands on a segment boundary and keeps everything before it verbatim,
 * trailing whitespace included. With `ellipsis`, that whitespace is trimmed and
 * the ellipsis appended — and only when the text was actually too long, so
 * short input comes back untouched. The ellipsis does not count toward `limit`.
 *
 * @example
 * ```ts
 * anywordTruncate("héllo 👨‍👩‍👧", 6);                       // "héllo "
 * anywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" });     // "héllo…"
 * anywordTruncate("one two three", 2, { by: "word" });   // "one two "
 * anywordTruncate("short", 99);                          // "short"
 * ```
 *
 * @param text The text to cut.
 * @param limit Maximum number of segments to keep. A non-negative finite number.
 * @param options See {@linkcode AnywordTruncateOptions}. `by` defaults to `"grapheme"` here.
 * @returns The truncated text, or `text` unchanged if it already fits.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If `limit` is negative or not finite, or `options.by` is unknown.
 * @throws {Error} If `Intl.Segmenter` is unavailable in the runtime (check {@linkcode supported}).
 */
export function anywordTruncate(
  text: string,
  limit: number,
  options: AnywordTruncateOptions = {},
): string {
  if (typeof limit !== "number" || !isFinite(limit) || limit < 0)
    throw new RangeError(`Invalid limit: ${limit}`);

  const { ellipsis = "", by = "grapheme", ...rest } = options;

  let kept = 0;
  let cut = -1;
  for (const s of walk(text, { ...rest, by })) {
    if (kept === limit) {
      cut = s.index;
      break;
    }
    kept++;
  }

  if (cut < 0) return text;

  const head = text.slice(0, cut);
  return ellipsis ? head.trimEnd() + ellipsis : head;
}
