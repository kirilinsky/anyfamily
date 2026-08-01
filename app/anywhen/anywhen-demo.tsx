"use client";

import { useEffect, useRef, useState } from "react";
import { anywhen } from "anywhen";
import { Calendar } from "@dateforge/react-calendar";
import { CalendarDays, CalendarNav } from "@dateforge/react-calendar/modules";

type Mode = "smart" | "absolute" | "relative";

const LOCALES = ["en", "ru", "ja", "ar", "hi", "pt-BR", "sr-Latn-RS"];

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

export function AnywhenDemo() {
  const [mode, setMode] = useState<Mode>("smart");
  // Safe to read the clock during the initial render: DemoShell's MountGate
  // means this component never renders on the server, so "now" is the visitor's
  // now and there is no prerendered value to mismatch against.
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
  const validDate = dateStr !== "" && !Number.isNaN(date.getTime());

  const calendarLocale = (() => {
    try {
      new Intl.DateTimeFormat(locale);
      return locale;
    } catch {
      return "en";
    }
  })();

  const result = (() => {
    if (!validDate) return null;
    try {
      return anywhen(dateStr, { mode, locale });
    } catch {
      return null;
    }
  })();

  const parts = (() => {
    if (!validDate) return null;
    try {
      return anywhen.parts(dateStr, { mode, locale });
    } catch {
      return null;
    }
  })();

  const typed = useTypewriter(result);
  const done = typed === result && !!result;

  return (
    <>
      <div className="relative w-fit max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
        <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:flex-nowrap sm:justify-start sm:text-base">
          <span className="shrink-0 text-accent">anywhen</span>
          <span className="shrink-0 text-white/30">(</span>
          <button
            ref={dateBtnRef}
            type="button"
            onClick={() => setCalendarOpen((v) => !v)}
            aria-label="pick a date"
            className="flex h-8 min-w-0 shrink items-center rounded-md border border-transparent px-1.5 text-left text-sky-300 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
          >
            <span className="block truncate">{q(dateStr)}</span>
          </button>
          <span className="shrink-0 text-white/30">, {"{"}</span>
          <span className="shrink-0 text-white/55">mode:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            aria-label="mode"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "0.6rem",
            }}
            className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-violet-300/30 bg-violet-300/[0.06] pr-6 pl-2 font-mono text-violet-300 outline-none transition-colors hover:border-violet-300/60 hover:bg-violet-300/[0.12]"
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
            aria-label="locale"
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

        <p className="mt-2 text-center font-sans text-xs text-white/35 italic">
          {MODE_HINTS[mode]}
        </p>

        {calendarOpen && (
          <div
            ref={dateCalRef}
            className="absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 overflow-hidden rounded-xl shadow-2xl"
          >
            <Calendar
              locale={calendarLocale}
              width="300px"
              value={validDate ? date : undefined}
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

      <div className="flex min-h-28 w-full flex-col items-center justify-center gap-3">
        <div className="text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/25 uppercase">
            output
          </p>
          <p className="mt-1 text-sm text-white/35 italic">what your users see</p>
        </div>

        <div className="relative flex min-h-10 w-full min-w-0 items-center justify-center sm:min-h-12">
          {result ? (
            <>
              {/* invisible sizer: full result reserves height so typing/reset never shifts layout */}
              <p
                aria-hidden
                className="invisible w-full text-center text-4xl tracking-tight break-words sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {result}
                <span className="ml-[2px] inline-block h-[1.2em] w-[2px] align-middle" />
              </p>
              <p
                className="absolute inset-x-0 top-0 w-full text-center text-4xl tracking-tight break-words text-white/90 sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {typed}
                <span
                  className={`ml-[2px] inline-block h-[1.2em] w-[2px] bg-white/60 align-middle ${
                    done ? "animate-caret-blink" : ""
                  }`}
                />
              </p>
            </>
          ) : (
            <p className="font-serif text-sm text-white/15 italic">result</p>
          )}
        </div>

        {parts && (
          <div
            className={`flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 font-mono text-[11px] transition-opacity duration-200 ${done ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-white/25">anywhen.parts →</span>
            {parts.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-baseline gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5"
              >
                <span className="text-white/65">{JSON.stringify(p.value)}</span>
                <span className="text-[9px] tracking-wider text-white/25 uppercase">
                  {p.type}
                  {p.unit ? ` · ${p.unit}` : ""}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
