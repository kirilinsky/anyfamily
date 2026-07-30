import { describe, expect, it } from "vitest";
import {
  anyword,
  anywordCount,
  anywordParts,
  anywordTruncate,
  supported,
} from "./index";

describe("anyword — words", () => {
  it("splits plain text and keeps apostrophes inside a word", () => {
    expect(anyword("don't stop", { locale: "en" })).toEqual(["don't", "stop"]);
  });

  it("finds words in scripts without spaces", () => {
    expect(anyword("世界", { locale: "zh" })).toEqual(["世界"]);
    expect(anyword("don't stop 世界", { locale: "en" })).toEqual([
      "don't",
      "stop",
      "世界",
    ]);
  });

  it("drops whitespace and punctuation by default", () => {
    expect(anyword("hi, there!", { locale: "en" })).toEqual(["hi", "there"]);
  });

  it("keeps every segment with raw", () => {
    expect(anyword("hi there", { locale: "en", raw: true })).toEqual([
      "hi",
      " ",
      "there",
    ]);
    expect(anyword("hi there", { locale: "en", raw: true }).join("")).toBe("hi there");
  });

  it("returns an empty array for empty input", () => {
    expect(anyword("", { locale: "en" })).toEqual([]);
  });
});

describe("anyword — graphemes", () => {
  it("keeps a composite emoji whole", () => {
    expect(anyword("👨‍👩‍👧", { by: "grapheme" })).toEqual(["👨‍👩‍👧"]);
    expect("👨‍👩‍👧".length).toBeGreaterThan(1); // what naive .length would report
  });

  it("keeps whitespace, unlike word mode", () => {
    expect(anyword("👨‍👩‍👧 hi", { by: "grapheme" })).toEqual(["👨‍👩‍👧", " ", "h", "i"]);
  });

  it("keeps a combining accent attached to its base letter", () => {
    const decomposed = "e\u0301"; // é as e + combining acute
    expect(anyword(decomposed, { by: "grapheme" })).toEqual([decomposed]);
  });

  it("ignores raw — nothing is droppable", () => {
    expect(anyword("a b", { by: "grapheme", raw: false })).toEqual(["a", " ", "b"]);
  });
});

describe("anyword — sentences", () => {
  it("splits on sentence boundaries", () => {
    expect(anyword("Hi. Go now!", { by: "sentence", locale: "en" })).toEqual([
      "Hi. ",
      "Go now!",
    ]);
  });

  it("keeps trailing space and punctuation, so joining restores the input", () => {
    const text = "Hi there. Go now! Ok?";
    expect(anyword(text, { by: "sentence", locale: "en" }).join("")).toBe(text);
  });

  it("does not break on a decimal point", () => {
    expect(anyword("Pi is 3.14 here.", { by: "sentence", locale: "en" })).toEqual([
      "Pi is 3.14 here.",
    ]);
  });
});

describe("anywordParts", () => {
  it("returns segments with their offsets", () => {
    expect(anywordParts("世界 test", { locale: "en" })).toEqual([
      { segment: "世界", index: 0, isWordLike: true },
      { segment: "test", index: 3, isWordLike: true },
    ]);
  });

  it("offsets index into the original string", () => {
    const text = "hi there";
    for (const p of anywordParts(text, { locale: "en", raw: true }))
      expect(text.slice(p.index, p.index + p.segment.length)).toBe(p.segment);
  });

  it("omits isWordLike outside word mode", () => {
    expect(anywordParts("ab", { by: "grapheme" })).toEqual([
      { segment: "a", index: 0 },
      { segment: "b", index: 1 },
    ]);
  });

  it("reports non-word segments with raw", () => {
    expect(anywordParts("a b", { locale: "en", raw: true })).toEqual([
      { segment: "a", index: 0, isWordLike: true },
      { segment: " ", index: 1, isWordLike: false },
      { segment: "b", index: 2, isWordLike: true },
    ]);
  });
});

describe("anywordCount", () => {
  it("counts words, not space-delimited chunks", () => {
    expect(anywordCount("世界 test", { locale: "en" })).toBe(2);
    expect(anywordCount("one two three", { locale: "en" })).toBe(3);
    expect(anywordCount("  ", { locale: "en" })).toBe(0);
  });

  it("counts graphemes the way users see them", () => {
    expect(anywordCount("héllo", { by: "grapheme" })).toBe(5);
    expect(anywordCount("👨‍👩‍👧", { by: "grapheme" })).toBe(1);
  });

  it("counts sentences", () => {
    expect(anywordCount("Hi. Go now!", { by: "sentence", locale: "en" })).toBe(2);
  });
});

describe("anywordTruncate", () => {
  it("cuts on a grapheme boundary by default", () => {
    expect(anywordTruncate("héllo 👨‍👩‍👧", 6)).toBe("héllo ");
    expect(anywordTruncate("héllo 👨‍👩‍👧", 7)).toBe("héllo 👨‍👩‍👧");
  });

  it("never splits a composite emoji", () => {
    const cut = anywordTruncate("ab👨‍👩‍👧cd", 3);
    expect(cut).toBe("ab👨‍👩‍👧");
    expect(anywordCount(cut, { by: "grapheme" })).toBe(3);
  });

  it("returns the input untouched when it already fits", () => {
    expect(anywordTruncate("short", 99)).toBe("short");
    expect(anywordTruncate("short", 99, { ellipsis: "…" })).toBe("short");
    expect(anywordTruncate("", 0)).toBe("");
  });

  it("appends the ellipsis only on a real cut, trimming trailing space", () => {
    expect(anywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" })).toBe("héllo…");
    expect(anywordTruncate("héllo 👨‍👩‍👧", 6, { ellipsis: "…" })).toBe("héllo…");
  });

  it("cuts by word when asked", () => {
    expect(anywordTruncate("one two three", 2, { by: "word", locale: "en" })).toBe(
      "one two ",
    );
    expect(
      anywordTruncate("one two three", 2, { by: "word", locale: "en", ellipsis: "…" }),
    ).toBe("one two…");
  });

  it("handles a zero limit", () => {
    expect(anywordTruncate("abc", 0)).toBe("");
    expect(anywordTruncate("abc", 0, { ellipsis: "…" })).toBe("…");
  });

  it("rejects an invalid limit", () => {
    expect(() => anywordTruncate("abc", -1)).toThrow(RangeError);
    expect(() => anywordTruncate("abc", NaN)).toThrow(RangeError);
    expect(() => anywordTruncate("abc", Infinity)).toThrow(RangeError);
  });
});

describe("locales", () => {
  it("accepts a fallback chain", () => {
    expect(anyword("hi there", { locale: ["xx-Nope", "en"] })).toEqual(["hi", "there"]);
  });

  it("segments Thai, which has no spaces between words", () => {
    expect(anywordCount("สวัสดีชาวโลก", { locale: "th" })).toBeGreaterThan(1);
  });
});

describe("errors and support", () => {
  it("reports Intl.Segmenter support", () => {
    expect(supported).toBe(true); // Node 18+ ships it
  });

  it("throws on a non-string input", () => {
    // @ts-expect-error runtime guard for untyped callers
    expect(() => anyword(42)).toThrow(TypeError);
    // @ts-expect-error runtime guard for untyped callers
    expect(() => anywordCount(null)).toThrow(TypeError);
  });

  it("throws on an unknown granularity", () => {
    // @ts-expect-error runtime guard for untyped callers
    expect(() => anyword("hi", { by: "chapter" })).toThrow(RangeError);
  });
});
