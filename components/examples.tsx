"use client";

import { useEffect, useState } from "react";

/** A single canned demo: the call as it types out, and the string it returns. */
export type Preset = { call: string; out: string };

export const AROUND_PRESETS: Preset[] = [
  { call: `anyaround("US", { display: "flag-name" })`, out: "🇺🇸 United States" },
  { call: `anyaround("fr")`, out: "French" },
  { call: `anyaround("JPY")`, out: "Japanese Yen" },
  { call: `anyaround("Cyrl")`, out: "Cyrillic" },
  { call: `anyaround("DE", { locale: "ru", display: "flag-name" })`, out: "🇩🇪 Германия" },
];

export const AMOUNT_PRESETS: Preset[] = [
  { call: `anyamount(1999.5, "USD")`, out: "$1,999.50" },
  { call: `anyamount(1999.5, "EUR", "de")`, out: "1.999,50 €" },
  { call: `anyamount(89000, "JPY", "ja")`, out: "￥89,000" },
  { call: `anyamount(0.4267, "percent")`, out: "42.67%" },
  { call: `anyamount(5, "kilometer")`, out: "5 km" },
];

export const WHEN_PRESETS: Preset[] = [
  { call: `anywhen("2026-07-11", { dateStyle: "full" })`, out: "Saturday, July 11, 2026" },
  { call: `anywhen("2026-07-11", { locale: "fr" })`, out: "11 juillet 2026" },
  { call: `anywhen(-3, "day", "relative")`, out: "3 days ago" },
  { call: `anywhen("2026-12-25", { locale: "ja" })`, out: "2026年12月25日" },
  { call: `anywhen("14:30", { timeStyle: "short" })`, out: "2:30 PM" },
];

export const MANY_PRESETS: Preset[] = [
  { call: `anymany(["a", "b", "c"])`, out: "a, b, and c" },
  { call: `anymany(["red", "green", "blue"], "or")`, out: "red, green, or blue" },
  { call: `anymany(["1h", "30m"], "unit")`, out: "1h, 30m" },
  { call: `anymany(["яблоко", "груша"], "ru")`, out: "яблоко и груша" },
  { call: `anymany(["A", "B", "C"], "de")`, out: "A, B und C" },
];

const TYPE_MS = 42;
const HOLD_MS = 2600;

/**
 * Cycles through `presets`, typing each call out character by character, then
 * revealing its return value. Everything animates after mount; the server (and
 * first client render) shows the first preset fully so hydration matches.
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

  useEffect(() => setMounted(true), []);

  const preset = presets[i];
  const call = preset.call;

  // Type the current call out.
  useEffect(() => {
    if (!mounted) return;
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
  const showOut = mounted ? done : true;

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5 sm:p-6">
        <div className="min-h-[3.5rem] font-mono text-sm leading-relaxed sm:text-base">
          <span style={{ color: accent }}>{fnPart}</span>
          <span className="text-white/60">{argPart}</span>
          {showCaret && (
            <span className="ml-0.5 animate-pulse" style={{ color: accent }}>
              ▋
            </span>
          )}
        </div>

        <div
          className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4 transition-all duration-500"
          style={{
            opacity: showOut ? 1 : 0,
            transform: showOut ? "none" : "translateY(6px)",
          }}
        >
          <span className="font-mono text-white/25">→</span>
          <span
            className="font-mono text-xl font-semibold sm:text-2xl"
            style={{ color: accent }}
          >
            {preset.out}
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
