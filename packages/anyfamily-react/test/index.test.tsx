import type { ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AnyfamilyProvider,
  anylongSupported,
  anywordSupported,
  useAnyaround,
  useAnyfamilyLocale,
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
