import { describe, expect, it } from "vitest";
import { anymany, anymanyParts } from "./index";

describe("SSR-safe formatting", () => {
  it("is pure — identical calls always produce identical output", () => {
    const items = ["Öl", "Zebra", "Apfel"];
    const options = { sort: true, max: 2, locale: "de" } as const;

    const first = anymany(items, options);
    expect(anymany(items, options)).toBe(first);
    expect(anymany(items, options)).toBe("Apfel, Öl und +1");
  });

  it("produces deterministic output with an explicit locale in node", () => {
    expect(anymany(["a", "b", "c"], { locale: "en" })).toBe("a, b, and c");
    expect(anymany(["a", "b", "c"], { locale: "ru" })).toBe("a, b и c");
  });

  it("parts stay stable across the hydration boundary", () => {
    const render = () => anymanyParts(["a", "b"], { locale: "en" });
    expect(render()).toEqual(render());
  });
});
