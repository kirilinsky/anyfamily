import { describe, it, expect } from "vitest";
import { anyamount, anyamountParts, type AnyamountOptions } from "./index";

// Exact Intl output strings vary between ICU versions, so assertions here
// use parts, regexes, and reassembly instead of full-string snapshots
// wherever the output is not guaranteed stable.

const partTypes = (parts: { type: string }[]) => parts.map((p) => p.type);

describe("smart mode — plain numbers below the compact threshold", () => {
  it("integers stay plain", () => {
    expect(anyamount(42, { locale: "en" })).toBe("42");
    expect(anyamount(0, { locale: "en" })).toBe("0");
  });

  it("decimals keep at most 2 fraction digits", () => {
    expect(anyamount(0.1234, { locale: "en" })).toBe("0.12");
    expect(anyamount(3.14159, { locale: "en" })).toBe("3.14");
  });

  it("groups thousands below the threshold", () => {
    const parts = anyamountParts(9999, { locale: "en" });
    expect(partTypes(parts)).toContain("group");
    expect(partTypes(parts)).not.toContain("compact");
  });

  it("negative plain numbers keep their sign", () => {
    const parts = anyamountParts(-42.5, { locale: "en" });
    expect(partTypes(parts)).toContain("minusSign");
  });
});

describe("smart mode — compact notation at |value| >= 10000", () => {
  it("10000 switches to compact", () => {
    const parts = anyamountParts(10_000, { locale: "en" });
    expect(partTypes(parts)).toContain("compact");
  });

  it("millions render with 1 fraction digit", () => {
    expect(anyamount(1_234_567, { locale: "en" })).toMatch(/^1[.,]2\s?M$/);
  });

  it("negative values also go compact", () => {
    const parts = anyamountParts(-1_234_567, { locale: "en" });
    expect(partTypes(parts)).toContain("minusSign");
    expect(partTypes(parts)).toContain("compact");
  });

  it("style long spells the magnitude out", () => {
    expect(anyamount(1_234_567, { locale: "en", style: "long" })).toMatch(
      /million/,
    );
  });

  it("digits overrides the compact default", () => {
    expect(anyamount(1_234_567, { locale: "en", digits: 2 })).toMatch(
      /^1[.,]23\s?M$/,
    );
  });
});

describe("smart mode — locales", () => {
  it("ru compact uses localized magnitude", () => {
    const out = anyamount(1_234_567, { locale: "ru" });
    expect(out).toMatch(/млн/);
  });

  it("de compact uses localized magnitude", () => {
    const out = anyamount(1_234_567, { locale: "de" });
    expect(out).toMatch(/Mio/);
  });

  it("ja compact groups by 万", () => {
    const out = anyamount(1_234_567, { locale: "ja" });
    expect(out).toMatch(/万/);
  });

  it("de decimals use comma separator", () => {
    expect(anyamount(0.1234, { locale: "de" })).toBe("0,12");
  });

  it("accepts a locale fallback array", () => {
    expect(anyamount(42, { locale: ["sr-Latn-RS", "en"] })).toBe("42");
  });
});

describe("currency mode", () => {
  it("throws a TypeError without the currency option", () => {
    // the union forbids this at compile time; JS callers hit the runtime guard
    // @ts-expect-error — currency mode requires `currency`
    expect(() => anyamount(1999, { mode: "currency" })).toThrow(TypeError);
    // @ts-expect-error — currency mode requires `currency`
    expect(() => anyamount(1999, { mode: "currency" })).toThrow(/currency/);
  });

  it("emits a currency part and the full value", () => {
    const parts = anyamountParts(1999, {
      mode: "currency",
      currency: "EUR",
      locale: "en",
    });
    expect(partTypes(parts)).toContain("currency");
    expect(parts.find((p) => p.type === "currency")?.value).toBe("€");
    // full value, not compacted
    expect(parts.filter((p) => p.type === "integer").map((p) => p.value).join("")).toBe("1999");
  });

  it("keeps the currency's own fraction digits by default", () => {
    // EUR → 2, JPY → 0
    const eur = anyamountParts(1999, { mode: "currency", currency: "EUR", locale: "en" });
    expect(eur.find((p) => p.type === "fraction")?.value).toBe("00");
    const jpy = anyamountParts(1999, { mode: "currency", currency: "JPY", locale: "ja" });
    expect(partTypes(jpy)).not.toContain("fraction");
  });

  it("digits caps fraction digits", () => {
    const parts = anyamountParts(1999.99, {
      mode: "currency",
      currency: "EUR",
      locale: "en",
      digits: 0,
    });
    expect(partTypes(parts)).not.toContain("fraction");
  });

  it("localizes across en, ru, de, ja", () => {
    for (const locale of ["en", "ru", "de", "ja"]) {
      const parts = anyamountParts(1999, { mode: "currency", currency: "USD", locale });
      expect(partTypes(parts)).toContain("currency");
      expect(partTypes(parts)).toContain("integer");
    }
  });

  it("ignores unit-mode options passed from JS", () => {
    const withStray = { mode: "currency", currency: "USD", unit: "gigabyte", locale: "en" } as const;
    expect(anyamount(5, withStray)).toBe(
      anyamount(5, { mode: "currency", currency: "USD", locale: "en" }),
    );
  });
});

