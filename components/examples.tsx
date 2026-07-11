"use client";

import { useState } from "react";
import { SimpleCalendar } from "@dateforge/react-calendar/prebuilt";
import { Select, TextInput, Result } from "./ui";

const LOCALES = ["en", "de", "ru", "ja", "ar", "fr", "pt-BR"] as const;

/** Emoji flag from an ISO 3166-1 alpha-2 code; "" if not two ASCII letters. */
function toFlag(code: string): string {
  const c = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "";
  return c.replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

/** anyaround — region code → localized name + flag (Intl.DisplayNames). */
export function AroundExample({ accent }: { accent: string }) {
  const [code, setCode] = useState("US");
  const [locale, setLocale] = useState<string>("en");

  const name = safe(
    () =>
      new Intl.DisplayNames([locale], { type: "region" }).of(code.toUpperCase()) ??
      code,
    code,
  );
  const flag = toFlag(code);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-white/50">
        <span style={{ color: accent }}>anyaround</span>
        <span className="text-white/30">(</span>
        <TextInput value={code} onChange={setCode} accent="#7dd3fc" width="6ch" testid="input-around-code" />
        <span className="text-white/30">, {"{ locale:"}</span>
        <Select value={locale} onChange={setLocale} options={LOCALES} accent={accent} testid="select-around-locale" />
        <span className="text-white/30">{"})"}</span>
      </div>
      <Result>
        {flag ? `${flag} ${name}` : name}
      </Result>
    </div>
  );
}

/** anyamount — number + currency → formatted money (Intl.NumberFormat). */
export function AmountExample({ accent }: { accent: string }) {
  const [amount, setAmount] = useState("1999.5");
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState<string>("en");

  const n = Number(amount);
  const out = safe(
    () =>
      Number.isFinite(n)
        ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(n)
        : "—",
    "—",
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-white/50">
        <span style={{ color: accent }}>anyamount</span>
        <span className="text-white/30">(</span>
        <TextInput value={amount} onChange={setAmount} accent="#7dd3fc" width="8ch" testid="input-amount-value" />
        <span className="text-white/30">,</span>
        <Select value={currency} onChange={setCurrency} options={["USD", "EUR", "JPY", "GBP", "BRL"]} accent={accent} testid="select-amount-currency" />
        <Select value={locale} onChange={setLocale} options={LOCALES} accent={accent} testid="select-amount-locale" />
        <span className="text-white/30">)</span>
      </div>
      <Result>{out}</Result>
    </div>
  );
}

/** anywhen — date → localized date string (Intl.DateTimeFormat). */
export function WhenExample({ accent }: { accent: string }) {
  // Fixed initial date keeps SSR prerender and client hydration identical.
  const [date, setDate] = useState<Date | null>(
    () => new Date("2026-07-11T12:00:00"),
  );
  const [dateStyle, setDateStyle] = useState("full");
  const [locale, setLocale] = useState<string>("en");

  const out = safe(() => {
    if (!date || Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: dateStyle as "full" | "long" | "medium" | "short",
    }).format(date);
  }, "—");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-white/50">
        <span style={{ color: accent }}>anywhen</span>
        <span className="text-white/30">(pick a day, {"{"}</span>
        <Select value={dateStyle} onChange={setDateStyle} options={["full", "long", "medium", "short"]} accent={accent} testid="select-when-style" />
        <Select value={locale} onChange={setLocale} options={LOCALES} accent={accent} testid="select-when-locale" />
        <span className="text-white/30">{"})"}</span>
      </div>

      <div className="mt-3 flex w-full max-w-[320px]">
        <SimpleCalendar
          value={date}
          onChange={setDate}
          locale={locale}
          theme="espresso"
          scheme="dark"
          className="w-full"
          data-testid="calendar-when"
        />
      </div>

      <Result>{out}</Result>
    </div>
  );
}

/** anymany — string list → localized join (Intl.ListFormat). */
export function ManyExample({ accent }: { accent: string }) {
  const [raw, setRaw] = useState("apple, pear, plum");
  const [type, setType] = useState("conjunction");
  const [locale, setLocale] = useState<string>("en");

  const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const out = safe(
    () =>
      new Intl.ListFormat(locale, {
        type: type as "conjunction" | "disjunction" | "unit",
        style: "long",
      }).format(items),
    "—",
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-white/50">
        <span style={{ color: accent }}>anymany</span>
        <span className="text-white/30">(</span>
        <TextInput value={raw} onChange={setRaw} accent="#7dd3fc" width="18ch" testid="input-many-list" />
        <span className="text-white/30">,</span>
        <Select value={type} onChange={setType} options={["conjunction", "disjunction", "unit"]} accent={accent} testid="select-many-type" />
        <Select value={locale} onChange={setLocale} options={LOCALES} accent={accent} testid="select-many-locale" />
        <span className="text-white/30">)</span>
      </div>
      <Result>{out}</Result>
    </div>
  );
}
