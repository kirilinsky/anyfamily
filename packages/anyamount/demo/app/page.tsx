"use client";

import { useEffect, useState } from "react";
import { anyamount, anyamountParts } from "anyamount";
import type { AnyamountOptions, Unit } from "anyamount";
import Link from "next/link";
import { Logo } from "@/logo/logo";

type Mode = "smart" | "currency" | "unit";

const LOCALES = ["en", "ru", "ja", "ar", "hi", "pt-BR", "sr-Latn-RS"];

const CURRENCIES = ["EUR", "USD", "JPY", "RSD", "GBP", "INR"];

const UNITS: Unit[] = [
  "gigabyte",
  "megabyte",
  "kilometer-per-hour",
  "kilometer",
  "celsius",
  "liter",
  "kilogram",
  "percent",
];

const PRESETS = [1234567, 10000, 9999, 42, 0.1234, -3.5];

const MODE_HINTS: Record<Mode, string> = {
  smart: "compact for big numbers, plain for small",
  currency: "money via Intl currency style",
  unit: "measurements, including -per- compounds",
};

function useTypewriter(text: string | null) {
  const [state, setState] = useState({ displayed: "", source: text });

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setState({ displayed: text.slice(0, i), source: text });
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);

  if (!text || state.source !== text) return "";
  return state.displayed;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("smart");
  const [valueStr, setValueStr] = useState("1234567");
  const [locale, setLocale] = useState("en");
  const [currency, setCurrency] = useState("EUR");
  const [unit, setUnit] = useState<Unit>("gigabyte");

  const value = Number(valueStr);

  const options: AnyamountOptions = {
    mode,
    locale,
    ...(mode === "currency" ? { currency } : {}),
    ...(mode === "unit" ? { unit } : {}),
  };

  const result = (() => {
    if (valueStr.trim() === "" || Number.isNaN(value)) return null;
    try {
      return anyamount(value, options);
    } catch {
      return null;
    }
  })();

  const parts = (() => {
    if (valueStr.trim() === "" || Number.isNaN(value)) return null;
    try {
      return anyamountParts(value, options);
    } catch {
      return null;
    }
  })();

  const typed = useTypewriter(result);
  const done = typed === result && !!result;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 pb-28 pt-20 sm:py-20">
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-20 flex w-full max-w-3xl flex-col items-center gap-8">
        <h1 className="sr-only">
          anyamount - tiny Intl number formatter for any locale
        </h1>
        <Logo className="h-auto w-44 opacity-90" />

        <div className="relative w-fit max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
          <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:flex-nowrap sm:justify-start sm:text-base">
            <span className="shrink-0 text-violet-300">anyamount</span>
            <span className="shrink-0 text-white/30">(</span>
            <input
              value={valueStr}
              onChange={(e) => setValueStr(e.target.value)}
              inputMode="decimal"
              spellCheck={false}
              style={{ width: `calc(${Math.max(valueStr.length, 1)}ch + 1rem)` }}
              className="h-8 min-w-0 shrink rounded-md border border-transparent px-1.5 text-left text-sky-300 outline-none transition-colors hover:border-white/10 hover:bg-white/[0.05] focus:border-sky-300/40"
            />
            <span className="shrink-0 text-white/30">, {"{"}</span>
            <span className="shrink-0 text-white/55">mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.6rem",
              }}
              className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-violet-300/30 bg-violet-300/[0.06] pl-2 pr-6 font-mono text-violet-300 outline-none transition-colors hover:border-violet-300/60 hover:bg-violet-300/[0.12]"
            >
              <option value="smart">&quot;smart&quot;</option>
              <option value="currency">&quot;currency&quot;</option>
              <option value="unit">&quot;unit&quot;</option>
            </select>
            {mode === "currency" && (
              <>
                <span className="shrink-0 text-white/30">,</span>
                <span className="shrink-0 text-white/55">currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: `calc(${currency.length + 2}ch + 0.75rem)` }}
                  className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-amber-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      &quot;{c}&quot;
                    </option>
                  ))}
                </select>
              </>
            )}
            {mode === "unit" && (
              <>
                <span className="shrink-0 text-white/30">,</span>
                <span className="shrink-0 text-white/55">unit:</span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  style={{ width: `calc(${unit.length + 2}ch + 0.75rem)` }}
                  className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-amber-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      &quot;{u}&quot;
                    </option>
                  ))}
                </select>
              </>
            )}
            <span className="shrink-0 text-white/30">,</span>
            <span className="shrink-0 text-white/55">locale:</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              style={{ width: `calc(${locale.length + 2}ch + 0.75rem)` }}
              className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-emerald-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  &quot;{l}&quot;
                </option>
              ))}
            </select>
            <span className="shrink-0 text-white/30">{"})"}</span>
          </div>

          <p className="mt-2 text-center font-sans text-xs italic text-white/35">
            {MODE_HINTS[mode]}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValueStr(String(p))}
              className={`rounded-md border px-2 py-1 transition-colors ${
                valueStr === String(p)
                  ? "border-sky-300/40 bg-sky-300/[0.08] text-sky-300"
                  : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex min-h-28 w-full flex-col items-center justify-center gap-3">
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/25">
              output
            </p>
            <p className="mt-1 text-sm italic text-white/35">
              what your users see
            </p>
          </div>

          <div className="flex min-h-10 min-w-0 items-center justify-center sm:min-h-12">
            {typed ? (
              <p
                className="min-w-0 break-words text-center text-4xl tracking-tight text-white/90 sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {typed}
                <span
                  className="ml-[2px] inline-block h-[1.2em] w-[2px] align-middle bg-white/60"
                  style={{
                    animation: done ? "blink 1s step-end infinite" : "none",
                    opacity: done ? undefined : 1,
                  }}
                />
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
              </p>
            ) : (
              <p className="font-serif text-sm italic text-white/15">result</p>
            )}
          </div>

          <div className="flex min-h-6 max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 font-mono text-[11px]">
            {done && parts && (
              <>
                <span className="text-white/25">anyamountParts →</span>
                {parts.map((p, i) => (
                  <span
                    key={i}
                    className="inline-flex items-baseline gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5"
                  >
                    <span className="text-white/65">
                      {JSON.stringify(p.value)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/25">
                      {p.type}
                    </span>
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-3xl flex-col items-center justify-center gap-1 px-6 py-2 sm:min-h-12 sm:flex-row sm:justify-between sm:py-0">
          <p className="text-center font-mono text-[11px] text-white/30">
            Intl is powerful. anyamount makes it usable.
          </p>

          <div className="flex items-center">
            {[
              ["github", "https://github.com/kirilinsky/anyamount"],
              ["npm", "https://www.npmjs.com/package/anyamount"],
              ["anywhen", "https://anywhen-kappa.vercel.app/"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs uppercase tracking-widest text-white/25 transition-colors hover:text-white/60 sm:py-3"
              >
                {label}
              </a>
            ))}
            <Link
              href="/docs"
              className="px-3 py-3 text-xs uppercase tracking-widest text-white/25 transition-colors hover:text-white/60"
            >
              docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