describe("unit mode", () => {
  it("throws a TypeError without the unit option", () => {
    // the union forbids this at compile time; JS callers hit the runtime guard
    // @ts-expect-error — unit mode requires `unit`
    expect(() => anyamount(3.2, { mode: "unit" })).toThrow(TypeError);
    // @ts-expect-error — unit mode requires `unit`
    expect(() => anyamount(3.2, { mode: "unit" })).toThrow(/unit/);
  });

  it("formats bytes with a short unit", () => {
    expect(anyamount(3.2, { mode: "unit", unit: "gigabyte", locale: "en" })).toMatch(
      /^3[.,]2\s?GB$/,
    );
  });

  it("formats compound per-units", () => {
    expect(
      anyamount(120, { mode: "unit", unit: "kilometer-per-hour", locale: "en" }),
    ).toMatch(/120\s?km\/h/);
  });

  it("style long spells the unit out", () => {
    expect(
      anyamount(3.2, { mode: "unit", unit: "gigabyte", locale: "en", style: "long" }),
    ).toMatch(/gigabyte/);
  });

  it("style narrow tightens the output", () => {
    const narrow = anyamount(5, { mode: "unit", unit: "kilometer", locale: "en", style: "narrow" });
    const long = anyamount(5, { mode: "unit", unit: "kilometer", locale: "en", style: "long" });
    expect(narrow.length).toBeLessThan(long.length);
  });

  it("caps fraction digits at 2 by default, digits overrides", () => {
    expect(anyamount(3.14159, { mode: "unit", unit: "meter", locale: "en" })).toMatch(
      /^3[.,]14\s?m$/,
    );
    expect(
      anyamount(3.14159, { mode: "unit", unit: "meter", locale: "en", digits: 4 }),
    ).toMatch(/^3[.,]1416\s?m$/);
  });

  it("localizes units across en, ru, de, ja", () => {
    for (const locale of ["en", "ru", "de", "ja"]) {
      const parts = anyamountParts(3.2, { mode: "unit", unit: "gigabyte", locale });
      expect(partTypes(parts)).toContain("unit");
      expect(partTypes(parts)).toContain("integer");
    }
  });

  it("ignores currency-mode options passed from JS", () => {
    const withStray = { mode: "unit", unit: "meter", currency: "EUR", locale: "en" } as const;
    expect(anyamount(5, withStray)).toBe(
      anyamount(5, { mode: "unit", unit: "meter", locale: "en" }),
    );
  });
});

describe("anyamountParts", () => {
  it("joining part values reproduces the string output", () => {
    const cases: [number, Parameters<typeof anyamount>[1]][] = [
      [1_234_567, { locale: "en" }],
      [42, { locale: "ja" }],
      [1999, { mode: "currency", currency: "EUR", locale: "de" }],
      [120, { mode: "unit", unit: "kilometer-per-hour", locale: "ru" }],
    ];
    for (const [value, options] of cases) {
      const joined = anyamountParts(value, options)
        .map((p) => p.value)
        .join("");
      expect(joined).toBe(anyamount(value, options));
    }
  });

  it("passes Intl part objects through unchanged", () => {
    const parts = anyamountParts(42, { locale: "en" });
    expect(parts).toEqual([{ type: "integer", value: "42" }]);
  });
});

