import type { ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  anyamount as anyamountDirect,
} from "anyamount";
import { anywhen as anywhenDirect } from "anywhen";
import { anyword as anywordDirect } from "anyword";

import {
  AnyfamilyProvider,
  anyamount,
  anylocaleSupported,
  anylongSupported,
  anywordSupported,
  anywhen,
  anyword,
  useAnyaround,
  useAnyfamilyDefaults,
  useAnyfamilyLocale,
  useAnylocale,
  useAnylong,
  useAnyamount,
  useAnyamountSymbol,
  useAnymany,
  useAnyplural,
  useAnywhen,
  useAnyword,
  useAnywordCount,
  useAnywordTruncate,
} from "../src/index";
import type { AnyfamilyDefaults, AnywordOptions } from "../src/index";

afterEach(cleanup);

function wrapper(locale?: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AnyfamilyProvider locale={locale}>{children}</AnyfamilyProvider>;
  };
}

describe("AnyfamilyProvider", () => {
  it("useAnyfamilyLocale reads the nearest provider", () => {
    const { result } = renderHook(() => useAnyfamilyLocale(), { wrapper: wrapper("fr") });
    expect(result.current).toBe("fr");
  });

  it("supplies its locale to hooks that don't set their own", () => {
    const { result: en } = renderHook(
      () => useAnyamount(1999, { mode: "currency", currency: "EUR" }),
      { wrapper: wrapper("en") },
    );
    const { result: de } = renderHook(
      () => useAnyamount(1999, { mode: "currency", currency: "EUR" }),
      { wrapper: wrapper("de") },
    );
    expect(en.current).toBe("€1,999.00");
    expect(en.current).not.toBe(de.current);
  });

  it("a hook's own locale option wins over the provider's", () => {
    const { result } = renderHook(
      () => useAnyamount(1999, { mode: "currency", currency: "EUR", locale: "en" }),
      { wrapper: wrapper("de") },
    );
    expect(result.current).toBe("€1,999.00");
  });
});

