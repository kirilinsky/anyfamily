import { describe, it, expect, beforeEach, vi } from "vitest";
import { anywhen, anywhenParts } from "./index";

const NOW = new Date("2016-02-05T14:00:00.000Z").getTime();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

describe("relative mode — unit selection thresholds", () => {
  const rel = (input: number) =>
    anywhen(input, { mode: "relative", locale: "en" });

  it("< 45s → seconds", () => {
    expect(rel(NOW - 30_000)).toBe("30 seconds ago");
  });
  it("44s → seconds (boundary)", () => {
    expect(rel(NOW - 44_000)).toBe("44 seconds ago");
  });
  it("45s → minutes (boundary)", () => {
    expect(rel(NOW - 45_000)).toBe("1 minute ago");
  });
  it("2699s → minutes (boundary)", () => {
    expect(rel(NOW - 2_699_000)).toBe("45 minutes ago");
  });
  it("2700s → hours (boundary)", () => {
    expect(rel(NOW - 2_700_000)).toBe("1 hour ago");
  });
  it("79199s → hours", () => {
    expect(rel(NOW - 79_199_000)).toBe("22 hours ago");
  });
  it("79200s → days (boundary)", () => {
    expect(rel(NOW - 79_200_000)).toBe("yesterday");
  });
  it("6 days → week boundary", () => {
    expect(rel(NOW - 518_399_000)).toBe("6 days ago");
  });
  it("518400s → weeks (boundary)", () => {
    expect(rel(NOW - 518_400_000)).toBe("last week");
  });
  it("large diff → months", () => {
    expect(rel(NOW - 5_184_000_000)).toBe("2 months ago");
  });
  it("large diff → years", () => {
    expect(rel(NOW - 63_072_000_000)).toBe("2 years ago");
  });
});

describe("relative mode — symmetric rounding (past vs future)", () => {
  const rel = (input: number) =>
    anywhen(input, { mode: "relative", locale: "en" });

  it("1.5h rounds to 2 in both directions", () => {
    expect(rel(NOW - 5_400_000)).toBe("2 hours ago");
    expect(rel(NOW + 5_400_000)).toBe("in 2 hours");
  });
  it("2.5 days rounds to 3 in both directions", () => {
    expect(rel(NOW - 2.5 * 86_400_000)).toBe("3 days ago");
    expect(rel(NOW + 2.5 * 86_400_000)).toBe("in 3 days");
  });
});

describe("relative mode — future dates", () => {
  it("returns future relative string", () => {
    expect(
      anywhen(NOW + 3_600_000, { mode: "relative", locale: "en" }),
    ).toBe("in 1 hour");
  });
  it("tomorrow in Russian", () => {
    expect(
      anywhen(NOW + 86_400_000, { mode: "relative", locale: "ru" }),
    ).toBe("завтра");
  });
  it("in 2 weeks", () => {
    expect(
      anywhen(NOW + 14 * 86_400_000, { mode: "relative", locale: "en" }),
    ).toBe("in 2 weeks");
  });
  it("in 3 months", () => {
    expect(
      anywhen(NOW + 90 * 86_400_000, { mode: "relative", locale: "en" }),
    ).toBe("in 3 months");
  });
});

describe("relative mode — numeric option", () => {
  const rel = (input: number, numeric = true) =>
    anywhen(input, { mode: "relative", locale: "en", numeric });

  it("tomorrow → in 1 day", () => {
    expect(rel(NOW + 86_400_000)).toBe("in 1 day");
  });
  it("yesterday → 1 day ago", () => {
    expect(rel(NOW - 86_400_000)).toBe("1 day ago");
  });
  it("last week → 1 week ago", () => {
    expect(rel(NOW - 518_400_000)).toBe("1 week ago");
  });
  it("next week → in 1 week", () => {
    expect(rel(NOW + 518_400_000)).toBe("in 1 week");
  });
  it("numeric has no effect on non-auto values", () => {
    expect(rel(NOW - 2 * 3_600_000)).toBe("2 hours ago");
  });
  it("numeric works in russian", () => {
    expect(
      anywhen(NOW + 86_400_000, {
        mode: "relative",
        locale: "ru",
        numeric: true,
      }),
    ).toBe("через 1 день");
  });
  it("uses explicit now", () => {
    expect(
      anywhen(NOW - 60_000, { mode: "relative", locale: "en", now: NOW }),
    ).toBe("1 minute ago");
  });
});

