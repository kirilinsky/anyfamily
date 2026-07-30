"use client";

import { useMemo, useState } from "react";
import { anywordCount, anywordParts, anywordTruncate } from "anyword";
import type { Granularity } from "anyword";

const LOCALES = ["en", "ru", "ja", "th", "zh", "ar", "pt-BR"];

const BY_HINTS: Record<Granularity, string> = {
  word: "words — locale-aware, even without spaces",
  grapheme: "user-perceived characters — emoji and accents kept whole",
  sentence: "sentences — per the Unicode sentence-break rules",
};

const SAMPLES: { label: string; text: string; by: Granularity; locale: string }[] =
  [
    { label: "mixed", text: "don't stop 世界", by: "word", locale: "en" },
    { label: "emoji", text: "héllo 👨‍👩‍👧 hi", by: "grapheme", locale: "en" },
    { label: "thai", text: "สวัสดีชาวโลก", by: "word", locale: "th" },
    { label: "japanese", text: "これは日本語です", by: "word", locale: "ja" },
    { label: "sentences", text: "Hi. Go now! Really?", by: "sentence", locale: "en" },
  ];

function q(value: string) {
  return JSON.stringify(value);
}

/** Whitespace has no glyph — show it as a visible middot run instead. */
function visible(segment: string) {
  return segment.trim() === "" ? "·".repeat(segment.length) : segment;
}

export function AnywordDemo() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [by, setBy] = useState<Granularity>("word");
  const [locale, setLocale] = useState("en");
  const [raw, setRaw] = useState(false);
  const [limit, setLimit] = useState(6);

  const rawUsed = by === "word" && raw;

  const parts = useMemo(() => {
    try {
      return anywordParts(text, { by, locale, raw });
    } catch {
      return [];
    }
  }, [text, by, locale, raw]);

  const count = useMemo(() => {
    try {
      return anywordCount(text, { by, locale, raw });
    } catch {
      return 0;
    }
  }, [text, by, locale, raw]);

  const graphemes = useMemo(() => {
    try {
      return anywordCount(text, { by: "grapheme", locale });
    } catch {
      return 0;
    }
  }, [text, locale]);

  const truncated = useMemo(() => {
    try {
      return anywordTruncate(text, limit, { locale, ellipsis: "…" });
    } catch {
      return "";
    }
  }, [text, limit, locale]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => {
              setText(s.text);
              setBy(s.by);
              setLocale(s.locale);
            }}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              text === s.text
                ? "border-accent/40 bg-accent/[0.08] text-accent/90"
                : "border-white/[0.07] text-white/30 hover:border-white/15 hover:text-white/60"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
        <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:justify-start sm:text-base">
          <span className="shrink-0 text-accent">anyword</span>
          <span className="shrink-0 text-white/30">(</span>
          <span className="shrink-0 text-sky-300">&quot;</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            aria-label="text to segment"
            className="h-8 min-w-24 flex-1 rounded-md border border-transparent bg-transparent px-1 text-sky-300 outline-none transition-colors hover:border-white/10 hover:bg-white/[0.05] focus:border-white/15 focus:bg-white/[0.05]"
          />
          <span className="shrink-0 text-sky-300">&quot;</span>
          <span className="shrink-0 text-white/30">, {"{"}</span>
          <span className="shrink-0 text-white/55">by:</span>
          <select
            value={by}
            onChange={(e) => setBy(e.target.value as Granularity)}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "0.6rem",
            }}
            className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-violet-300/30 bg-violet-300/[0.06] pr-6 pl-2 font-mono text-violet-300 outline-none transition-colors hover:border-violet-300/60 hover:bg-violet-300/[0.12]"
          >
            <option value="word">&quot;word&quot;</option>
            <option value="grapheme">&quot;grapheme&quot;</option>
            <option value="sentence">&quot;sentence&quot;</option>
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
          <span className="shrink-0 text-white/30">,</span>
          <span
            className={`shrink-0 transition-colors ${by === "word" ? "text-white/55" : "text-white/20"}`}
          >
            raw:
          </span>
          <button
            type="button"
            disabled={by !== "word"}
            onClick={() => setRaw((v) => !v)}
            className={`h-8 shrink-0 rounded-md border px-2 font-mono transition-colors ${
              by !== "word"
                ? "cursor-not-allowed border-transparent text-white/15"
                : raw
                  ? "border-rose-300/40 bg-rose-300/[0.08] text-rose-300"
                  : "border-transparent text-white/40 hover:border-white/10 hover:bg-white/[0.05]"
            }`}
          >
            {String(raw)}
          </button>
          <span className="shrink-0 text-white/30">{"})"}</span>
        </div>

        <p className="mt-2 text-center font-sans text-xs text-white/35 italic">
          {BY_HINTS[by]}
          {by !== "word" && raw ? " · raw does nothing here" : ""}
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <div className="text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/25 uppercase">
            segments
          </p>
          <p className="mt-1 text-sm text-white/35 italic">
            where the real boundaries are
          </p>
        </div>

        <div className="flex min-h-16 w-full flex-wrap items-center justify-center gap-1.5">
          {parts.length ? (
            parts.map((p, i) => (
              <span
                key={`${p.index}-${i}`}
                className={`inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors ${
                  p.isWordLike === false
                    ? "border-white/[0.05] bg-white/[0.01] text-white/30"
                    : "border-white/[0.09] bg-white/[0.04] text-white/90"
                }`}
              >
                <span
                  className="text-xl tracking-tight sm:text-2xl"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {visible(p.segment)}
                </span>
                <span className="font-mono text-[9px] tracking-wider text-white/25">
                  {p.index}
                </span>
              </span>
            ))
          ) : (
            <p className="font-serif text-sm text-white/15 italic">
              {text ? "no segments" : "type something"}
            </p>
          )}
        </div>

        <div className="mt-2 grid w-full gap-2 font-mono text-xs sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase">
              anywordCount
            </p>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl text-emerald-300">{count}</span>
              <span className="text-white/35">
                {by}
                {rawUsed ? " + raw" : ""}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-white/25">
              .length says {text.length} · .split(/\s+/) says{" "}
              {text.trim() ? text.trim().split(/\s+/).length : 0}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase">
              anywordTruncate
            </p>
            <p className="mt-1.5 min-h-8 text-base break-words text-white/85">
              {truncated ? q(truncated) : <span className="text-white/20">&quot;&quot;</span>}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={Math.max(graphemes, 1)}
                value={Math.min(limit, Math.max(graphemes, 1))}
                onChange={(e) => setLimit(Number(e.target.value))}
                aria-label="truncate limit"
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
              />
              <span className="shrink-0 text-[11px] text-white/35">
                {Math.min(limit, Math.max(graphemes, 1))} graphemes
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
