import { describe, it, expect, beforeEach, vi } from "vitest";
import { anywhen } from "./index";

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
