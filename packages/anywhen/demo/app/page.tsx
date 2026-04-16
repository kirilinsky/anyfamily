"use client";

import { useState, useEffect, useRef } from "react";
import { anydate, anywhen, anyago } from "anywhen";
import { Calendar } from "react-calendar-datetime";
import { Logo } from "@/logo/logo";
import Link from "next/link";

type Method = "anydate" | "anywhen" | "anyago";

const LOCALES = ["en", "ru", "de", "fr", "ja", "ar", "sr", "zh", "es", "it"];

const METHOD_DESC: Record<Method, string> = {
  anydate: "always absolute — what date exactly",
  anywhen:
    "smart context — relative when recent, absolute when old, future when ahead",
  anyago: "always relative — how long ago or how far ahead",
};

function getResult(
  method: Method,
  date: Date,
  locale: string,
  numeric: boolean,
  noClock: boolean,
): string {
  try {
    if (method === "anydate") return anydate(date, locale);
    if (method === "anywhen") return anywhen(date, locale, !noClock);
    if (method === "anyago") return anyago(date, locale, numeric);
    return "";
  } catch {
    return "invalid locale";
  }
}

function useTypewriter(text: string | null, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (text === null) {
      setDisplayed("");
      prev.current = null;
      return;
    }
    if (text === prev.current) return;
    prev.current = text;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return displayed;
}

export default function Home() {
  const [method, setMethod] = useState<Method>("anywhen");
  const [dateStr, setDateStr] = useState(() =>
    new Date().toISOString().slice(0, 16),
  );
  const [locale, setLocale] = useState("en");
  const [numeric, setNumeric] = useState(false);
  const [noClock, setNoClock] = useState(false);
  const [localeFocused, setFocused] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  const date = new Date(dateStr);
  const valid = !isNaN(date.getTime()) && locale.length >= 2;
  const result = valid
    ? getResult(method, date, locale, numeric, noClock)
    : null;

  const typed = useTypewriter(result);
  const done = typed === result && !!result;

  const ms = date.getTime() - Date.now();
  const absDays = Math.abs(ms) / 86_400_000;
  const absS = Math.abs(ms) / 1000;

  const showNumeric = method === "anyago" && absS >= 79200 && absDays < 25;
  const showNoClock =
    method === "anywhen" && absS >= 3600 && absDays < 7 && ms < 0;

  useEffect(() => {
    if (!showNumeric) setNumeric(false);
  }, [showNumeric]);
  useEffect(() => {
    if (!showNoClock) setNoClock(false);
  }, [showNoClock]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div
        ref={calendarRef}
        className="relative z-20 flex flex-col items-center gap-6 w-full max-w-3xl px-4"
      >
        <Logo className="w-48 h-auto -mb-2" />

        <div className="  w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_32px_64px_-12px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-center flex-wrap gap-1 font-mono text-base">
            <div className="relative group">
              <select
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value as Method);
                  setNumeric(false);
                  setNoClock(false);
                }}
                className="appearance-none bg-transparent text-amber-400 font-mono text-base pr-5 cursor-pointer outline-none rounded-md px-2 py-1 hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.1]"
              >
                <option value="anywhen">anywhen</option>
                <option value="anydate">anydate</option>
                <option value="anyago">anyago</option>
              </select>
              <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-amber-400/40 text-[10px]">
                ▾
              </span>
            </div>

            <span className="text-white/30">(</span>

            <button
              onClick={() => setCalendarOpen((o) => !o)}
              className={`bg-transparent text-sky-300 font-mono text-base outline-none cursor-pointer rounded-md px-2 py-1 transition-colors border ${calendarOpen ? "bg-white/[0.06] border-white/[0.15]" : "border-transparent hover:bg-white/[0.06] hover:border-white/[0.1]"}`}
            >
              {date && !isNaN(date.getTime())
                ? date.toLocaleString(locale || "en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "pick date"}
            </button>
            {calendarOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 shadow-2xl rounded-xl overflow-hidden">
                <Calendar
                  value={date}
                  onChange={(d) => {
                    if (d) {
                      const pad = (n: number) => String(n).padStart(2, "0");
                      setDateStr(
                        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
                      );
                    }
                  }}
                  theme="carbon"
                  showHomeButton
                  locale={locale || "en"}
                  width="291px"
                />
              </div>
            )}

            <span className="text-white/30">,</span>

            <div className="relative">
              <input
                type="text"
                value={locale}
                onChange={(e) => setLocale(e.target.value.slice(0, 10))}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="en"
                className="bg-transparent text-emerald-400 font-mono text-base outline-none w-[4ch] placeholder-white/20 rounded-md px-2 py-1 hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.1] focus:border-white/[0.15] focus:bg-white/[0.06]"
              />
              {localeFocused && (
                <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-1 bg-[#141414] border border-white/[0.08] rounded-xl p-2 z-30 min-w-[200px] shadow-2xl">
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocale(l)}
                      className="px-2 py-0.5 rounded-md text-xs font-mono text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showNumeric && (
              <>
                <span className="text-white/30">,</span>
                <button
                  onClick={() => setNumeric((n) => !n)}
                  className={`font-mono cursor-pointer text-base rounded-md px-2 py-1 border transition-colors ${numeric ? "text-violet-400 border-violet-400/30 bg-violet-400/10" : "text-white/25 border-transparent hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-white/50"}`}
                >
                  {numeric ? "numeric" : "no numeric"}
                </button>
              </>
            )}

            {showNoClock && (
              <>
                <span className="text-white/30">,</span>
                <button
                  onClick={() => setNoClock((n) => !n)}
                  className={`font-mono cursor-pointer text-base rounded-md px-2 py-1 border transition-colors ${noClock ? "text-rose-400 border-rose-400/30 bg-rose-400/10" : "text-white/25 border-transparent hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-white/50"}`}
                >
                  {noClock ? "no clock" : "clock"}
                </button>
              </>
            )}

            <span className="text-white/30">)</span>
          </div>

          <div className="mt-3 flex justify-center">
            <p
              className="text-white/20 text-xs tracking-wide transition-all duration-300"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
            >
              {METHOD_DESC[method]}
            </p>
          </div>

          <div className="mt-3 pt-4 border-t border-white/[0.06] min-h-[3.5rem] flex items-center justify-center">
            {typed ? (
              <p
                className="text-white/85 text-2xl tracking-tight text-center"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {typed}
                <span
                  className="inline-block w-[2px] h-[1.2em] bg-white/60 ml-[2px] align-middle"
                  style={{
                    animation: done ? "blink 1s step-end infinite" : "none",
                    opacity: done ? undefined : 1,
                  }}
                />
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
              </p>
            ) : (
              <p
                className="text-white/15 text-sm italic text-center"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                result
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/kirilinsky/anywhen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300 px-3 py-3"
            >
              github
            </a>
            <a
              href="https://www.npmjs.com/package/anywhen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300 px-3 py-3"
            >
              npm
            </a>
            <Link
              className="text-white/25 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-300 px-3 py-3"
              href={"/docs"}
            >
              docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
