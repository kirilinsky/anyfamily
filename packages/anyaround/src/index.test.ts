import { describe, expect, it } from "vitest";
import { anyaround, anyaroundInfo } from "./index";

describe("anyaround — smart detection", () => {
  it("resolves an alpha-2 region to its name", () => {
    expect(anyaround("US", { locale: "en" })).toBe("United States");
  });

  it("resolves a language code", () => {
    expect(anyaround("en", { locale: "en" })).toBe("English");
  });

  it("resolves a script code", () => {
    expect(anyaround("Cyrl", { locale: "en" })).toBe("Cyrillic");
  });

  it("resolves a currency code to its name (not a rate)", () => {
    expect(anyaround("EUR", { locale: "en" })).toBe("Euro");
  });

  it("resolves a UN M49 numeric region", () => {
    // 419 = Latin America and the Caribbean; wording varies by ICU version.
    expect(anyaround("419", { locale: "en" })).toMatch(/Latin America/);
  });

  it("localizes the name", () => {
    // Exact ICU wording varies by version; assert it is Cyrillic and not the English name.
    const ru = anyaround("US", { locale: "ru" });
    expect(ru).not.toBe("United States");
    expect(ru).toMatch(/[А-Яа-я]/);
  });
});

describe("anyaround — display / flags", () => {
  it("returns the name only by default", () => {
    expect(anyaround("US", { locale: "en" })).toBe("United States");
  });

  it("returns the flag alone", () => {
    expect(anyaround("US", { display: "flag" })).toBe("🇺🇸");
  });

  it("prefixes the flag", () => {
    expect(anyaround("US", { locale: "en", display: "flag-name" })).toBe("🇺🇸 United States");
  });

  it("suffixes the flag", () => {
    expect(anyaround("US", { locale: "en", display: "name-flag" })).toBe("United States 🇺🇸");
  });

  it("derives the flag case-insensitively", () => {
    expect(anyaround("us", { mode: "region", display: "flag" })).toBe("🇺🇸");
  });

  it("falls back to the name when there is no flag (numeric region)", () => {
    expect(anyaround("419", { locale: "en", display: "flag" })).toMatch(/Latin America/);
  });

  it("ignores display for non-region kinds", () => {
    // A language has no flag, so display cannot fabricate one.
    expect(anyaround("en", { locale: "en", display: "flag-name" } as never)).toBe("English");
  });
});

describe("anyaround — explicit modes", () => {
  it("forces language over the region default for ambiguous case", () => {
    expect(anyaround("IT", { locale: "en", mode: "language" })).toBe("Italian");
    expect(anyaround("IT", { locale: "en", mode: "region" })).toBe("Italy");
  });

  it("resolves a calendar (never smart-detected)", () => {
    expect(anyaround("gregory", { locale: "en", mode: "calendar" })).toMatch(/Gregorian/);
  });

  it("honors languageDisplay dialect vs standard", () => {
    const dialect = anyaround("en-US", { locale: "en", mode: "language", languageDisplay: "dialect" });
    const standard = anyaround("en-US", { locale: "en", mode: "language", languageDisplay: "standard" });
    expect(dialect).toMatch(/American/);
    expect(standard).not.toMatch(/American/);
  });
});

describe("anyaroundInfo", () => {
  it("returns the structured record for a region", () => {
    expect(anyaroundInfo("US", { locale: "en" })).toEqual({
      code: "US",
      type: "region",
      name: "United States",
      flag: "🇺🇸",
    });
  });

  it("returns an empty flag for non-regions", () => {
    const info = anyaroundInfo("en", { locale: "fr" });
    expect(info.type).toBe("language");
    expect(info.flag).toBe("");
    expect(info.name).toBe("anglais");
  });

  it("canonicalizes the code casing", () => {
    expect(anyaroundInfo("us", { mode: "region", locale: "en" }).code).toBe("US");
    expect(anyaroundInfo("LATN", { mode: "script", locale: "en" }).code).toBe("Latn");
  });
});

describe("fallback", () => {
  it("returns the code for an unknown region (fallback: code)", () => {
    // QZ is a user-assigned alpha-2 shape ICU does not name.
    expect(anyaround("QZ", { mode: "region", locale: "en", fallback: "code" })).toBe("QZ");
  });

  it("returns the code via the internal guard when Intl yields nothing (fallback: none)", () => {
    // fallback "none" makes Intl return undefined; resolve()'s `?? code` still yields a string.
    expect(anyaround("QZ", { mode: "region", locale: "en", fallback: "none" })).toBe("QZ");
  });
});

describe("errors", () => {
  it("throws TypeError on empty code", () => {
    expect(() => anyaround("")).toThrow(TypeError);
    expect(() => anyaround("   ")).toThrow(TypeError);
  });

  it("throws TypeError on a non-string code", () => {
    // @ts-expect-error runtime guard for non-string input
    expect(() => anyaround(42)).toThrow(TypeError);
  });

  it("throws RangeError on an unknown mode", () => {
    // @ts-expect-error unknown mode is rejected at compile time too
    expect(() => anyaround("US", { mode: "planet" })).toThrow(RangeError);
  });
});

describe("caching", () => {
  it("returns stable results across repeated calls (cache hit)", () => {
    for (let i = 0; i < 3; i++) expect(anyaround("FR", { locale: "en" })).toBe("France");
  });

  it("survives eviction beyond CACHE_LIMIT distinct formatters", () => {
    // Force >50 distinct DisplayNames instances, then re-hit an early one.
    for (let i = 0; i < 60; i++) anyaround("US", { locale: `en-u-nu-latn-x-t${i}` });
    expect(anyaround("US", { locale: "en" })).toBe("United States");
  });
});

describe("options union (compile-time)", () => {
  it("accepts per-mode fields and rejects mismatches", () => {
    anyaround("US", { mode: "region", display: "flag-name" });
    anyaround("en", { mode: "language", languageDisplay: "standard" });
    // @ts-expect-error languageDisplay is not valid in region mode
    anyaround("US", { mode: "region", languageDisplay: "standard" });
    // @ts-expect-error display is not valid in currency mode
    anyaround("USD", { mode: "currency", display: "flag" });
    expect(true).toBe(true);
  });
});