describe("hooks wrap their underlying formatters", () => {
  it("useAnymany joins lists", () => {
    const { result } = renderHook(() => useAnymany(["a", "b", "c"], { locale: "en" }));
    expect(result.current).toBe("a, b, and c");
  });

  it("useAnyamountSymbol resolves a bare currency symbol", () => {
    const { result } = renderHook(() => useAnyamountSymbol("EUR", { locale: "en" }));
    expect(result.current).toBe("€");
  });

  it("useAnyaround resolves region names", () => {
    const { result } = renderHook(() => useAnyaround("US", { locale: "en" }));
    expect(result.current).toBe("United States");
  });

  it.skipIf(!anylongSupported)("useAnylong formats durations", () => {
    const { result } = renderHook(() => useAnylong("PT2H30M", { locale: "en" }));
    expect(result.current).toBe("2 hr, 30 min");
  });

  it("useAnyplural picks the plural form", () => {
    const { result } = renderHook(() =>
      useAnyplural(5, { one: "item", other: "items" }, { locale: "en" }),
    );
    expect(result.current).toBe("5 items");
  });

  it.skipIf(!anywordSupported)("useAnyword segments words without spaces", () => {
    const { result } = renderHook(() => useAnyword("世界 test", { locale: "en" }));
    expect(result.current).toEqual(["世界", "test"]);
  });

  it.skipIf(!anywordSupported)("useAnywordCount counts graphemes, not code units", () => {
    const { result } = renderHook(() =>
      useAnywordCount("👨‍👩‍👧", { by: "grapheme", locale: "en" }),
    );
    expect(result.current).toBe(1);
  });

  it.skipIf(!anywordSupported)("useAnywordTruncate cuts on a grapheme boundary", () => {
    const { result } = renderHook(() =>
      useAnywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: "…", locale: "en" }),
    );
    expect(result.current).toBe("héllo…");
  });

  it.skipIf(!anywordSupported)("useAnyword keeps the memo when the options are reordered", () => {
    // Same options, different key order in the literal. Keying the memo on a
    // stringified object would treat these as a change and drop the array.
    const { result, rerender } = renderHook(
      ({ options }: { options: AnywordOptions }) => useAnyword("one two three", options),
      { initialProps: { options: { by: "word", locale: "en" } as AnywordOptions } },
    );
    const first = result.current;
    rerender({ options: { locale: "en", by: "word" } });
    expect(result.current).toBe(first);
  });

  it.skipIf(!anywordSupported)("useAnyword keeps the same array across re-renders", () => {
    // Options are a fresh object literal every render — the memo has to key on
    // their contents, not their identity, or the reference churns.
    const { result, rerender } = renderHook(() =>
      useAnyword("one two three", { locale: "en" }),
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe("useAnywhen", () => {
  it("formats relative time", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const threeHoursAgo = new Date("2026-01-01T09:00:00Z");
    const { result } = renderHook(() =>
      useAnywhen(threeHoursAgo, { mode: "relative", locale: "en", now }),
    );
    expect(result.current).toBe("3 hours ago");
  });

  it("ticks to keep relative output fresh", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    const start = new Date("2026-01-01T11:59:00Z");

    const { result } = renderHook(() =>
      useAnywhen(start, { mode: "relative", locale: "en" }),
    );
    expect(result.current).toBe("1 minute ago");

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe("2 minutes ago");

    vi.useRealTimers();
  });

  it("does not tick in absolute mode", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useAnywhen(new Date("2026-01-01T09:00:00Z"), {
        mode: "absolute",
        locale: "en",
        refresh: 1000,
      }),
    );
    const before = result.current;
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(before);
    vi.useRealTimers();
  });

  it("does not tick by default once the date is over a day old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    const threeDaysAgo = new Date("2025-12-29T12:00:00Z");

    const { result } = renderHook(() =>
      useAnywhen(threeDaysAgo, { mode: "relative", locale: "en" }),
    );
    const before = result.current;
    act(() => {
      vi.advanceTimersByTime(10 * 60_000);
    });
    expect(result.current).toBe(before);
    vi.useRealTimers();
  });

  it("still ticks an old date when refresh is set explicitly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    const threeDaysAgo = new Date("2025-12-29T12:00:00Z");

    const { result } = renderHook(() =>
      useAnywhen(threeDaysAgo, { mode: "relative", locale: "en", refresh: 1000 }),
    );
    const before = result.current;
    act(() => {
      vi.advanceTimersByTime(24 * 60 * 60_000);
    });
    expect(result.current).not.toBe(before);
    vi.useRealTimers();
  });
});

