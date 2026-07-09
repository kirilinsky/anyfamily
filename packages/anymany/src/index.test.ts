import { describe, it, expect } from "vitest";
import { anymany, anymanyParts } from "./index";

describe("default join — en", () => {
  it("empty array → empty string", () => {
    expect(anymany([], { locale: "en" })).toBe("");
  });
  it("single item → the item itself", () => {
    expect(anymany(["solo"], { locale: "en" })).toBe("solo");
  });
  it("two items", () => {
    expect(anymany(["a", "b"], { locale: "en" })).toBe("a and b");
  });
  it("three items — Oxford comma", () => {
    expect(anymany(["banana", "apple", "cherry"], { locale: "en" })).toBe(
      "banana, apple, and cherry",
    );
  });
  it("uses runtime locale when omitted", () => {
    expect(anymany(["a", "b"])).toContain("a");
    expect(anymany(["a", "b"])).toContain("b");
  });
});

describe("type option", () => {
  it("disjunction — en", () => {
    expect(anymany(["a", "b", "c"], { type: "disjunction", locale: "en" })).toBe(
      "a, b, or c",
    );
  });
  it("disjunction — ru («или»)", () => {
    expect(anymany(["a", "b", "c"], { type: "disjunction", locale: "ru" })).toBe(
      "a, b или c",
    );
  });
  it("unit — plain comma join", () => {
    expect(anymany(["a", "b", "c"], { type: "unit", locale: "en" })).toBe(
      "a, b, c",
    );
  });
});

describe("style option", () => {
  it("long (default) → and", () => {
    expect(anymany(["a", "b", "c"], { locale: "en" })).toContain("and");
  });
  it("short → &", () => {
    expect(anymany(["a", "b", "c"], { style: "short", locale: "en" })).toContain(
      "&",
    );
  });
  it("narrow → no joiner word", () => {
    expect(anymany(["a", "b", "c"], { style: "narrow", locale: "en" })).toBe(
      "a, b, c",
    );
  });
});

describe("locales", () => {
  it("russian («и»)", () => {
    expect(anymany(["a", "b", "c"], { locale: "ru" })).toBe("a, b и c");
  });
  it("german («und»)", () => {
    expect(anymany(["a", "b", "c"], { locale: "de" })).toBe("a, b und c");
  });
  it("japanese (「、」)", () => {
    expect(anymany(["a", "b", "c"], { locale: "ja" })).toBe("a、b、c");
  });
  it("supports locale fallback arrays", () => {
    expect(anymany(["a", "b", "c"], { locale: ["de-DE", "en"] })).toBe(
      "a, b und c",
    );
  });
});

describe("sort option", () => {
  it("sort: true — collation, not code points (de umlauts)", () => {
    expect(anymany(["Öl", "Zebra", "Apfel"], { sort: true, locale: "de" })).toBe(
      "Apfel, Öl und Zebra",
    );
  });
  it("sort: \"numeric\" — файл2 before файл10", () => {
    expect(anymany(["файл10", "файл2"], { sort: "numeric", locale: "ru" })).toBe(
      "файл2 и файл10",
    );
  });
  it("sort with CollatorOptions object — numeric: true", () => {
    expect(
      anymany(["файл10", "файл2"], { sort: { numeric: true }, locale: "ru" }),
    ).toBe("файл2 и файл10");
  });
  it("sort with CollatorOptions object — sensitivity: base", () => {
    expect(
      anymany(["b", "A", "a"], { sort: { sensitivity: "base" }, locale: "en" }),
    ).toBe("A, a, and b");
  });
  it("sort with CollatorOptions object — caseFirst: upper", () => {
    expect(
      anymany(["a", "A"], { sort: { caseFirst: "upper" }, locale: "en" }),
    ).toBe("A and a");
  });
  it("does not mutate the input array", () => {
    const input = ["Öl", "Zebra", "Apfel"];
    anymany(input, { sort: true, locale: "de" });
    expect(input).toEqual(["Öl", "Zebra", "Apfel"]);
  });
  it("no sorting by default", () => {
    expect(anymany(["b", "a"], { locale: "en" })).toBe("b and a");
  });
});

