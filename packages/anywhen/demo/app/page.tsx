"use client";

import { useEffect, useRef, useState } from "react";
import { anywhen } from "anywhen";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";
import Link from "next/link";
import { Logo } from "@/logo/logo";

type Mode = "smart" | "absolute" | "relative";

const LOCALES = ["en", "en-GB", "ru", "de", "fr", "ja", "sr-Latn-RS"];

const MODE_HINTS: Record<Mode, string> = {
  smart: "context-aware — relative if near, absolute if far",
  absolute: "locale-aware date formatting",
  relative: "human-readable relative time",
};

function localValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function q(value: string) {
  return JSON.stringify(value);
}

function useTypewriter(text: string | null) {
  const [displayed, setDisplayed] = useState("");
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      prev.current = null;
      return;
    }
    if (text === prev.current) return;
    prev.current = text;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);

  return displayed;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("smart");
  const [dateStr, setDateStr] = useState(() => localValue(new Date()));
  const [locale, setLocale] = useState("en");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dateBtnRef = useRef<HTMLButtonElement>(null);
  const dateCalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !dateBtnRef.current?.contains(target) &&
        !dateCalRef.current?.contains(target)
      ) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [calendarOpen]);

  const date = new Date(dateStr);

  const calendarLocale = (() => {
    try {
      new Intl.DateTimeFormat(locale);
      return locale;
    } catch {
      return "en";
    }
  })();

  const result = (() => {
    if (Number.isNaN(date.getTime())) return null;
    try {
      return anywhen(dateStr, { mode, locale });
    } catch {
      return null;
    }
  })();

  const typed = useTypewriter(result);
  const done = typed === result && !!result;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-20">
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-20 flex w-full max-w-3xl flex-col items-center gap-8">
        <Logo className="h-auto w-36 opacity-90" />

        <div className="relative w-fit max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
          <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:flex-nowrap sm:justify-start sm:text-base">
            <span className="shrink-0 text-amber-400">anywhen</span>
            <span className="shrink-0 text-white/30">(</span>
            <button
              ref={dateBtnRef}
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              className="flex h-8 min-w-0 shrink items-center rounded-md border border-transparent px-1.5 text-left text-sky-300 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
            >
              <span className="block truncate">{q(dateStr)}</span>
            </button>
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
              <option value="absolute">&quot;absolute&quot;</option>
              <option value="relative">&quot;relative&quot;</option>
            </select>
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

          {calendarOpen && (
            <div
              ref={dateCalRef}
              className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 overflow-hidden rounded-xl shadow-2xl"
            >
              <Calendar
                locale={calendarLocale}
                width="296px"
                value={Number.isNaN(date.getTime()) ? undefined : date}
                theme="dark"
                onChange={(value) => {
                  if (value) setDateStr(localValue(value));
                }}
              >
                <CalendarNav home showMonthPicker showTime compactYears />
                <CalendarDays />
              </Calendar>
            </div>
          )}
        </div>

        <div className="flex min-h-24 w-full items-center justify-center">
          {typed ? (
            <p
              className="text-center text-4xl tracking-tight text-white/90 sm:text-5xl"
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
      </div>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-2xl items-center px-6">
          {[
            ["github", "https://github.com/kirilinsky/anywhen"],
            ["npm", "https://www.npmjs.com/package/anywhen"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-3 text-xs uppercase tracking-widest text-white/25 transition-colors hover:text-white/60"
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
      </footer>
    </main>
  );
}
