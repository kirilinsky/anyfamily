import { describe, it, expect, beforeEach, vi } from "vitest";
import { anyago, anydate, anywhen, anywhere } from "./index";

const NOW = new Date("2016-02-05T14:00:00.000Z").getTime();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

describe("anyago — unit selection thresholds", () => {
  it("< 45s → seconds", () => {
    expect(anyago(NOW - 30_000, "en")).toBe("30 seconds ago");
  });
  it("44s → seconds (boundary)", () => {
    expect(anyago(NOW - 44_000, "en")).toBe("44 seconds ago");
  });
  it("45s → minutes (boundary)", () => {
    expect(anyago(NOW - 45_000, "en")).toBe("1 minute ago");
  });
  it("2699s → minutes (boundary)", () => {
    expect(anyago(NOW - 2_699_000, "en")).toBe("45 minutes ago");
  });
  it("2700s → hours (boundary)", () => {
    expect(anyago(NOW - 2_700_000, "en")).toBe("1 hour ago");
  });
  it("79199s → hours", () => {
    expect(anyago(NOW - 79_199_000, "en")).toBe("22 hours ago");
  });
  it("79200s → days (boundary)", () => {
    expect(anyago(NOW - 79_200_000, "en")).toBe("yesterday");
  });
  it("6 days → week boundary", () => {
    expect(anyago(NOW - 518_399_000, "en")).toBe("6 days ago");
  });
  it("518400s → weeks (boundary)", () => {
    expect(anyago(NOW - 518_400_000, "en")).toBe("last week");
  });
  it("large diff → months", () => {
    expect(anyago(NOW - 5_184_000_000, "en")).toBe("2 months ago");
  });
  it("large diff → years", () => {
    expect(anyago(NOW - 63_072_000_000, "en")).toBe("2 years ago");
  });
});

describe("anyago — future dates", () => {
  it("returns future relative string", () => {
    expect(anyago(NOW + 3_600_000, "en")).toBe("in 1 hour");
  });
  it("tomorrow in Russian", () => {
    expect(anyago(NOW + 86_400_000, "ru")).toBe("завтра");
  });
  it("in 2 weeks", () => {
    expect(anyago(NOW + 14 * 86_400_000, "en")).toBe("in 2 weeks");
  });
  it("in 3 months", () => {
    expect(anyago(NOW + 90 * 86_400_000, "en")).toBe("in 3 months");
  });
});

describe("anyago — numeric option", () => {
  it("tomorrow → in 1 day", () => {
    expect(anyago(NOW + 86_400_000, "en", true)).toBe("in 1 day");
  });
  it("yesterday → 1 day ago", () => {
    expect(anyago(NOW - 86_400_000, "en", true)).toBe("1 day ago");
  });
  it("last week → 1 week ago", () => {
    expect(anyago(NOW - 518_400_000, "en", true)).toBe("1 week ago");
  });
  it("next week → in 1 week", () => {
    expect(anyago(NOW + 518_400_000, "en", true)).toBe("in 1 week");
  });
  it("numeric has no effect on non-auto values", () => {
    expect(anyago(NOW - 2 * 3_600_000, "en", true)).toBe("2 hours ago");
  });
  it("numeric works in russian", () => {
    expect(anyago(NOW + 86_400_000, "ru", true)).toBe("через 1 день");
  });
});

describe("anyago — input types", () => {
  it("accepts Date object", () => {
    expect(anyago(new Date(NOW - 60_000), "en")).toBe("1 minute ago");
  });
  it("accepts unix ms number", () => {
    expect(anyago(NOW - 60_000, "en")).toBe("1 minute ago");
  });
  it("accepts ISO string", () => {
    expect(anyago(new Date(NOW - 60_000).toISOString(), "en")).toBe(
      "1 minute ago",
    );
  });
});

