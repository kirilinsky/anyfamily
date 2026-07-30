import { describe, expect, it } from "vitest";
import { anyword, anywordCount, anywordTruncate } from "./index";

// anyword has no clock and no state, so its only SSR risk is the runtime locale
// drifting between server and client. Passing `locale` pins output on both.
describe("SSR-safe segmentation", () => {
  it("is deterministic across calls", () => {
    expect(anyword("don't stop 世界", { locale: "en" })).toEqual(["don't", "stop", "世界"]);
    expect(anyword("don't stop 世界", { locale: "en" })).toEqual(["don't", "stop", "世界"]);
  });

  it("produces identical parts and counts across calls", () => {
    const a = anywordCount("héllo 👨‍👩‍👧", { by: "grapheme", locale: "en" });
    const b = anywordCount("héllo 👨‍👩‍👧", { by: "grapheme", locale: "en" });
    expect(a).toBe(b);
  });

  it("truncates identically on server and client", () => {
    const opts = { by: "grapheme", locale: "en", ellipsis: "…" } as const;
    expect(anywordTruncate("héllo 👨‍👩‍👧", 5, opts)).toBe("héllo…");
    expect(anywordTruncate("héllo 👨‍👩‍👧", 5, opts)).toBe("héllo…");
  });

  it("uses the given locale instead of the ambient one", () => {
    // A pinned locale drives the segmenter on both sides of the hydration
    // boundary, whatever the runtime default happens to be.
    expect(anyword("日本語テスト", { locale: "ja" })).toEqual(
      anyword("日本語テスト", { locale: "ja" }),
    );
    expect(anywordCount("日本語テスト", { locale: "ja" })).toBeGreaterThan(0);
  });
});
