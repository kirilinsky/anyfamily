import { describe, expect, it } from "vitest";
import { anylocale } from "./index";

describe("feature detection", () => {
  it("reports whether Intl Locale Info exists on this runtime", () => {
    const probe = new Intl.Locale("en") as unknown as Record<string, unknown>;
    const present =
      typeof probe.getWeekInfo === "function" || probe.weekInfo !== undefined;
    expect(anylocale.supported).toBe(present);
  });
});

describe.skipIf(!anylocale.supported)("direction", () => {
  it("reports rtl for right-to-left scripts", () => {
    expect(anylocale("ar-EG").direction).toBe("rtl");
    expect(anylocale("he-IL").direction).toBe("rtl");
    expect(anylocale("fa-IR").direction).toBe("rtl");
  });

  it("reports ltr for left-to-right scripts", () => {
    expect(anylocale("en-US").direction).toBe("ltr");
    expect(anylocale("ru-RU").direction).toBe("ltr");
    expect(anylocale("ja-JP").direction).toBe("ltr");
  });

  it("follows the script subtag, not the language", () => {
    // Serbian in Latin script is ltr; the language alone would not say so.
    expect(anylocale("sr-Latn-RS").direction).toBe("ltr");
  });
});

describe.skipIf(!anylocale.supported)("week info", () => {
  it("distinguishes regions of the same language", () => {
    // The reason a hardcoded "en -> Monday" table is wrong.
    expect(anylocale("en-US").weekStart).toBe(7);
    expect(anylocale("en-GB").weekStart).toBe(1);
  });

  it("uses ISO numbering, where 1 is Monday and 7 is Sunday", () => {
    expect(anylocale("ru-RU").weekStart).toBe(1);
    expect(anylocale("en-US").weekStart).toBe(7);
  });

  it("reports weekends that are not Saturday and Sunday", () => {
    expect(anylocale("ar-EG").weekend).toEqual([5, 6]);
  });

  it("reports a one-day weekend", () => {
    // Anything assuming a pair breaks here.
    expect(anylocale("fa-IR").weekend).toEqual([5]);
  });

  it("exposes minimalDays as a number", () => {
    expect(typeof anylocale("en-US").minimalDays).toBe("number");
  });
});

describe.skipIf(!anylocale.supported)("lists", () => {
  it("reports calendars with the locale's preferred one first", () => {
    const { calendars } = anylocale("fa-IR");
    expect(calendars.length).toBeGreaterThan(0);
    expect(calendars[0]).toBe("persian");
  });

  it("reports time zones for a region tag", () => {
    expect(anylocale("ar-EG").timeZones).toContain("Africa/Cairo");
  });

  it("reports no time zones for a language-only tag", () => {
    expect(anylocale("en").timeZones).toEqual([]);
  });

  it("reports hour cycles, which differ between regions of one language", () => {
    expect(anylocale("en-US").hourCycles[0]).toBe("h12");
    expect(anylocale("en-GB").hourCycles[0]).toBe("h23");
  });

  it("reports numbering systems independently of direction", () => {
    // Both rtl, different digits — so rtl does not imply Arabic numerals.
    expect(anylocale("ar-EG").numberingSystems[0]).toBe("arab");
    expect(anylocale("he-IL").numberingSystems[0]).toBe("latn");
  });
});

describe.skipIf(!anylocale.supported)("tags and fallback chains", () => {
  it("canonicalises the tag it resolved to", () => {
    expect(anylocale("en-us").tag).toBe("en-US");
  });

  it("skips a tag the runtime has no data for", () => {
    // "xx-Nope" parses as valid BCP 47, so parsing alone would stop here.
    expect(anylocale(["xx-Nope", "de-DE"]).tag).toBe("de-DE");
  });

  it("keeps the first tag when the whole chain lacks data", () => {
    expect(anylocale(["zz-Fake"]).tag).toBe("zz-Fake");
  });

  it("throws on an empty chain", () => {
    expect(() => anylocale([])).toThrow(TypeError);
  });

  it("throws on a malformed tag", () => {
    expect(() => anylocale("!!!")).toThrow(RangeError);
  });
});

describe.skipIf(!anylocale.supported)("the returned record", () => {
  it("spreads and serialises like a plain object", () => {
    const info = anylocale("en-US");
    const keys = Object.keys({ ...info });
    expect(keys).toEqual([
      "tag",
      "direction",
      "weekStart",
      "weekend",
      "minimalDays",
      "calendars",
      "timeZones",
      "hourCycles",
      "numberingSystems",
    ]);
    expect(JSON.parse(JSON.stringify(info)).direction).toBe("ltr");
  });

  it("returns the same record for the same locale", () => {
    expect(anylocale("en-US")).toBe(anylocale("en-US"));
  });

  it("treats differently-cased tags as one locale", () => {
    expect(anylocale("en-us")).toBe(anylocale("en-US"));
  });
});

describe("public surface", () => {
  it("exports exactly one name, with extras hanging off it", async () => {
    const mod = await import("./index");
    expect(Object.keys(mod)).toEqual(["anylocale"]);
  });

  it("is callable and carries the support flag", () => {
    expect(typeof anylocale).toBe("function");
    expect(typeof anylocale.supported).toBe("boolean");
  });
});
