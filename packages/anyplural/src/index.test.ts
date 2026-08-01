import { describe, expect, it } from "vitest";
import { anyplural } from "./index";

describe("anyplural — cardinal", () => {
  it("English one/other", () => {
    expect(anyplural(1, { one: "item", other: "items" })).toBe("1 item");
    expect(anyplural(5, { one: "item", other: "items" })).toBe("5 items");
    expect(anyplural(0, { one: "item", other: "items" })).toBe("0 items");
  });

  it("Russian one/few/many", () => {
    const ru = { one: "год", few: "года", many: "лет" } as const;
    expect(anyplural(1, ru, { locale: "ru" })).toBe("1 год");
    expect(anyplural(2, ru, { locale: "ru" })).toBe("2 года");
    expect(anyplural(5, ru, { locale: "ru" })).toBe("5 лет");
    expect(anyplural(21, ru, { locale: "ru" })).toBe("21 год");
    expect(anyplural(111, ru, { locale: "ru" })).toBe("111 лет");
  });

  it("negative counts pick the right form", () => {
    expect(anyplural(-1, { one: "item", other: "items" })).toBe("-1 item");
    expect(anyplural(-3, { one: "item", other: "items" })).toBe("-3 items");
  });
});

describe("anyplural — exact-zero shortcut", () => {
  it("returns the zero form verbatim, no number", () => {
    expect(
      anyplural(0, { zero: "нет писем", one: "письмо", many: "писем" }, { locale: "ru" }),
    ).toBe("нет писем");
  });

  it("only fires on exact 0, not on the CLDR path", () => {
    const f = { zero: "no items", one: "item", other: "items" };
    expect(anyplural(1, f)).toBe("1 item");
    expect(anyplural(5, f)).toBe("5 items");
  });

  it("without a zero form, 0 goes through select", () => {
    expect(anyplural(0, { one: "item", other: "items" })).toBe("0 items");
  });
});

describe("anyplural — ordinal", () => {
  const en = { one: "st", two: "nd", few: "rd", other: "th" } as const;
  it("attaches the suffix with no separator", () => {
    expect(anyplural(1, en, { type: "ordinal" })).toBe("1st");
    expect(anyplural(2, en, { type: "ordinal" })).toBe("2nd");
    expect(anyplural(3, en, { type: "ordinal" })).toBe("3rd");
    expect(anyplural(4, en, { type: "ordinal" })).toBe("4th");
    expect(anyplural(11, en, { type: "ordinal" })).toBe("11th");
    expect(anyplural(23, en, { type: "ordinal" })).toBe("23rd");
  });
});

describe("anyplural — fallback chain", () => {
  it("few falls through to many then other", () => {
    // ru select(2) → "few"; with only many defined it resolves to many.
    expect(anyplural(2, { many: "штук", other: "штука" }, { locale: "ru" })).toBe(
      "2 штук",
    );
  });

  it("any missing category lands on other", () => {
    expect(anyplural(2, { other: "x" }, { locale: "ru" })).toBe("2 x");
    expect(anyplural(5, { other: "x" }, { locale: "ru" })).toBe("5 x");
  });
});

describe("anyplural — number formatting", () => {
  it("groups digits via Intl.NumberFormat", () => {
    expect(anyplural(1500, { one: "item", other: "items" }, { locale: "en" })).toBe(
      "1,500 items",
    );
  });

  it("honors format options", () => {
    expect(
      anyplural(
        1000,
        { one: "item", other: "items" },
        { locale: "en", format: { notation: "compact" } },
      ),
    ).toBe("1K items");
  });

  it("localizes digits", () => {
    expect(anyplural(3, { other: "th" }, { locale: "ar-EG", type: "ordinal" })).toContain(
      "٣",
    );
  });
});

describe("anyplural — validation", () => {
  it("throws on non-finite counts", () => {
    expect(() => anyplural(NaN, { other: "x" })).toThrow(RangeError);
    expect(() => anyplural(Infinity, { other: "x" })).toThrow(RangeError);
    // @ts-expect-error runtime guard for JS callers
    expect(() => anyplural("5", { other: "x" })).toThrow(RangeError);
  });
});

describe("anyplural.parts", () => {
  it("splits number from word", () => {
    expect(anyplural.parts(5, { one: "item", other: "items" }, { locale: "en" })).toEqual([
      { type: "integer", value: "5" },
      { type: "literal", value: " items" },
    ]);
  });

  it("emits grouped number parts", () => {
    const parts = anyplural.parts(1500, { other: "items" }, { locale: "en" });
    expect(parts.map((p) => p.value).join("")).toBe("1,500 items");
    expect(parts.some((p) => p.type === "group")).toBe(true);
  });

  it("zero shortcut is a single literal", () => {
    expect(anyplural.parts(0, { zero: "нет писем", other: "письма" })).toEqual([
      { type: "literal", value: "нет писем" },
    ]);
  });

  it("ordinal has no separator literal", () => {
    expect(
      anyplural.parts(3, { one: "st", two: "nd", few: "rd", other: "th" }, {
        type: "ordinal",
      }),
    ).toEqual([
      { type: "integer", value: "3" },
      { type: "literal", value: "rd" },
    ]);
  });
});

describe("public surface", () => {
  it("exports exactly one name, with extras hanging off it", async () => {
    const mod = await import("./index");
    expect(Object.keys(mod)).toEqual(["anyplural"]);
  });

  it("parts join back into the plain call's output", () => {
    const forms = { one: "item", other: "items" };
    const opts = { locale: "en" } as const;
    expect(anyplural.parts(5, forms, opts).map((p) => p.value).join("")).toBe(
      anyplural(5, forms, opts),
    );
  });
});
