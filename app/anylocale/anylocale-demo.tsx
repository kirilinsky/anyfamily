"use client";

import { useMemo, useState } from "react";
import { anylocale } from "anylocale";

/**
 * Locales chosen to break a different assumption each:
 * en-US/en-GB — same language, different week and clock;
 * ar-EG/he-IL — both rtl, different digits and week start;
 * fa-IR — a one-day weekend.
 */
const PRESETS = [
  { tag: "en-US", note: "week starts Sunday" },
  { tag: "en-GB", note: "same language, Monday" },
  { tag: "ar-EG", note: "rtl, Arabic digits" },
  { tag: "he-IL", note: "rtl, Latin digits" },
  { tag: "fa-IR", note: "one-day weekend" },
  { tag: "ja-JP", note: "many calendars" },
];

const DAY_LABEL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** A sample rendered in the locale's own direction, so rtl is visible not stated. */
const SAMPLE: Record<string, string> = {
  "ar-EG": "مرحبا بالعالم",
  "he-IL": "שלום עולם",
  "fa-IR": "سلام دنیا",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
      <p className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
        {label}
      </p>
      <div className="mt-1.5 font-mono text-sm text-white/85">{children}</div>
    </div>
  );
}

export function AnylocaleDemo() {
  const [tag, setTag] = useState("en-US");

  const info = useMemo(() => {
    try {
      return anylocale.supported ? anylocale(tag) : null;
    } catch {
      return null;
    }
  }, [tag]);

  // The week in the locale's own order, starting from its first day.
  const week = useMemo(() => {
    if (!info) return [];
    const weekend = new Set<number>(info.weekend);
    return Array.from({ length: 7 }, (_, i) => {
      const iso = ((info.weekStart - 1 + i) % 7) + 1;
      return { iso, label: DAY_LABEL[iso - 1], weekend: weekend.has(iso) };
    });
  }, [info]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.tag}
            type="button"
            onClick={() => setTag(p.tag)}
            title={p.note}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              tag === p.tag
                ? "border-accent/40 bg-accent/[0.08] text-accent/90"
                : "border-white/[0.07] text-white/30 hover:border-white/15 hover:text-white/60"
            }`}
          >
            {p.tag}
          </button>
        ))}
      </div>

      <div className="w-full max-w-full rounded-xl border border-white/[0.07] bg-black/30 px-4 py-3.5 font-mono">
        <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-sm sm:justify-start sm:text-base">
          <span className="shrink-0 text-accent">anylocale</span>
          <span className="shrink-0 text-white/30">(</span>
          <span className="shrink-0 text-sky-300">&quot;</span>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            spellCheck={false}
            aria-label="BCP 47 locale tag"
            style={{ width: `calc(${Math.max(tag.length, 4)}ch + 0.5rem)` }}
            className="h-8 rounded-md border border-transparent bg-transparent px-1 text-sky-300 outline-none transition-colors hover:border-white/10 hover:bg-white/[0.05] focus:border-white/15 focus:bg-white/[0.05]"
          />
          <span className="shrink-0 text-sky-300">&quot;</span>
          <span className="shrink-0 text-white/30">)</span>
        </div>

        <p className="mt-2 text-center font-sans text-xs text-white/35 italic">
          {info
            ? `resolved to ${info.tag}`
            : anylocale.supported
              ? "not a valid BCP 47 tag"
              : "this browser has no Intl Locale Info"}
        </p>
      </div>

      {info && (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="text-center">
            <p className="font-mono text-[11px] tracking-[0.22em] text-white/25 uppercase">
              the week
            </p>
            <p className="mt-1 text-sm text-white/35 italic">
              in this locale&apos;s own order
            </p>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-1.5">
            {week.map((d, i) => (
              <div
                key={d.iso}
                className={`flex min-w-14 flex-col items-center rounded-lg border px-3 py-2 transition-colors ${
                  d.weekend
                    ? "border-accent/40 bg-accent/[0.10] text-accent/90"
                    : "border-white/[0.08] bg-white/[0.03] text-white/70"
                }`}
              >
                <span className="font-mono text-sm">{d.label}</span>
                <span className="mt-0.5 font-mono text-[9px] text-white/25">
                  {i === 0 ? "first" : d.weekend ? "weekend" : d.iso}
                </span>
              </div>
            ))}
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="direction">
              <span
                dir={info.direction}
                className="flex items-baseline gap-2"
                style={{ textAlign: info.direction === "rtl" ? "right" : "left" }}
              >
                <span className="text-accent">{info.direction}</span>
                <span className="text-white/40">
                  {SAMPLE[info.tag] ?? "Hello world"}
                </span>
              </span>
            </Field>

            <Field label="week starts">
              <span className="text-accent">{info.weekStart}</span>
              <span className="ml-2 text-white/40">
                {DAY_LABEL[info.weekStart - 1]} — ISO numbering
              </span>
            </Field>

            <Field label="weekend">
              <span className="text-accent">
                {JSON.stringify(info.weekend)}
              </span>
              <span className="ml-2 text-white/40">
                {info.weekend.map((d) => DAY_LABEL[d - 1]).join(", ")}
              </span>
            </Field>

            <Field label="hour cycle">
              <span className="text-accent">{info.hourCycles[0] ?? "—"}</span>
              <span className="ml-2 text-white/40">
                {info.hourCycles[0] === "h12" ? "2:30 PM" : "14:30"}
              </span>
            </Field>

            <Field label="digits">
              <span className="text-accent">
                {info.numberingSystems[0] ?? "—"}
              </span>
              <span className="ml-2 text-white/40">
                {new Intl.NumberFormat(info.tag).format(1234567)}
              </span>
            </Field>

            <Field label="time zones">
              <span className="text-white/70">
                {info.timeZones.length ? info.timeZones.join(", ") : "—"}
              </span>
            </Field>

            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="calendars">
                <span className="flex flex-wrap gap-1.5">
                  {info.calendars.length ? (
                    info.calendars.map((c, i) => (
                      <span
                        key={c}
                        className={`rounded-md border px-1.5 py-0.5 text-xs ${
                          i === 0
                            ? "border-accent/40 bg-accent/[0.08] text-accent/90"
                            : "border-white/[0.07] text-white/45"
                        }`}
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </span>
              </Field>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
