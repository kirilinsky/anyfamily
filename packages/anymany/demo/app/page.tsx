"use client";

import { useEffect, useState } from "react";
import { anymany, anymanyParts, type AnymanyOptions } from "anymany";
import Link from "next/link";
import { Logo } from "@/logo/logo";

type ListType = "conjunction" | "disjunction" | "unit";
type SortChoice = "none" | "true" | "numeric";
type MaxChoice = "none" | "2" | "3" | "5";

const LOCALES = ["en", "ru", "de", "ja", "ar-EG", "hi", "pt-BR"];

const TYPE_HINTS: Record<ListType, string> = {
  conjunction: "joins with the locale's «and»",
  disjunction: "joins with the locale's «or»",
  unit: "plain list — no joiner word",
};

const PRESETS = [
  "banana, apple, cherry",
  "Öl, Zebra, Apfel",
  "файл10, файл2, файл1",
  "x, y, z, a, b, c, d",
];

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

const selectClass =
  "h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono outline-none hover:border-white/10 hover:bg-white/[0.05]";

export default function Home() {
  const [itemsRaw, setItemsRaw] = useState(PRESETS[0]);
  const [type, setType] = useState<ListType>("conjunction");
  const [sort, setSort] = useState<SortChoice>("none");
  const [max, setMax] = useState<MaxChoice>("none");
  const [locale, setLocale] = useState("en");

  const items = itemsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const options: AnymanyOptions = { type, locale };
  if (sort === "true") options.sort = true;
  if (sort === "numeric") options.sort = "numeric";
  if (max !== "none") options.max = Number(max);

  const result = (() => {
    if (!items.length) return null;
    try {
      return anymany(items, options);
    } catch {
      return null;
    }
  })();

  const parts = (() => {
    if (!items.length) return null;
    try {
      return anymanyParts(items, options);
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
          anymany - smart Intl list formatter for any locale
        </h1>
        <Logo className="h-auto w-36 opacity-90" />

        <div className="relative w-fit max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
          <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:text-base">
            <span className="shrink-0 text-amber-400">anymany</span>
            <span className="shrink-0 text-white/30">([</span>
            <input
              value={itemsRaw}
              onChange={(e) => setItemsRaw(e.target.value)}
              spellCheck={false}
              style={{ width: `min(${itemsRaw.length + 2}ch, 100%)` }}
              className="h-8 min-w-[8ch] max-w-full shrink rounded-md border border-transparent px-1.5 font-mono text-sky-300 outline-none transition-colors hover:border-white/10 hover:bg-white/[0.05] focus:border-white/10 focus:bg-white/[0.05]"
            />
            <span className="shrink-0 text-white/30">], {"{"}</span>
            <span className="shrink-0 text-white/55">type:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ListType)}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.6rem",
              }}
              className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-violet-300/30 bg-violet-300/[0.06] pl-2 pr-6 font-mono text-violet-300 outline-none transition-colors hover:border-violet-300/60 hover:bg-violet-300/[0.12]"
            >
              <option value="conjunction">&quot;conjunction&quot;</option>
              <option value="disjunction">&quot;disjunction&quot;</option>
              <option value="unit">&quot;unit&quot;</option>
            </select>
            <span className="shrink-0 text-white/30">,</span>
            <span className="shrink-0 text-white/55">sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortChoice)}
              className={`${selectClass} text-rose-300`}
            >
              <option value="none">–</option>
              <option value="true">true</option>
              <option value="numeric">&quot;numeric&quot;</option>
            </select>
            <span className="shrink-0 text-white/30">,</span>
            <span className="shrink-0 text-white/55">max:</span>
            <select
              value={max}
              onChange={(e) => setMax(e.target.value as MaxChoice)}
              className={`${selectClass} text-amber-200`}
            >
              <option value="none">–</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
            <span className="shrink-0 text-white/30">,</span>
            <span className="shrink-0 text-white/55">locale:</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              style={{ width: `calc(${locale.length + 2}ch + 0.75rem)` }}
              className={`${selectClass} text-emerald-300`}
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
            {TYPE_HINTS[type]}
            {sort !== "none" && " · sorted with Intl.Collator"}
            {max !== "none" && " · overflow collapses into +N"}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setItemsRaw(preset)}
                className={`cursor-pointer rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  itemsRaw === preset
                    ? "border-sky-300/40 bg-sky-300/[0.08] text-sky-300"
                    : "border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
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

          <div className="flex min-h-10 w-full min-w-0 items-center justify-center sm:min-h-12">
            {result ? (
              <div className="relative w-full min-w-0">
                {/* invisible sizer — reserves the final height so typing never reflows */}
                <p
                  aria-hidden
                  className="invisible w-full break-words text-center text-4xl tracking-tight sm:text-5xl"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {result}
                  <span className="ml-[2px] inline-block h-[1.2em] w-[2px] align-middle" />
                </p>
                <p
                  className="absolute inset-x-0 top-0 w-full break-words text-center text-4xl tracking-tight text-white/90 sm:text-5xl"
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
              </div>
            ) : (
              <p className="font-serif text-sm italic text-white/15">result</p>
            )}
          </div>

          {parts && (
            <div
              className={`flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 font-mono text-[11px] transition-opacity duration-200 ${
                done ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-white/25">anymanyParts →</span>
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
            </div>
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-3xl flex-col items-center justify-center gap-1 px-6 py-2 sm:min-h-12 sm:flex-row sm:justify-between sm:py-0">
          <p className="text-center font-mono text-[11px] text-white/30">
            Intl is powerful. anymany makes it usable.
          </p>

          <div className="flex items-center">
            {[
              ["github", "https://github.com/kirilinsky/anymany"],
              ["npm", "https://www.npmjs.com/package/anymany"],
              ["anywhen", "https://anywhen-kappa.vercel.app/"],
              ["anyamount", "https://anyamount.vercel.app/"],
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
