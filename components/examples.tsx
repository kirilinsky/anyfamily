"use client";

import { useEffect, useRef, useState } from "react";
import { anyaround } from "anyaround";
import { anyamount } from "anyamount";
import { anywhen } from "anywhen";
import { anymany } from "anymany";
import { anylong } from "anylong";

/**
 * A canned demo. `call` is the source shown typing out; `run` invokes the real
 * published package so the revealed output is genuine, never hardcoded. anywhen
 * presets pass a fixed `now` so relative/smart output stays deterministic.
 */
export type Preset = { call: string; run: () => string; fn?: string };

// Ordered simplest-first: the bare one-argument call leads, so the essence of
// each package reads immediately before the option-rich variants appear.
export const AROUND_PRESETS: Preset[] = [
  { call: `anyaround("US")`, run: () => anyaround("US") },
  { call: `anyaround("JPY")`, run: () => anyaround("JPY") },
  { call: `anyaround("Cyrl")`, run: () => anyaround("Cyrl") },
  { call: `anyaround("US", { display: "flag-name" })`, run: () => anyaround("US", { display: "flag-name" }) },
  { call: `anyaround("DE", { locale: "fr", display: "flag-name" })`, run: () => anyaround("DE", { locale: "fr", display: "flag-name" }) },
];

export const AMOUNT_PRESETS: Preset[] = [
  { call: `anyamount(1234567)`, run: () => anyamount(1234567, { locale: "en" }) },
  { call: `anyamount(9_007_199_254_740_993n)`, run: () => anyamount(BigInt("9007199254740993"), { locale: "en" }) },
  { call: `anyamount(1999.5, { mode: "currency", currency: "EUR", locale: "de" })`, run: () => anyamount(1999.5, { mode: "currency", currency: "EUR", locale: "de" }) },
  { call: `anyamount(3.2, { mode: "unit", unit: "kilometer-per-hour", style: "long" })`, run: () => anyamount(3.2, { mode: "unit", unit: "kilometer-per-hour", style: "long", locale: "en" }) },
  { call: `anyamount(2500000, { style: "long", locale: "fr" })`, run: () => anyamount(2500000, { style: "long", locale: "fr" }) },
];