describe("anydate", () => {
  const date = new Date("2016-02-05T14:35:00.000Z");

  it("default options — short date", () => {
    expect(anydate(date, "en")).toMatch(/Feb/);
    expect(anydate(date, "en")).toMatch(/2016/);
  });
  it("custom — time only", () => {
    expect(anydate(date, "en", { hour: "2-digit", minute: "2-digit" })).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("custom — full date with weekday", () => {
    expect(
      anydate(date, "en", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ).toMatch(/Friday/);
  });
  it("custom — month and year", () => {
    expect(anydate(date, "en", { month: "long", year: "numeric" })).toMatch(
      /February 2016/,
    );
  });
  it("custom — year only", () => {
    expect(anydate(date, "en", { year: "numeric" })).toBe("2016");
  });
  it("russian default", () => {
    expect(anydate(date, "ru")).toMatch(/февр/);
  });
  it("german default", () => {
    expect(anydate(date, "de")).toMatch(/Feb/);
  });
  it("japanese", () => {
    expect(anydate(date, "ja")).toMatch(/2016/);
  });
  it("arabic runs without throwing", () => {
    expect(() => anydate(date, "ar")).not.toThrow();
  });
});

describe("anywhen — mode switching", () => {
  it("< 45s → now", () => {
    expect(anywhen(NOW - 30_000, "en")).toMatch(/now|ago/);
  });
  it("< 1h → relative minutes", () => {
    expect(anywhen(NOW - 600_000, "en")).toMatch(/10 minutes ago/);
  });
  it("same day → includes today", () => {
    expect(anywhen(NOW - 2 * 3_600_000, "en")).toMatch(/today/i);
  });
  it("same day → includes time", () => {
    expect(anywhen(NOW - 2 * 3_600_000, "en")).toMatch(/\d{1,2}:\d{2}/);
  });
  it("yesterday → includes yesterday", () => {
    expect(anywhen(NOW - 24 * 3_600_000, "en")).toMatch(/yesterday/i);
  });
  it("yesterday → includes time", () => {
    expect(anywhen(NOW - 24 * 3_600_000, "en")).toMatch(/\d{1,2}:\d{2}/);
  });
  it("3 days ago → includes weekday", () => {
    expect(anywhen(NOW - 3 * 86_400_000, "en")).toMatch(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
    );
  });
  it("3 days ago → includes time", () => {
    expect(anywhen(NOW - 3 * 86_400_000, "en")).toMatch(/\d{1,2}:\d{2}/);
  });
  it("10 days ago → absolute date", () => {
    expect(anywhen(NOW - 10 * 86_400_000, "en")).toMatch(/2016/);
  });
  it("10 days ago → no time in absolute", () => {
    expect(anywhen(NOW - 10 * 86_400_000, "en")).not.toMatch(/\d{1,2}:\d{2}/);
  });
});

describe("anywhen — time option", () => {
  it("time:false on same day omits clock", () => {
    expect(anywhen(NOW - 2 * 3_600_000, "en", false)).not.toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("time:false on yesterday omits clock", () => {
    expect(anywhen(NOW - 24 * 3_600_000, "en", false)).not.toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
  it("time:false on weekday omits clock", () => {
    expect(anywhen(NOW - 3 * 86_400_000, "en", false)).not.toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
});

describe("anywhen — locales", () => {
  it("russian same-day includes сегодня", () => {
    expect(anywhen(NOW - 2 * 3_600_000, "ru")).toMatch(/сегодня/i);
  });
  it("russian yesterday includes вчера", () => {
    expect(anywhen(NOW - 24 * 3_600_000, "ru")).toMatch(/вчера/i);
  });
  it("arabic runs without throwing", () => {
    expect(() => anywhen(NOW - 60_000, "ar")).not.toThrow();
  });
  it("japanese runs without throwing", () => {
    expect(() => anywhen(NOW - 86_400_000, "ja")).not.toThrow();
  });
  it("german runs without throwing", () => {
    expect(() => anywhen(NOW - 3 * 86_400_000, "de")).not.toThrow();
  });
  it("chinese runs without throwing", () => {
    expect(() => anywhen(NOW - 10 * 86_400_000, "zh")).not.toThrow();
  });
});

describe("anywhere", () => {
  it("binds locale and proxies all methods", () => {
    const t = anywhere("ru");
    expect(t.anyago(NOW - 60_000)).toMatch(/минут/);
    expect(t.anydate(new Date("2016-02-05"))).toMatch(/февр/);
    expect(t.anywhen(NOW - 2 * 3_600_000)).toMatch(/сегодня/i);
  });
  it("separate instances are independent", () => {
    const en = anywhere("en");
    const ru = anywhere("ru");
    expect(en.anyago(NOW - 3_600_000)).toMatch(/hour/);
    expect(ru.anyago(NOW - 3_600_000)).toMatch(/час/);
  });
  it("numeric option works through anywhere", () => {
    const t = anywhere("en");
    expect(t.anyago(NOW + 86_400_000, true)).toBe("in 1 day");
  });
  it("anywhen time option works through anywhere", () => {
    const t = anywhere("en");
    expect(t.anywhen(NOW - 2 * 3_600_000, false)).not.toMatch(/\d{1,2}:\d{2}/);
  });
  it("anydate custom options work through anywhere", () => {
    const t = anywhere("en");
    expect(
      t.anydate(new Date("2016-02-05"), { month: "long", year: "numeric" }),
    ).toMatch(/February 2016/);
  });
});
