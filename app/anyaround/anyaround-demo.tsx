"use client";

import { useEffect, useState } from "react";
import { anyaround } from "anyaround";
import type { AnyaroundOptions, Display, Mode } from "anyaround";

const LOCALES = ["en", "de", "ru", "ja", "ar", "hi", "pt-BR", "fr"];

const MODES: Mode[] = [
  "smart",
  "region",
  "language",
  "script",
  "currency",
  "calendar",
];

const DISPLAYS: Display[] = ["name", "flag", "flag-name", "name-flag"];

const PRESETS = ["US", "JP", "DE", "en", "fr", "Cyrl", "EUR", "419"];

const MODE_HINTS: Record<Mode, string> = {
  smart: "auto-detects the kind from the code's shape",
  region: "countries & regions — the only kind with a flag",
  language: "languages via BCP 47 / ISO 639",
  script: "writing systems via ISO 15924",
  currency: "currency names (not a rate)",
  calendar: "calendar systems — never auto-detected",
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

export function AnyaroundDemo() {
  const [mode, setMode] = useState<Mode>("smart");
  const [codeStr, setCodeStr] = useState("US");
  const [locale, setLocale] = useState("en");
  const [display, setDisplay] = useState<Display>("flag-name");
  const [languageDisplay, setLanguageDisplay] = useState<"dialect" | "standard">(
    "dialect",
  );

  const showsDisplay = mode === "smart" || mode === "region";
  const showsLanguageDisplay = mode === "language";

  const options: AnyaroundOptions = {
    mode,
    locale,
    ...(showsDisplay ? { display } : {}),
    ...(showsLanguageDisplay ? { languageDisplay } : {}),
  };

  const result = (() => {
    if (codeStr.trim() === "") return null;
    try {
      return anyaround(codeStr, options);
    } catch {
      return null;
    }
  })();

  const info = (() => {
    if (codeStr.trim() === "") return null;
    try {
      return anyaround.info(codeStr, options);
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
          <span className="shrink-0 text-accent">anyaround</span>
          <span className="shrink-0 text-white/30">(</span>
          <input
            data-testid="input-code"
            value={codeStr}
            onChange={(e) => setCodeStr(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="code"
            style={{
              width: `calc(${Math.max(codeStr.length, 1)}ch + 1.75rem)`,
            }}
            className="h-8 shrink-0 rounded-md border border-transparent px-1.5 text-center text-sky-300 outline-none transition-colors hover:border-white/10 hover:bg-white/[0.05] focus:border-sky-300/40"
          />
          <span className="shrink-0 text-white/30">, {"{"}</span>
          <span className="shrink-0 text-white/55">mode:</span>
          <select
            data-testid="select-mode"
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
            {MODES.map((m) => (
              <option key={m} value={m}>
                &quot;{m}&quot;
              </option>
            ))}
          </select>
          {showsDisplay && (
            <>
              <span className="shrink-0 text-white/30">,</span>
              <span className="shrink-0 text-white/55">display:</span>
              <select
                data-testid="select-display"
                value={display}
                onChange={(e) => setDisplay(e.target.value as Display)}
                aria-label="display"
                style={{ width: `calc(${display.length + 2}ch + 0.75rem)` }}
                className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-amber-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
              >
                {DISPLAYS.map((d) => (
                  <option key={d} value={d}>
                    &quot;{d}&quot;
                  </option>
                ))}
              </select>
            </>
          )}
          {showsLanguageDisplay && (
            <>
              <span className="shrink-0 text-white/30">,</span>
              <span className="shrink-0 text-white/55">languageDisplay:</span>
              <select
                data-testid="select-languageDisplay"
                value={languageDisplay}
                onChange={(e) =>
                  setLanguageDisplay(e.target.value as "dialect" | "standard")
                }
                aria-label="languageDisplay"
                style={{
                  width: `calc(${languageDisplay.length + 2}ch + 0.75rem)`,
                }}
                className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-amber-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
              >
                <option value="dialect">&quot;dialect&quot;</option>
                <option value="standard">&quot;standard&quot;</option>
              </select>
            </>
          )}
          <span className="shrink-0 text-white/30">,</span>
          <span className="shrink-0 text-white/55">locale:</span>
          <select
            data-testid="select-locale"
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
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setCodeStr(p)}
            className={`rounded-md border px-2 py-1 transition-colors ${
              codeStr === p
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
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/25 uppercase">
            output
          </p>
          <p className="mt-1 text-sm text-white/35 italic">what your users see</p>
        </div>

        <div className="flex min-h-10 w-full min-w-0 items-center justify-center sm:min-h-12">
          {result ? (
            <div className="relative w-full">
              {/* invisible sizer with the final text reserves the exact end height */}
              <p
                aria-hidden
                className="invisible w-full text-center text-4xl tracking-tight break-words sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {result}
                <span className="ml-[2px] inline-block h-[1.2em] w-[2px] bg-white/60 align-middle" />
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
            </div>
          ) : (
            <p className="font-serif text-sm text-white/15 italic">result</p>
          )}
        </div>

        <div
          className={`flex min-h-6 max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 font-mono text-[11px] transition-opacity duration-200 ${
            done ? "opacity-100" : "opacity-0"
          }`}
        >
          {info && (
            <>
              <span className="text-white/25">anyaround.info →</span>
              {(
                [
                  ["code", info.code],
                  ["type", info.type],
                  ["name", info.name || "∅"],
                  ["flag", info.flag || "∅"],
                  ["found", info.found ? "true" : "false"],
                ] as const
              ).map(([key, val]) => (
                <span
                  key={key}
                  className="inline-flex items-baseline gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5"
                >
                  <span className="text-[9px] tracking-wider text-white/25 uppercase">
                    {key}
                  </span>
                  <span className="text-white/65">{val}</span>
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