describe("relative mode — input types", () => {
  const rel = (input: Date | number | string) =>
    anywhen(input, { mode: "relative", locale: "en" });

  it("accepts Date object", () => {
    expect(rel(new Date(NOW - 60_000))).toBe("1 minute ago");
  });
  it("accepts unix ms number", () => {
    expect(rel(NOW - 60_000)).toBe("1 minute ago");
  });
  it("accepts ISO string", () => {
    expect(rel(new Date(NOW - 60_000).toISOString())).toBe("1 minute ago");
  });
});

describe("absolute mode", () => {
  const date = new Date("2016-02-05T14:35:00.000Z");
  const abs = (locale: string, format?: Intl.DateTimeFormatOptions) =>
    anywhen(date, { mode: "absolute", locale, format });

  it("default format — short date", () => {
    expect(abs("en")).toMatch(/Feb/);
    expect(abs("en")).toMatch(/2016/);
  });
  it("custom — time only", () => {
    expect(abs("en", { hour: "2-digit", minute: "2-digit" })).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("custom — full date with weekday", () => {
    expect(
      abs("en", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ).toMatch(/Friday/);
  });
  it("custom — month and year", () => {
    expect(abs("en", { month: "long", year: "numeric" })).toMatch(
      /February 2016/,
    );
  });
  it("custom — year only", () => {
    expect(abs("en", { year: "numeric" })).toBe("2016");
  });
  it("russian default", () => {
    expect(abs("ru")).toMatch(/февр/);
  });
  it("german default", () => {
    expect(abs("de")).toMatch(/Feb/);
  });
  it("japanese", () => {
    expect(abs("ja")).toMatch(/2016/);
  });
  it("arabic runs without throwing", () => {
    expect(() => abs("ar")).not.toThrow();
  });
  it("uses runtime locale when omitted", () => {
    expect(anywhen(date, { mode: "absolute" })).toMatch(/2016/);
  });
  it("supports locale fallback arrays", () => {
    expect(
      anywhen(date, {
        mode: "absolute",
        locale: ["de-DE", "en"],
        format: { year: "numeric" },
      }),
    ).toBe("2016");
  });
});

describe("smart mode (default)", () => {
  it("< 45s → now", () => {
    expect(anywhen(NOW - 30_000, { locale: "en" })).toMatch(/now|ago/);
  });
  it("< 1h → relative minutes", () => {
    expect(anywhen(NOW - 600_000, { locale: "en" })).toMatch(/10 minutes ago/);
  });
  it("same day → includes today", () => {
    expect(anywhen(NOW - 2 * 3_600_000, { locale: "en" })).toMatch(/today/i);
  });
  it("same day → includes time", () => {
    expect(anywhen(NOW - 2 * 3_600_000, { locale: "en" })).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("yesterday → includes yesterday", () => {
    expect(anywhen(NOW - 24 * 3_600_000, { locale: "en" })).toMatch(
      /yesterday/i,
    );
  });
  it("yesterday → includes time", () => {
    expect(anywhen(NOW - 24 * 3_600_000, { locale: "en" })).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("3 days ago → includes weekday", () => {
    expect(anywhen(NOW - 3 * 86_400_000, { locale: "en" })).toMatch(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
    );
  });
  it("3 days ago → includes time", () => {
    expect(anywhen(NOW - 3 * 86_400_000, { locale: "en" })).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("10 days ago → absolute date", () => {
    expect(anywhen(NOW - 10 * 86_400_000, { locale: "en" })).toMatch(/2016/);
  });
  it("10 days ago → no time in absolute", () => {
    expect(anywhen(NOW - 10 * 86_400_000, { locale: "en" })).not.toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("future > 1h → relative", () => {
    expect(anywhen(NOW + 3 * 3_600_000, { locale: "en" })).toBe("in 3 hours");
  });
  it("future 2 weeks → relative", () => {
    expect(anywhen(NOW + 14 * 86_400_000, { locale: "en" })).toBe("in 2 weeks");
  });
  it("future 3 months → relative", () => {
    expect(anywhen(NOW + 90 * 86_400_000, { locale: "en" })).toBe(
      "in 3 months",
    );
  });
  it("future in russian → relative", () => {
    expect(anywhen(NOW + 14 * 86_400_000, { locale: "ru" })).toBe(
      "через 2 недели",
    );
  });
});

describe("smart mode — minute/hour rollover", () => {
  it("3599s ago never renders as 60 minutes", () => {
    expect(anywhen(NOW - 3_599_000, { locale: "en" })).not.toMatch(/60 min/);
  });
  it("3599s ago rolls over to today", () => {
    expect(anywhen(NOW - 3_599_000, { locale: "en", time: false })).toBe(
      "today",
    );
  });
  it("3599s future rolls over to in 1 hour", () => {
    expect(anywhen(NOW + 3_599_000, { locale: "en" })).toBe("in 1 hour");
  });
});

describe("smart mode — time option", () => {
  it("time:false on same day omits clock", () => {
    expect(
      anywhen(NOW - 2 * 3_600_000, { locale: "en", time: false }),
    ).not.toMatch(/\d{1,2}:\d{2}/);
  });
  it("time:false on same day keeps smart relative wording", () => {
    expect(anywhen(NOW - 2 * 3_600_000, { locale: "en", time: false })).toBe(
      "today",
    );
  });
  it("time:false on yesterday omits clock", () => {
    expect(
      anywhen(NOW - 24 * 3_600_000, { locale: "en", time: false }),
    ).not.toMatch(/\d{1,2}:\d{2}/);
  });
  it("time:false on weekday omits clock", () => {
    expect(
      anywhen(NOW - 3 * 86_400_000, { locale: "en", time: false }),
    ).not.toMatch(/\d{1,2}:\d{2}/);
  });
  it("uses explicit now", () => {
    expect(
      anywhen(NOW - 2 * 3_600_000, {
        locale: "en",
        now: NOW,
        time: false,
      }),
    ).toBe("today");
  });
  it("uses timeZone for same-day boundaries", () => {
    expect(
      anywhen("2023-12-31T23:30:00.000Z", {
        locale: "en",
        now: "2024-01-01T00:30:00.000Z",
        time: false,
        timeZone: "Europe/Belgrade",
      }),
    ).toBe("today");
  });
  it("uses calendar days for yesterday across DST boundaries", () => {
    expect(
      anywhen("2024-03-09T17:00:00.000Z", {
        locale: "en",
        now: "2024-03-10T16:30:00.000Z",
        time: false,
        timeZone: "America/New_York",
      }),
    ).toBe("yesterday");
  });
  it("uses timeZone for the clock", () => {
    expect(
      anywhen("2024-01-01T12:00:00.000Z", {
        locale: "en-US",
        now: "2024-01-01T14:00:00.000Z",
        timeZone: "Europe/Belgrade",
      }),
    ).toMatch(/today, 0?1:00/);
  });
});

describe("mode validation", () => {
  it("throws on unknown mode at runtime", () => {
    expect(() =>
      anywhen(NOW, { mode: "absolutee" as "absolute" }),
    ).toThrow(RangeError);
  });
});

describe("smart mode — locales", () => {
  it("russian same-day includes сегодня", () => {
    expect(anywhen(NOW - 2 * 3_600_000, { locale: "ru" })).toMatch(/сегодня/i);
  });
  it("russian yesterday includes вчера", () => {
    expect(anywhen(NOW - 24 * 3_600_000, { locale: "ru" })).toMatch(/вчера/i);
  });
  it("arabic runs without throwing", () => {
    expect(() => anywhen(NOW - 60_000, { locale: "ar" })).not.toThrow();
  });
  it("japanese runs without throwing", () => {
    expect(() => anywhen(NOW - 86_400_000, { locale: "ja" })).not.toThrow();
  });
  it("german runs without throwing", () => {
    expect(() => anywhen(NOW - 3 * 86_400_000, { locale: "de" })).not.toThrow();
  });
  it("chinese runs without throwing", () => {
    expect(() =>
      anywhen(NOW - 10 * 86_400_000, { locale: "zh" }),
    ).not.toThrow();
  });
});

describe("relative mode — style option", () => {
  const rel = (input: number, style?: "long" | "short" | "narrow") =>
    anywhen(input, { mode: "relative", locale: "en", style });

  it("defaults to long", () => {
    expect(rel(NOW - 3 * 3_600_000)).toBe("3 hours ago");
  });
  it("short → abbreviated unit", () => {
    expect(rel(NOW - 3 * 3_600_000, "short")).toBe("3 hr. ago");
  });
  it("narrow → tightest unit", () => {
    expect(rel(NOW - 3 * 3_600_000, "narrow")).toBe("3h ago");
  });
  it("short keeps auto phrases like yesterday", () => {
    expect(rel(NOW - 86_400_000, "short")).toBe("yesterday");
  });
  it("composes with numeric", () => {
    expect(
      anywhen(NOW - 86_400_000, {
        mode: "relative",
        locale: "en",
        style: "short",
        numeric: true,
      }),
    ).toBe("1 day ago");
  });
});

describe("smart mode — style option", () => {
  it("short shortens sub-hour relative wording", () => {
    expect(anywhen(NOW - 600_000, { locale: "en", style: "short" })).toBe(
      "10 min. ago",
    );
  });
  it("narrow shortens sub-hour relative wording", () => {
    expect(anywhen(NOW - 600_000, { locale: "en", style: "narrow" })).toBe(
      "10m ago",
    );
  });
  it("short shortens future relative wording", () => {
    expect(anywhen(NOW + 3 * 3_600_000, { locale: "en", style: "short" })).toBe(
      "in 3 hr.",
    );
  });
  it("style leaves clock-bearing same-day label intact", () => {
    expect(anywhen(NOW - 2 * 3_600_000, { locale: "en", style: "short" })).toMatch(
      /today/i,
    );
  });
});

describe("invalid input", () => {
  it("throws RangeError on unparseable string", () => {
    expect(() => anywhen("not a date")).toThrow(RangeError);
    expect(() => anywhen("not a date")).toThrow("Invalid date: not a date");
  });
  it("throws RangeError on invalid Date object", () => {
    expect(() => anywhen(new Date("nope"))).toThrow(RangeError);
  });
  it("throws RangeError on NaN timestamp", () => {
    expect(() => anywhen(NaN)).toThrow(RangeError);
  });
  it("throws RangeError on invalid `now`", () => {
    expect(() => anywhen(NOW, { now: "garbage" })).toThrow(RangeError);
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

  it("relative output stays correct past the cache limit", () => {
    for (const locale of locales) {
      expect(anywhen(NOW - 30_000, { mode: "relative", locale })).toBe(
        "30 seconds ago",
      );
    }
    // first locale was evicted by now — must recreate, not corrupt
    expect(anywhen(NOW - 30_000, { mode: "relative", locale: locales[0] })).toBe(
      "30 seconds ago",
    );
  });

  it("absolute output stays correct past the cache limit", () => {
    // reference: a fresh, uncached formatter per locale
    const expected = (locale: string) =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(NOW);

    for (const locale of locales) {
      expect(anywhen(NOW, { mode: "absolute", locale })).toBe(expected(locale));
    }
    // first locale was evicted by now — must recreate, not corrupt
    expect(anywhen(NOW, { mode: "absolute", locale: locales[0] })).toBe(
      expected(locales[0]),
    );
  });
});

describe("absolute mode — format + timeZone combined", () => {
  it("applies timeZone to a custom format", () => {
    expect(
      anywhen(NOW, {
        mode: "absolute",
        locale: "en",
        timeZone: "Asia/Tokyo",
        format: { hour: "2-digit", minute: "2-digit", hour12: false },
      }),
    ).toBe("23:00");
  });
  it("timeZone option wins over format.timeZone", () => {
    expect(
      anywhen(NOW, {
        mode: "absolute",
        locale: "en",
        timeZone: "Asia/Tokyo",
        format: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        },
      }),
    ).toBe("23:00");
  });
});

describe("thresholds option", () => {
  it("widens the seconds window in relative mode", () => {
    expect(
      anywhen(NOW - 60_000, {
        mode: "relative",
        locale: "en",
        thresholds: { second: 90 },
      }),
    ).toBe("60 seconds ago");
  });
  it("widens the minutes window in relative mode", () => {
    expect(
      anywhen(NOW - 3_000_000, {
        mode: "relative",
        locale: "en",
        thresholds: { minute: 5400 },
      }),
    ).toBe("50 minutes ago");
  });
  it("partial override keeps other thresholds at defaults", () => {
    const opts = { mode: "relative", locale: "en", thresholds: { minute: 5400 } } as const;
    expect(anywhen(NOW - 44_000, opts)).toBe("44 seconds ago");
    expect(anywhen(NOW - 2 * 3_600_000, opts)).toBe("2 hours ago");
  });
  it("widens the smart-mode 'now' window via thresholds.second", () => {
    expect(
      anywhen(NOW - 60_000, { locale: "en", thresholds: { second: 90 } }),
    ).toBe("now");
  });
  it("applies to future dates in smart mode", () => {
    expect(
      anywhen(NOW + 7_200_000, { locale: "en", thresholds: { minute: 7500 } }),
    ).toBe("in 120 minutes");
  });
  it("narrows the smart-mode minutes window for past dates via thresholds.minute", () => {
    const opts = { locale: "en", time: false, thresholds: { minute: 1800 } } as const;
    expect(anywhen(NOW - 3_000_000, opts)).toBe("today");
    expect(anywhen(NOW - 1_500_000, opts)).toBe("25 minutes ago");
  });
  it("does not change default behavior when omitted", () => {
    expect(anywhen(NOW - 60_000, { mode: "relative", locale: "en" })).toBe(
      "1 minute ago",
    );
  });
});

describe("anywhenParts", () => {
  it("joined parts equal the anywhen string in every mode", () => {
    const cases: Parameters<typeof anywhen>[] = [
      [NOW - 3_600_000, { mode: "relative", locale: "en" }],
      [NOW - 30_000, { mode: "relative", locale: "ru", numeric: true }],
      [NOW, { mode: "absolute", locale: "en" }],
      [NOW, { mode: "absolute", locale: "ja", timeZone: "Asia/Tokyo" }],
      [NOW - 20_000, { locale: "en" }],
      [NOW - 2 * 3_600_000, { locale: "en", timeZone: "UTC" }],
      [NOW - 86_400_000, { locale: "de", timeZone: "UTC" }],
      [NOW - 3 * 86_400_000, { locale: "en", timeZone: "UTC" }],
      [NOW - 30 * 86_400_000, { locale: "en", timeZone: "UTC" }],
      [NOW + 14 * 86_400_000, { locale: "en" }],
    ];
    // V8 quirk: format() maps U+202F/U+00A0 to ASCII space, formatToParts()
    // keeps the originals — normalize both sides before comparing.
    const norm = (s: string) => s.replace(/[  ]/g, " ");
    for (const [input, options] of cases) {
      const parts = anywhenParts(input, options);
      expect(norm(parts.map((p) => p.value).join(""))).toBe(
        norm(anywhen(input, options)),
      );
    }
  });

  it("exposes the unit on relative numeric parts", () => {
    const parts = anywhenParts(NOW - 3_600_000, {
      mode: "relative",
      locale: "en",
    });
    const integer = parts.find((p) => p.type === "integer");
    expect(integer?.value).toBe("1");
    expect(integer?.unit).toBe("hour");
  });

  it("returns typed date parts in absolute mode", () => {
    const parts = anywhenParts(NOW, { mode: "absolute", locale: "en" });
    expect(parts.map((p) => p.type)).toEqual([
      "month",
      "literal",
      "day",
      "literal",
      "year",
    ]);
  });

  it("splits smart calendar labels into label, separator, and clock", () => {
    const parts = anywhenParts(NOW - 2 * 3_600_000, {
      locale: "en",
      timeZone: "UTC",
    });
    expect(parts.some((p) => p.type === "literal" && p.value === ", ")).toBe(
      true,
    );
    expect(parts.some((p) => p.type === "hour")).toBe(true);
  });

  it("drops the clock parts with time: false", () => {
    const parts = anywhenParts(NOW - 2 * 3_600_000, {
      locale: "en",
      timeZone: "UTC",
      time: false,
    });
    expect(parts.some((p) => p.type === "hour")).toBe(false);
  });

  it("throws the same RangeError as anywhen on invalid input", () => {
    expect(() => anywhenParts("not a date")).toThrow(RangeError);
  });
});
