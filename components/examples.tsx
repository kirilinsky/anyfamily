"use client";

import { useEffect, useState } from "react";
import { anyaround } from "anyaround";
import { anyamount } from "anyamount";
import { anywhen } from "anywhen";
import { anymany } from "anymany";

/**
 * A canned demo. `call` is the source shown typing out; `run` invokes the real
 * published package so the revealed output is genuine, never hardcoded. anywhen
 * presets pass a fixed `now` so relative/smart output stays deterministic.
 */
export type Preset = { call: string; run: () => string };

// Ordered simplest-first: the bare one-argument call leads, so the essence of
// each package reads immediately before the option-rich variants appear.
export const AROUND_PRESETS: Preset[] = [
  { call: `anyaround("US")`, run: () => anyaround("US") },
  { call: `anyaround("JPY")`, run: () => anyaround("JPY") },
  { call: `anyaround("Cyrl")`, run: () => anyaround("Cyrl") },
  { call: `anyaround("US", { display: "flag-name" })`, run: () => anyaround("US", { display: "flag-name" }) },
  { call: `anyaround("DE", { locale: "ru", display: "flag-name" })`, run: () => anyaround("DE", { locale: "ru", display: "flag-name" }) },
];

export const AMOUNT_PRESETS: Preset[] = [
  { call: `anyamount(1234567)`, run: () => anyamount(1234567, { locale: "en" }) },
  { call: `anyamount(1999.5, { mode: "currency", currency: "USD" })`, run: () => anyamount(1999.5, { mode: "currency", currency: "USD" }) },
  { call: `anyamount(1999.5, { currency: "EUR", locale: "de" })`, run: () => anyamount(1999.5, { mode: "currency", currency: "EUR", locale: "de" }) },
  { call: `anyamount(89000, { currency: "JPY", locale: "ja" })`, run: () => anyamount(89000, { mode: "currency", currency: "JPY", locale: "ja" }) },
  { call: `anyamount(3.2, { mode: "unit", unit: "gigabyte" })`, run: () => anyamount(3.2, { mode: "unit", unit: "gigabyte" }) },
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
  { call: `anymany(["груша", "яблоко"], { locale: "ru", sort: true })`, run: () => anymany(["груша", "яблоко"], { locale: "ru", sort: true }) },
  { call: `anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" })`, run: () => anymany(["Öl", "Apfel", "Zebra"], { sort: true, locale: "de" }) },
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
  const [i, setI] = useState(0);
  const [len, setLen] = useState(0);
  const [done, setDone] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate
  useEffect(() => setMounted(true), []);

  const preset = presets[i];
  const call = preset.call;

  // Type the current call out.
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted, i, call]);

  // Advance to the next preset after a hold.
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setI((p) => (p + 1) % presets.length), HOLD_MS);
    return () => clearTimeout(id);
  }, [done, presets.length]);

  const typed = mounted ? call.slice(0, len) : call;
  const fnPart = typed.slice(0, fn.length);
  const argPart = typed.slice(fn.length);
  const showCaret = mounted && !done;
  const out = mounted && done ? safeRun(preset.run) : "";

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl">
      <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-6 sm:p-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          you call
        </p>
        <div className="min-h-[3.5rem] whitespace-pre-wrap break-words font-mono text-sm leading-relaxed sm:text-base">
          <span style={{ color: accent }}>{fnPart}</span>
          <span className="text-white/60">{argPart}</span>
          {showCaret && (
            <span className="ml-0.5 animate-pulse" style={{ color: accent }}>
              ▋
            </span>
          )}
        </div>

        <p className="mt-6 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          you get
        </p>
        <div
          className="flex min-h-[7rem] items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-6 transition-all duration-500 sm:min-h-[8rem]"
          style={{
            opacity: out ? 1 : 0.25,
            transform: out ? "none" : "translateY(6px)",
          }}
        >
          <span className="font-mono text-lg text-white/25">→</span>
          <span
            className="font-mono text-2xl font-semibold break-words sm:text-4xl"
            style={{ color: accent }}
          >
            {out || " "}
          </span>
        </div>
      </div>

      {/* preset progress dots */}
      <div className="mt-4 flex gap-2">
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
