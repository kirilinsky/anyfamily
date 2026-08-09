import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import {
  anywhen,
  anyamount,
  anymany,
  anyaround,
  anylong,
  anyplural,
  anyword,
  anylocale,
} from "../src/index";

import { anywhen as anywhenDirect } from "anywhen";
import { anyamount as anyamountDirect } from "anyamount";
import { anymany as anymanyDirect } from "anymany";
import { anyaround as anyaroundDirect } from "anyaround";
import { anylong as anylongDirect } from "anylong";
import { anyplural as anypluralDirect } from "anyplural";
import { anyword as anywordDirect } from "anyword";
import { anylocale as anylocaleDirect } from "anylocale";

const PACKAGES = [
  "anyamount",
  "anyaround",
  "anylocale",
  "anylong",
  "anymany",
  "anyplural",
  "anywhen",
  "anyword",
] as const;

describe("anyfamily — the re-export contract", () => {
  it("exports exactly the eight package names and nothing else", async () => {
    const mod = await import("../src/index");
    expect(Object.keys(mod).sort()).toEqual([...PACKAGES]);
  });

  it("has no prefixed aliases left over from 1.x", async () => {
    const mod: Record<string, unknown> = await import("../src/index");
    // v2 put `supported` on the function, so the collisions that forced these
    // aliases cannot happen any more. Their absence is the whole point.
    expect(mod.anywordSupported).toBeUndefined();
    expect(mod.anylongSupported).toBeUndefined();
    expect(mod.anywhenParts).toBeUndefined();
    expect(mod.anyamountSymbol).toBeUndefined();
    expect(mod.anyaroundInfo).toBeUndefined();
  });

  it("re-exports the very same function objects, not copies", () => {
    expect(anywhen).toBe(anywhenDirect);
    expect(anyamount).toBe(anyamountDirect);
    expect(anymany).toBe(anymanyDirect);
    expect(anyaround).toBe(anyaroundDirect);
    expect(anylong).toBe(anylongDirect);
    expect(anyplural).toBe(anypluralDirect);
    expect(anyword).toBe(anywordDirect);
    expect(anylocale).toBe(anylocaleDirect);
  });

  it("carries every static through the re-export", () => {
    expect(typeof anywhen.parts).toBe("function");
    expect(typeof anyamount.parts).toBe("function");
    expect(typeof anyamount.symbol).toBe("function");
    expect(typeof anymany.parts).toBe("function");
    expect(typeof anyaround.info).toBe("function");
    expect(typeof anylong.parts).toBe("function");
    expect(typeof anyplural.parts).toBe("function");
    expect(typeof anyword.parts).toBe("function");
    expect(typeof anyword.count).toBe("function");
    expect(typeof anyword.truncate).toBe("function");
    expect(typeof anylong.supported).toBe("boolean");
    expect(typeof anyword.supported).toBe("boolean");
    expect(typeof anylocale.supported).toBe("boolean");
  });

  it("ships the same surface through the built CJS bundle", () => {
    // Guards the packaging, not the source: `require("anyfamily")` has to give
    // the same eight names the ESM entry does.
    const require = createRequire(import.meta.url);
    const cjs = require("../dist/index.cjs") as Record<string, unknown>;
    const names = Object.keys(cjs).filter((key) => key !== "__esModule");
    expect(names.sort()).toEqual([...PACKAGES]);
    for (const name of PACKAGES) {
      expect(typeof cjs[name]).toBe("function");
    }
  });
});

describe("anyfamily", () => {
  it("re-exports all eight, one name each", () => {
    expect(typeof anywhen).toBe("function");
    expect(typeof anyamount).toBe("function");
    expect(typeof anymany).toBe("function");
    expect(typeof anyaround).toBe("function");
    expect(typeof anylong).toBe("function");
    expect(typeof anyplural).toBe("function");
    expect(typeof anyword).toBe("function");
    expect(typeof anylocale).toBe("function");
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

  it("anyamount.symbol resolves a bare currency symbol", () => {
    expect(anyamount.symbol("EUR", { locale: "en" })).toBe("€");
  });

  it("anymany joins lists", () => {
    expect(anymany(["a", "b", "c"], { locale: "en" })).toBe("a, b, and c");
  });

  it("anyaround resolves region names", () => {
    expect(anyaround("US", { locale: "en" })).toBe("United States");
  });

  it.skipIf(!anylong.supported)("anylong formats durations", () => {
    expect(anylong("PT2H30M", { locale: "en" })).toBe("2 hr, 30 min");
  });

  it("anyplural picks the plural form", () => {
    expect(anyplural(5, { one: "item", other: "items" }, { locale: "en" })).toBe(
      "5 items",
    );
  });

  it.skipIf(!anyword.supported)("anyword segments words without spaces", () => {
    expect(anyword("世界 test", { locale: "en" })).toEqual(["世界", "test"]);
  });

  it.skipIf(!anyword.supported)("anyword.count counts graphemes, not code units", () => {
    expect(anyword.count("👨‍👩‍👧", { by: "grapheme" })).toBe(1);
  });

  it.skipIf(!anyword.supported)("anyword.truncate cuts on a grapheme boundary", () => {
    expect(anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…" })).toBe("héllo…");
  });

  it.skipIf(!anylocale.supported)("anylocale reads how a locale behaves", () => {
    expect(anylocale("ar-EG").direction).toBe("rtl");
    // en-GB starts the week on Monday, en-US on Sunday — the clearest proof
    // the info is per-locale rather than a constant.
    expect(anylocale("en-GB").weekStart).toBe(1);
    expect(anylocale("en-US").weekStart).toBe(7);
  });
});