describe("max option", () => {
  it("collapses the tail into +N", () => {
    expect(
      anymany(["x", "y", "z", "a", "b", "c", "d"], { max: 3, locale: "en" }),
    ).toBe("x, y, z, and +4");
  });
  it("max === length → no overflow", () => {
    expect(anymany(["a", "b", "c"], { max: 3, locale: "en" })).toBe(
      "a, b, and c",
    );
  });
  it("max > length → no overflow", () => {
    expect(anymany(["a", "b"], { max: 5, locale: "en" })).toBe("a and b");
  });
  it("applies after sorting", () => {
    expect(
      anymany(["c", "a", "d", "b"], { sort: true, max: 2, locale: "en" }),
    ).toBe("a, b, and +2");
  });
  it("localizes overflow digits (ar-EG → ٤)", () => {
    expect(
      anymany(["a", "b", "c", "d", "e", "f", "g"], { max: 3, locale: "ar-EG" }),
    ).toContain("+٤");
  });
  it("custom overflow callback", () => {
    expect(
      anymany(["x", "y", "z", "a", "b"], {
        max: 3,
        locale: "en",
        overflow: (n) => `${n} more`,
      }),
    ).toBe("x, y, z, and 2 more");
  });
  it("throws RangeError on max: 0", () => {
    expect(() => anymany(["a"], { max: 0 })).toThrow(RangeError);
    expect(() => anymany(["a"], { max: 0 })).toThrow("Invalid max: 0");
  });
  it("throws RangeError on negative max", () => {
    expect(() => anymany(["a"], { max: -2 })).toThrow(RangeError);
  });
  it("throws RangeError on fractional max", () => {
    expect(() => anymany(["a"], { max: 1.5 })).toThrow(RangeError);
  });
});

describe("input coercion", () => {
  it("coerces non-string items via String()", () => {
    expect(anymany([1, "b"] as unknown as string[], { locale: "en" })).toBe(
      "1 and b",
    );
  });
});

describe("anymanyParts", () => {
  it("returns element/literal parts", () => {
    expect(anymanyParts(["a", "b"], { locale: "en" })).toEqual([
      { type: "element", value: "a" },
      { type: "literal", value: " and " },
      { type: "element", value: "b" },
    ]);
  });
  it("empty array → empty parts", () => {
    expect(anymanyParts([], { locale: "en" })).toEqual([]);
  });
  it("joined parts equal the anymany string for every option mix", () => {
    const cases: Parameters<typeof anymany>[] = [
      [["a", "b", "c"], { locale: "en" }],
      [["a", "b", "c"], { type: "disjunction", locale: "ru" }],
      [["Öl", "Zebra", "Apfel"], { sort: true, locale: "de" }],
      [["a", "b", "c"], { style: "narrow", locale: "ja" }],
      [["x", "y", "z", "a", "b"], { max: 3, locale: "en" }],
      [["x", "y", "z", "a", "b"], { max: 3, locale: "ar-EG" }],
    ];
    for (const [items, options] of cases) {
      const parts = anymanyParts(items, options);
      expect(parts.map((p) => p.value).join("")).toBe(anymany(items, options));
    }
  });
  it("throws the same RangeError as anymany on invalid max", () => {
    expect(() => anymanyParts(["a"], { max: 0 })).toThrow(RangeError);
  });
});

describe("formatter cache — eviction", () => {
  // 60 syntactically valid locales (> CACHE_LIMIT of 50); unknown regions
  // fall back to plain "en" so output stays assertable.
  const locales = Array.from(
    { length: 60 },
    (_, i) =>
      `en-${String.fromCharCode(65 + Math.floor(i / 26))}${String.fromCharCode(
        65 + (i % 26),
      )}`,
  );

  it("output stays correct past the cache limit", () => {
    // reference: a fresh, uncached formatter per locale (regional variants
    // may legitimately differ, e.g. drop the Oxford comma)
    const expected = (locale: string) =>
      new Intl.ListFormat(locale, {
        style: "long",
        type: "conjunction",
      }).format(["a", "b", "c"]);

    for (const locale of locales) {
      expect(anymany(["a", "b", "c"], { locale })).toBe(expected(locale));
    }
    // first locale was evicted by now — must recreate, not corrupt
    expect(anymany(["a", "b", "c"], { locale: locales[0] })).toBe(
      expected(locales[0]),
    );
  });

  it("repeated identical calls stay correct (cache hits)", () => {
    const opts = { sort: true, max: 2, locale: "en" } as const;
    const first = anymany(["c", "a", "b"], opts);
    expect(anymany(["c", "a", "b"], opts)).toBe(first);
    expect(anymany(["c", "a", "b"], opts)).toBe("a, b, and +1");
  });
});
