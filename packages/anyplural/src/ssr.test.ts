import { describe, expect, it } from "vitest";
import { anyplural, anypluralParts } from "./index";

// anyplural has no time dependency, so its only SSR risk is the runtime locale
// drifting between server and client. Passing `locale` pins output on both.
describe("SSR-safe formatting", () => {
  it("is deterministic when locale is passed explicitly", () => {
    const forms = { one: "год", few: "года", many: "лет" };
    expect(anyplural(5, forms, { locale: "ru" })).toBe("5 лет");
    expect(anyplural(5, forms, { locale: "ru" })).toBe("5 лет");
  });

  it("produces identical parts across calls", () => {
    const a = anypluralParts(1500, { one: "item", other: "items" }, { locale: "en" });
    const b = anypluralParts(1500, { one: "item", other: "items" }, { locale: "en" });
    expect(a).toEqual(b);
  });

  it("does not read the ambient locale when one is given", () => {
    // Same input, different locale → different grouping, proving the pinned
    // locale wins over any runtime default.
    expect(anyplural(1500, { other: "x" }, { locale: "en" })).toBe("1,500 x");
    expect(anyplural(1500, { other: "x" }, { locale: "de" })).toBe("1.500 x");
  });
});
