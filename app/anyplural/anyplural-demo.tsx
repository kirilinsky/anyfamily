"use client";

import { useEffect, useState } from "react";
import { anyplural, anypluralParts, type Forms } from "anyplural";

type PluralType = "cardinal" | "ordinal";

const LOCALES = ["en", "ru", "pl", "fr", "uk", "ar", "ja"];

const TYPE_HINTS: Record<PluralType, string> = {
  cardinal: "how many — count leads, word follows",
  ordinal: "which position — form attaches as a suffix",
};

// Preset forms per locale, so switching locale shows a meaningful example.
const PRESETS: Record<string, Record<PluralType, Forms>> = {
  en: {
    cardinal: { one: "item", other: "items" },
    ordinal: { one: "st", two: "nd", few: "rd", other: "th" },
  },
  ru: {
    cardinal: { one: "год", few: "года", many: "лет" },
    ordinal: { other: "-й" },
  },
  pl: {
    cardinal: { one: "plik", few: "pliki", many: "plików" },
    ordinal: { other: "." },
  },
  fr: {
    cardinal: { one: "jour", other: "jours" },
    ordinal: { one: "er", other: "e" },
  },
  uk: {
    cardinal: { one: "рік", few: "роки", many: "років" },
    ordinal: { other: "-й" },
  },
  ar: {
    cardinal: {
      zero: "لا عناصر",
      one: "عنصر",
      two: "عنصران",
      few: "عناصر",
      many: "عنصرًا",
      other: "عنصر",
    },
    ordinal: { other: "." },
  },
  ja: {
    cardinal: { other: "個" },
    ordinal: { other: "番目" },
  },
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
    }, 40);
    return () => clearInterval(id);
  }, [text]);

  if (!text || state.source !== text) return "";
  return state.displayed;
}

export function AnypluralDemo() {
  const [count, setCount] = useState(5);
  const [locale, setLocale] = useState("en");
  const [type, setType] = useState<PluralType>("cardinal");
  // Edits are stored per locale+type and the visible forms derived from them,
  // rather than one `forms` state resynced by an effect. Switching locale then
  // switching back keeps whatever was typed, and there is no cascading render.
  const [edits, setEdits] = useState<Record<string, Forms>>({});

  const editKey = `${locale}:${type}`;
  const forms = edits[editKey] ?? PRESETS[locale]?.[type] ?? PRESETS.en.cardinal;

  const setForm = (key: string, value: string) =>
    setEdits((prev) => ({ ...prev, [editKey]: { ...forms, [key]: value } }));

  const result = (() => {
    try {
      return anyplural(count, forms, { locale, type });
    } catch {
      return null;
    }
  })();

  const parts = (() => {
    try {
      return anypluralParts(count, forms, { locale, type });
    } catch {
      return null;
    }
  })();

  const typed = useTypewriter(result);
  const done = typed === result && !!result;

  return (
    <>
      <div className="relative w-fit max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
        <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:text-base">
          <span className="shrink-0 text-accent">anyplural</span>
          <span className="shrink-0 text-white/30">(</span>

          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            aria-label="count"
            className="h-8 w-16 shrink-0 rounded-md border border-transparent bg-white/[0.05] px-1.5 text-center text-sky-300 outline-none transition-colors hover:border-white/10 focus:border-sky-300/40"
          />

          <span className="shrink-0 text-white/30">, {"{"}</span>

          {Object.entries(forms).map(([key, value], i) => (
            <span key={key} className="flex shrink-0 items-center gap-1">
              {i > 0 && <span className="text-white/30">,</span>}
              <span className="text-white/55">{key}:</span>
              <input
                value={value}
                onChange={(e) => setForm(key, e.target.value)}
                size={Math.max(value.length, 1)}
                aria-label={`${key} form`}
                className="h-8 max-w-[8rem] min-w-0 rounded-md border border-transparent bg-white/[0.05] px-1.5 text-center text-rose-300 outline-none transition-colors hover:border-white/10 focus:border-rose-300/40"
              />
            </span>
          ))}

          <span className="shrink-0 text-white/30">{"}"}</span>

          <span className="shrink-0 text-white/30">, {"{"}</span>

          <span className="shrink-0 text-white/55">locale:</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            style={{ width: `calc(${locale.length + 2}ch + 1.5rem)` }}
            className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent px-1.5 font-mono text-emerald-300 outline-none hover:border-white/10 hover:bg-white/[0.05]"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                &quot;{l}&quot;
              </option>
            ))}
          </select>

          <span className="shrink-0 text-white/30">,</span>

          <span className="shrink-0 text-white/55">type:</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PluralType)}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23c4b5fd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")",
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "0.6rem",
            }}
            className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border border-violet-300/30 bg-violet-300/[0.06] pr-6 pl-2 font-mono text-violet-300 outline-none transition-colors hover:border-violet-300/60 hover:bg-violet-300/[0.12]"
          >
            <option value="cardinal">&quot;cardinal&quot;</option>
            <option value="ordinal">&quot;ordinal&quot;</option>
          </select>

          <span className="shrink-0 text-white/30">{"})"}</span>
        </div>

        <p className="mt-2 text-center font-sans text-xs text-white/35 italic">
          {TYPE_HINTS[type]}
        </p>
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
              {/* invisible sizer: full result reserves height so typing never shifts layout */}
              <p
                aria-hidden
                className="invisible w-full text-center text-4xl tracking-tight break-words sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {result}
              </p>
              <p
                className="absolute inset-x-0 top-0 w-full text-center text-4xl tracking-tight break-words text-white/90 sm:text-5xl"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {typed}
              </p>
            </>
          ) : (
            <p className="font-serif text-sm text-red-300/40 italic">
              no form resolves for this count
            </p>
          )}
        </div>

        {parts && (
          <div
            className={`flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 font-mono text-[11px] transition-opacity duration-200 ${done ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-white/25">anypluralParts →</span>
            {parts.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-baseline gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5"
              >
                <span className="text-white/65">{JSON.stringify(p.value)}</span>
                <span className="text-[9px] tracking-wider text-white/25 uppercase">
                  {p.type}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
