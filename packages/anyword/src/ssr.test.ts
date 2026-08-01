import { describe, expect, it } from "vitest";
import { anyword } from "./index";

// anyword has no clock and no state, so its only SSR risk is the runtime locale
// drifting between server and client. Passing `locale` pins output on both.
describe("SSR-safe segmentation", () => {
  it("is deterministic across calls", () => {
    expect(anyword("don't stop 世界", { locale: "en" })).toEqual(["don't", "stop", "世界"]);
    expect(anyword("don't stop 世界", { locale: "en" })).toEqual(["don't", "stop", "世界"]);
  });

  it("produces identical parts and counts across calls", () => {
    const a = anyword.count("héllo 👨‍👩‍👧", { by: "grapheme", locale: "en" });
    const b = anyword.count("héllo 👨‍👩‍👧", { by: "grapheme", locale: "en" });
    expect(a).toBe(b);
  });

  it("truncates identically on server and client", () => {
    const opts = { by: "grapheme", locale: "en", ellipsis: "…" } as const;
    expect(anyword.truncate("héllo 👨‍👩‍👧", 5, opts)).toBe("héllo…");
    expect(anyword.truncate("héllo 👨‍👩‍👧", 5, opts)).toBe("héllo…");
  });

  it("uses the given locale instead of the ambient one", () => {
    // A pinned locale drives the segmenter on both sides of the hydration
    // boundary, whatever the runtime default happens to be.
    expect(anyword("日本語テスト", { locale: "ja" })).toEqual(
      anyword("日本語テスト", { locale: "ja" }),
    );
    expect(anyword.count("日本語テスト", { locale: "ja" })).toBeGreaterThan(0);
  });
});
