import { afterEach, describe, expect, it, vi } from "vitest";
import { anywhen } from "./index";

afterEach(() => {
  vi.useRealTimers();
});

describe("SSR-safe formatting", () => {
  it("keeps smart mode stable when render time is passed explicitly", () => {
    const renderNow = new Date("2024-01-01T12:00:00.000Z");
    const input = new Date("2024-01-01T11:59:30.000Z");

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:20.000Z"));

    expect(anywhen(input, { locale: "en", now: renderNow })).toBe("now");

    vi.setSystemTime(new Date("2024-01-01T12:10:00.000Z"));

    expect(anywhen(input, { locale: "en", now: renderNow })).toBe("now");
  });

  it("keeps relative mode stable when render time is passed explicitly", () => {
    const renderNow = new Date("2024-01-01T12:00:00.000Z");
    const input = new Date("2024-01-01T11:59:00.000Z");

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:05:00.000Z"));

    expect(
      anywhen(input, { mode: "relative", locale: "en", now: renderNow }),
    ).toBe("1 minute ago");

    vi.setSystemTime(new Date("2024-01-01T12:30:00.000Z"));

    expect(
      anywhen(input, { mode: "relative", locale: "en", now: renderNow }),
    ).toBe("1 minute ago");
  });

  it("uses the requested timeZone for smart day boundaries", () => {
    expect(
      anywhen("2023-12-31T23:30:00.000Z", {
        locale: "en",
        now: "2024-01-01T00:30:00.000Z",
        time: false,
        timeZone: "Europe/Belgrade",
      }),
    ).toBe("today");
  });
});