describe("AnyfamilyProvider defaults", () => {
  function withDefaults(defaults: AnyfamilyDefaults, locale?: string) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <AnyfamilyProvider locale={locale} defaults={defaults}>
          {children}
        </AnyfamilyProvider>
      );
    };
  }

  it("useAnyfamilyDefaults reads the nearest provider", () => {
    const defaults: AnyfamilyDefaults = { anyamount: { mode: "currency", currency: "EUR" } };
    const { result } = renderHook(() => useAnyfamilyDefaults(), {
      wrapper: withDefaults(defaults),
    });
    expect(result.current).toEqual(defaults);
  });

  it("fills in an option the call site left out", () => {
    const { result } = renderHook(() => useAnyamount(1999), {
      wrapper: withDefaults({ anyamount: { mode: "currency", currency: "EUR" } }, "en"),
    });
    expect(result.current).toBe("€1,999.00");
  });

  it("a call's own option wins over the default", () => {
    // The mode is restated because AnyamountOptions is a discriminated union:
    // TypeScript has no partial form of it, so an override names its mode.
    const { result } = renderHook(
      () => useAnyamount(1999, { mode: "currency", currency: "USD" }),
      {
        wrapper: withDefaults({ anyamount: { mode: "currency", currency: "EUR" } }, "en"),
      },
    );
    expect(result.current).toBe("$1,999.00");
  });

  it("a call naming another mode drops the default's mode-specific keys", () => {
    const { result } = renderHook(
      () => useAnyamount(3.2, { mode: "unit", unit: "gigabyte" }),
      {
        wrapper: withDefaults({ anyamount: { mode: "currency", currency: "EUR" } }, "en"),
      },
    );
    expect(result.current).toBe("3.2 GB");
  });

  it("keeps the locale even when the modes disagree", () => {
    // `locale` is not mode-specific, so dropping the rest must not drop it —
    // German writes the decimal separator as a comma.
    const { result } = renderHook(
      () => useAnyamount(3.2, { mode: "unit", unit: "gigabyte" }),
      {
        wrapper: withDefaults({ anyamount: { mode: "currency", currency: "EUR" } }, "de"),
      },
    );
    expect(result.current).toContain(",");
  });

  it("a default locale beats the provider's locale", () => {
    const { result } = renderHook(() => useAnymany(["a", "b"]), {
      wrapper: withDefaults({ anymany: { locale: "en" } }, "de"),
    });
    expect(result.current).toBe("a and b");
  });

  it("the provider's locale still applies where the defaults set none", () => {
    const { result } = renderHook(() => useAnymany(["a", "b"]), {
      wrapper: withDefaults({ anymany: {} }, "en"),
    });
    expect(result.current).toBe("a and b");
  });

  it("can set the anywhen tick for the whole tree", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    const start = new Date("2026-01-01T11:59:00Z");

    const { result } = renderHook(
      () => useAnywhen(start, { mode: "relative", locale: "en" }),
      { wrapper: withDefaults({ anywhen: { refresh: 5_000 } }) },
    );
    expect(result.current).toBe("1 minute ago");

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe("2 minutes ago");

    vi.useRealTimers();
  });

  it.skipIf(!anywordSupported)("the anywordTruncate slot reaches truncate", () => {
    const { result } = renderHook(() => useAnywordTruncate("héllo 👨‍👩‍👧", 5), {
      wrapper: withDefaults({ anywordTruncate: { ellipsis: "…" } }, "en"),
    });
    expect(result.current).toBe("héllo…");
  });

  it.skipIf(!anywordSupported)("the anyword slot does not move where truncate cuts", () => {
    // truncate segments by grapheme where anyword() segments by word, so the
    // two must not share a slot — a `by` set for counting would silently
    // change every cut.
    const { result: bare } = renderHook(() =>
      useAnywordTruncate("hello world", 7, { locale: "en" }),
    );
    const { result: withWordDefault } = renderHook(
      () => useAnywordTruncate("hello world", 7),
      { wrapper: withDefaults({ anyword: { by: "word" } }, "en") },
    );
    expect(withWordDefault.current).toBe(bare.current);
  });
});

describe("the re-exported functions", () => {
  it("are the packages' own bindings", () => {
    expect(anywhen).toBe(anywhenDirect);
    expect(anyamount).toBe(anyamountDirect);
    expect(anyword).toBe(anywordDirect);
  });

  it("keep their extras", () => {
    expect(anyamount.symbol("EUR", { locale: "en" })).toBe("€");
    expect(typeof anyword.count).toBe("function");
    expect(typeof anyword.truncate).toBe("function");
  });
});

describe("the built bundle", () => {
  // rolldown keeps the "use client" directive on its own, where esbuild stripped
  // it and needed a banner step. Nothing in the source can prove that — only the
  // artifact can, and a client component without the directive breaks silently
  // in any React Server Components app.
  for (const file of ["dist/index.mjs", "dist/index.cjs"]) {
    it(`starts ${file} with the "use client" directive, exactly once`, async () => {
      const { readFile } = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      // vitest runs with the package root as cwd.
      const contents = await readFile(resolve(process.cwd(), file), "utf8");

      expect(contents.startsWith('"use client";')).toBe(true);
      expect(contents.split('"use client";').length - 1).toBe(1);
    });
  }
});