const NOW = "2026-07-11T12:00:00";
export const WHEN_PRESETS: Preset[] = [
  { call: `anywhen("2026-07-08", { mode: "relative" })`, run: () => anywhen("2026-07-08", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-14", { mode: "relative" })`, run: () => anywhen("2026-07-14", { mode: "relative", now: NOW }) },
  { call: `anywhen("2026-07-11", { format: { dateStyle: "full" } })`, run: () => anywhen("2026-07-11", { mode: "absolute", format: { dateStyle: "full" } }) },
  { call: `anywhen("2026-07-11", { locale: "ja", format: { dateStyle: "long" } })`, run: () => anywhen("2026-07-11", { mode: "absolute", locale: "ja", format: { dateStyle: "long" } }) },
  { call: `anywhen("2026-07-10T12:00", { mode: "smart" })`, run: () => anywhen("2026-07-10T12:00", { mode: "smart", now: NOW }) },
];

export const MANY_PRESETS: Preset[] = [
  { call: `anymany(["a", "b", "c"])`, run: () => anymany(["a", "b", "c"]) },
  { call: `anymany(["red", "green", "blue"], { type: "disjunction" })`, run: () => anymany(["red", "green", "blue"], { type: "disjunction" }) },
  { call: `anymany(["1h", "30m"], { type: "unit" })`, run: () => anymany(["1h", "30m"], { type: "unit" }) },
  { call: `anymany(["poire", "pomme"], { locale: "fr", sort: true })`, run: () => anymany(["poire", "pomme"], { locale: "fr", sort: true }) },
  { call: `anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" })`, run: () => anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" }) },
];

export const LONG_PRESETS: Preset[] = [
  { call: `anylong(9_000_000)`, run: () => anylong(9_000_000, { locale: "en" }) },
  { call: `anylong("PT2H30M")`, run: () => anylong("PT2H30M", { locale: "en" }) },
  { call: `anylong("2h 30m", { style: "long" })`, run: () => anylong("2h 30m", { style: "long", locale: "en" }) },
  { call: `anylong({ hours: 2, minutes: 30 }, { style: "digital" })`, run: () => anylong({ hours: 2, minutes: 30 }, { style: "digital", locale: "en" }) },
  { call: `anylong("P1DT4H", { locale: "es", style: "long" })`, run: () => anylong("P1DT4H", { locale: "es", style: "long" }) },
];

// Meta-package tour: cycles one import + call per any* package, all from
// "anyfamily" — `fn` overrides the accent-colored prefix per preset since it
// varies (the import clause), unlike the single-package demos above.
export const FAMILY_PRESETS: Preset[] = [
  {
    fn: `import { anywhen } from "anyfamily";`,
    call: `import { anywhen } from "anyfamily";\n\nanywhen("2026-07-08", { mode: "relative" })`,
    run: () => anywhen("2026-07-08", { mode: "relative", now: NOW }),
  },
  {
    fn: `import { anyamount } from "anyfamily";`,
    call: `import { anyamount } from "anyfamily";\n\nanyamount(1999.5, { mode: "currency", currency: "USD" })`,
    run: () => anyamount(1999.5, { mode: "currency", currency: "USD" }),
  },
  {
    fn: `import { anymany } from "anyfamily";`,
    call: `import { anymany } from "anyfamily";\n\nanymany(["red", "green", "blue"], { type: "disjunction" })`,
    run: () => anymany(["red", "green", "blue"], { type: "disjunction" }),
  },
  {
    fn: `import { anyaround } from "anyfamily";`,
    call: `import { anyaround } from "anyfamily";\n\nanyaround("JPY")`,
    run: () => anyaround("JPY"),
  },
  {
    fn: `import { anylong } from "anyfamily";`,
    call: `import { anylong } from "anyfamily";\n\nanylong("PT2H30M")`,
    run: () => anylong("PT2H30M", { locale: "en" }),
  },
];

// anyfamily-react tour: cycles one hook call per any* package. `run` calls
// the plain function each hook wraps — same output, no live component tree
// needed to invoke a hook outside of React.
export const REACT_PRESETS: Preset[] = [
  {
    fn: `useAnywhen`,
    call: `useAnywhen(date, { mode: "relative" })`,
    run: () => anywhen("2026-07-08", { mode: "relative", now: NOW }),
  },
  {
    fn: `useAnyamount`,
    call: `useAnyamount(1999.5, { mode: "currency", currency: "USD" })`,
    run: () => anyamount(1999.5, { mode: "currency", currency: "USD" }),
  },
  {
    fn: `useAnymany`,
    call: `useAnymany(["red", "green", "blue"], { type: "disjunction" })`,
    run: () => anymany(["red", "green", "blue"], { type: "disjunction" }),
  },
  {
    fn: `useAnyaround`,
    call: `useAnyaround("JPY")`,
    run: () => anyaround("JPY"),
  },
  {
    fn: `useAnylong`,
    call: `useAnylong("PT2H30M")`,
    run: () => anylong("PT2H30M", { locale: "en" }),
  },
];

const TYPE_MS = 42;
const HOLD_MS = 2600;

function safeRun(run: () => string): string {
  try {
    return run();
  } catch {
    return "—";
  }
}

/**
 * Cycles through `presets`, typing each call out character by character, then
 * revealing the value the real package returns. Output is computed only after
 * mount, so the server render stays empty and hydration can't mismatch on ICU
 * differences between Node and the browser.
 */
export function CodeAnimation({
  fn,
  accent,
  presets,
}: {
  fn: string;
  accent: string;
  presets: Preset[];
}) {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate
  useEffect(() => setMounted(true), []);

  // Only animate while the demo is actually visible.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const preset = presets[i];
  const call = preset.call;
  const activeFn = preset.fn ?? fn;

  // Type the current call out.
  useEffect(() => {
    if (!mounted || !inView) return;
    // Reset the typewriter when the preset changes; timers drive the rest.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLen(0);
    setDone(false);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setLen(n);
      if (n >= call.length) {
        clearInterval(id);
        setDone(true);
      }
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [mounted, inView, i, call]);

  // Advance to the next preset after a hold.
  useEffect(() => {
    if (!done || !inView) return;
    const id = setTimeout(() => setI((p) => (p + 1) % presets.length), HOLD_MS);
    return () => clearTimeout(id);
  }, [done, inView, presets.length]);

  const typed = mounted ? call.slice(0, len) : call;
  const fnPart = typed.slice(0, activeFn.length);
  const argPart = typed.slice(activeFn.length);
  const showCaret = mounted && !done;
  const out = mounted && done ? safeRun(preset.run) : "";

  return (
    <div ref={containerRef} className="w-full max-w-3xl lg:max-w-4xl">
      <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 sm:p-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:mb-2">
          you call
        </p>
        <div className="grid grid-cols-1 font-mono text-sm leading-relaxed sm:text-base">
          {/* Invisible sizer: every preset's full call stacked in the same grid
              cell reserves the tallest real wrapped height at this width, so
              typing never grows the box mid-animation. */}
          {presets.map((p, k) => (
            <span
              key={k}
              aria-hidden
              className="invisible col-start-1 row-start-1 whitespace-pre-wrap break-words"
            >
              {p.call}
            </span>
          ))}
          <div className="col-start-1 row-start-1 whitespace-pre-wrap break-words">
            <span style={{ color: accent }}>{fnPart}</span>
            <span className="text-white/60">{argPart}</span>
            {showCaret && (
              <span className="ml-0.5 animate-pulse" style={{ color: accent }}>
                ▋
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:mt-6 sm:mb-2">
          you get
        </p>
        <div
          className="flex min-h-[5rem] items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 transition-all duration-500 sm:min-h-[8rem] sm:px-5 sm:py-6"
          style={{
            opacity: out ? 1 : 0.25,
            transform: out ? "none" : "translateY(6px)",
          }}
        >
          <span className="font-mono text-lg text-white/25">→</span>
          <span
            className="font-mono text-xl font-semibold break-words sm:text-4xl"
            style={{ color: accent }}
          >
            {out || " "}
          </span>
        </div>
      </div>

      {/* preset progress dots */}
      <div className="mt-3 flex gap-2 sm:mt-4">
        {presets.map((_, k) => (
          <span
            key={k}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: k === i ? 20 : 6,
              background: k === i ? accent : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