describe("bigint values", () => {
  it("smart mode formats small bigints plain", () => {
    expect(anyamount(42n, { locale: "en" })).toBe("42");
    const parts = anyamountParts(9999n, { locale: "en" });
    expect(partTypes(parts)).not.toContain("compact");
  });

  it("smart mode compacts big bigints, including beyond MAX_SAFE_INTEGER", () => {
    expect(anyamount(1_234_567n, { locale: "en" })).toMatch(/^1[.,]2\s?M$/);
    const parts = anyamountParts(123_456_789_012_345_678_901n, { locale: "en" });
    expect(partTypes(parts)).toContain("compact");
  });

  it("negative bigints keep their sign", () => {
    const parts = anyamountParts(-1_234_567n, { locale: "en" });
    expect(partTypes(parts)).toContain("minusSign");
    expect(partTypes(parts)).toContain("compact");
  });

  it("works in currency and unit modes", () => {
    const eur = anyamountParts(1999n, { mode: "currency", currency: "EUR", locale: "en" });
    expect(partTypes(eur)).toContain("currency");
    expect(anyamount(3n, { mode: "unit", unit: "gigabyte", locale: "en" })).toMatch(
      /^3\s?GB$/,
    );
  });

  it("joining part values reproduces the string output", () => {
    const joined = anyamountParts(1_234_567n, { locale: "en" })
      .map((p) => p.value)
      .join("");
    expect(joined).toBe(anyamount(1_234_567n, { locale: "en" }));
  });
});

describe("input validation", () => {
  it("throws a TypeError on NaN", () => {
    expect(() => anyamount(NaN)).toThrow(TypeError);
  });

  it("formats ±Infinity as the locale infinity symbol", () => {
    expect(anyamount(Infinity, { locale: "en" })).toBe("∞");
    const parts = anyamountParts(-Infinity, { locale: "en" });
    expect(partTypes(parts)).toContain("minusSign");
    expect(partTypes(parts)).toContain("infinity");
  });

  it("throws a TypeError on non-number input", () => {
    expect(() => anyamount("42" as unknown as number)).toThrow(TypeError);
  });

  it("throws a RangeError on unknown mode", () => {
    expect(() =>
      anyamount(42, { mode: "percent" as unknown as "smart" }),
    ).toThrow(RangeError);
  });

  it("defaults to the runtime locale when locale is omitted", () => {
    expect(typeof anyamount(42)).toBe("string");
    expect(anyamountParts(42).length).toBeGreaterThan(0);
  });
});

describe("options union (compile-time)", () => {
  it("rejects mode/option mismatches at the type level", () => {
    // @ts-expect-error — currency mode requires `currency`
    const missingCurrency: AnyamountOptions = { mode: "currency" };
    // @ts-expect-error — unit mode requires `unit`
    const missingUnit: AnyamountOptions = { mode: "unit" };
    // @ts-expect-error — smart mode does not take `currency`
    const strayCurrency: AnyamountOptions = { currency: "EUR" };
    // @ts-expect-error — currency mode does not take `style`
    const strayStyle: AnyamountOptions = { mode: "currency", currency: "EUR", style: "long" };
    void [missingCurrency, missingUnit, strayCurrency, strayStyle];
    // valid shapes still compile
    const ok: AnyamountOptions[] = [
      {},
      { mode: "smart", style: "long", digits: 1 },
      { mode: "currency", currency: "JPY", locale: "ja" },
      { mode: "unit", unit: "kilometer-per-hour", style: "narrow" },
    ];
    expect(ok.length).toBe(4);
  });
});

describe("formatter cache", () => {
  it("returns identical output on repeated calls", () => {
    const a = anyamount(1_234_567, { locale: "en" });
    const b = anyamount(1_234_567, { locale: "en" });
    expect(a).toBe(b);
  });

  it("survives eviction past the cache limit", () => {
    for (let i = 0; i < 60; i++) {
      anyamount(42, { locale: "en", digits: i % 20 });
    }
    expect(anyamount(0.1234, { locale: "en" })).toBe("0.12");
  });
});
