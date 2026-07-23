import { describe, expect, it } from "vitest";
import {
  anywhen,
  anyamount,
  anymany,
  anyaround,
  anylong,
  anylongSupported,
  anyplural,
} from "../src/index";

describe("anyfamily", () => {
  it("re-exports all six as functions", () => {
    expect(typeof anywhen).toBe("function");
    expect(typeof anyamount).toBe("function");
    expect(typeof anymany).toBe("function");
    expect(typeof anyaround).toBe("function");
    expect(typeof anylong).toBe("function");
    expect(typeof anyplural).toBe("function");
  });

  it("anywhen formats relative time", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const threeHoursAgo = new Date("2026-01-01T09:00:00Z");
    expect(anywhen(threeHoursAgo, { mode: "relative", locale: "en", now })).toBe(
      "3 hours ago",
    );
  });

  it("anyamount formats currency", () => {
    expect(
      anyamount(1999, { mode: "currency", currency: "EUR", locale: "en" }),
    ).toBe("€1,999.00");
  });

  it("anymany joins lists", () => {
    expect(anymany(["a", "b", "c"], { locale: "en" })).toBe("a, b, and c");
  });

  it("anyaround resolves region names", () => {
    expect(anyaround("US", { locale: "en" })).toBe("United States");
  });

  it.skipIf(!anylongSupported)("anylong formats durations", () => {
    expect(anylong("PT2H30M", { locale: "en" })).toBe("2 hr, 30 min");
  });

  it("anyplural picks the plural form", () => {
    expect(anyplural(5, { one: "item", other: "items" }, { locale: "en" })).toBe(
      "5 items",
    );
  });
});
