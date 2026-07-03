"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anyamount", label: "anyamount()" },
  { id: "parts", label: "anyamountParts()" },
  { id: "modes", label: "Modes" },
  { id: "options", label: "Options" },
  { id: "units", label: "Units" },
  { id: "locales", label: "Locales" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

function Code({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "var(--code-bg)",
        borderColor: "var(--code-border)",
      }}
      className="rounded-xl border p-4 overflow-x-auto text-sm font-mono leading-relaxed"
    >
      <code style={{ color: "var(--code-text)" }}>{children}</code>
    </pre>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <h2
        style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
        className="text-xl font-medium mb-6 pb-3 border-b"
      >
        {title}
      </h2>
      <div
        className="space-y-6 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {children}
      </div>
    </section>
  );
}

function Prop({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def?: string;
  desc: string;
}) {
  return (
    <div
      style={{ borderColor: "var(--border)" }}
      className="flex flex-col gap-1 py-3 border-b last:border-0"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <code style={{ color: "var(--amber)" }} className="font-mono text-sm">
          {name}
        </code>
        <code style={{ color: "var(--sky)" }} className="font-mono text-xs">
          {type}
        </code>
        {def && (
          <span style={{ color: "var(--text-muted)" }} className="text-xs">
            default: <code className="font-mono">{def}</code>
          </span>
        )}
      </div>
      <p style={{ color: "var(--text-muted)" }} className="text-sm">
        {desc}
      </p>
    </div>
  );
}

export function DocsClient() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("overview");
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--bg", "#0a0a0a");
      root.style.setProperty("--bg-secondary", "#111111");
      root.style.setProperty("--text-primary", "rgba(255,255,255,0.88)");
      root.style.setProperty("--text-secondary", "rgba(255,255,255,0.55)");
      root.style.setProperty("--text-muted", "rgba(255,255,255,0.3)");
      root.style.setProperty("--border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--border-soft", "rgba(255,255,255,0.04)");
      root.style.setProperty("--nav-active", "rgba(255,255,255,0.06)");
      root.style.setProperty("--code-bg", "rgba(0,0,0,0.6)");
      root.style.setProperty("--code-border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--code-text", "#a1a1aa");
      root.style.setProperty("--amber", "#fbbf24");
      root.style.setProperty("--sky", "#38bdf8");
      root.style.setProperty("--emerald", "#34d399");
      root.style.setProperty("--table-alt", "rgba(255,255,255,0.02)");
    } else {
      root.style.setProperty("--bg", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f8f8f7");
      root.style.setProperty("--text-primary", "#111111");
      root.style.setProperty("--text-secondary", "#555555");
      root.style.setProperty("--text-muted", "#999999");
      root.style.setProperty("--border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--border-soft", "rgba(0,0,0,0.04)");
      root.style.setProperty("--nav-active", "rgba(0,0,0,0.05)");
      root.style.setProperty("--code-bg", "#f4f4f5");
      root.style.setProperty("--code-border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--code-text", "#3f3f46");
      root.style.setProperty("--amber", "#b45309");
      root.style.setProperty("--sky", "#0369a1");
      root.style.setProperty("--emerald", "#059669");
      root.style.setProperty("--table-alt", "rgba(0,0,0,0.02)");
    }
  }, [dark]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        transition: "background .2s, color .2s",
      }}
    >
      <header
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/"
              style={{ color: "var(--text-muted)" }}
              className="font-mono text-sm hover:opacity-80 transition-opacity cursor-pointer"
            >
              ← anyamount
            </Link>
            <span
              style={{ color: "var(--text-muted)" }}
              className="hidden sm:inline text-xs tracking-widest uppercase"
            >
              docs
            </span>
          </div>
          <select
            value={active}
            onChange={(e) => scrollTo(e.target.value)}
            style={{
              color: "var(--text-secondary)",
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
            className="md:hidden flex-1 min-w-0 text-xs font-mono rounded-md px-2 py-1 border cursor-pointer outline-none"
          >
            {NAV.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDark((d) => !d)}
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            className="shrink-0 text-xs font-mono rounded-md px-3 py-1 border hover:opacity-80 transition-opacity cursor-pointer"
          >
            {dark ? "☀ light" : "☾ dark"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-20 flex gap-12">
        <aside className="hidden md:block w-44 shrink-0 sticky top-20 self-start">
          <nav className="flex flex-col gap-0.5">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm px-3 py-1.5 rounded-lg transition-colors font-mono cursor-pointer"
                style={{
                  color:
                    active === id ? "var(--text-primary)" : "var(--text-muted)",
                  background:
                    active === id ? "var(--nav-active)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>
        <main ref={mainRef} className="flex-1 min-w-0 pb-32">
          <h1 className="sr-only">anyamount API reference</h1>
          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>
                anyamount
              </strong>{" "}
              is a tiny number formatter built entirely on the native{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.NumberFormat
              </code>{" "}
              browser API. One function, one options object, three modes. This
              is a 0.x trial release — the API may still move before 1.0.
            </p>
            <p>
              The browser already knows how to format numbers, money, and
              units in 200+ languages. anyamount just makes that API pleasant
              to use.
            </p>
            <Code>{`import { anyamount } from 'anyamount'

anyamount(1234567)
// "1.2M"  — smart mode (default)

anyamount(1999, { mode: 'currency', currency: 'EUR' })
// "€1,999.00"

anyamount(3.2, { mode: 'unit', unit: 'gigabyte' })
// "3.2 GB"`}</Code>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm install anyamount
# or
pnpm add anyamount
# or
yarn add anyamount`}</Code>
          </Section>

          <Section id="anyamount" title="anyamount()">
            <p>
              The single entry point. Pass a number, optionally pass options.
            </p>
            <Code>{`anyamount(value)
anyamount(value, options?)

anyamount(1234567)
// runtime locale, smart mode

anyamount(9999, { locale: 'en' })
// "9,999"  — below the compact cutoff

anyamount(1234567, { locale: 'en', style: 'long' })
// "1.2 million"

anyamount(1999.99, { mode: 'currency', currency: 'EUR', locale: 'en', digits: 0 })
// "€2,000"`}</Code>
          </Section>

          <Section id="parts" title="anyamountParts()">
            <p>
              Same arguments as{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                anyamount()
              </code>
              , but returns the{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.NumberFormat.formatToParts
              </code>{" "}
              output unchanged — style the number apart from the currency
              symbol or unit, or rebuild the output your own way.
            </p>
            <Code>{`import { anyamountParts } from 'anyamount'

anyamountParts(1999, { mode: 'currency', currency: 'EUR', locale: 'en' })
// [
//   { type: 'currency', value: '€' },
//   { type: 'integer', value: '1' },
//   { type: 'group', value: ',' },
//   { type: 'integer', value: '999' },
//   { type: 'decimal', value: '.' },
//   { type: 'fraction', value: '00' },
// ]

// React: shrink the currency symbol
anyamountParts(price, { mode: 'currency', currency: 'EUR' }).map((p, i) =>
  p.type === 'currency' ? <small key={i}>{p.value}</small> : p.value,
)`}</Code>
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              Note: part values keep the original Intl characters — the space
              between number and unit can be U+00A0 or U+202F (no-break
              spaces) depending on locale and ICU version.
            </p>
          </Section>

          <Section id="modes" title="Modes">
            <p>
              The{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                mode
              </code>{" "}
              option picks the rendering strategy. Each mode reads only the
              options that apply to it — the rest are ignored.
            </p>

            <div>
              <h3
                style={{ color: "var(--text-primary)" }}
                className="font-mono text-base mb-3"
              >
                smart (default)
              </h3>
              <p className="mb-3">
                Compact notation for big numbers, plain formatting for small
                ones. The cutoff is{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  |value| &gt;= 10000
                </code>
                .
              </p>
              <div
                style={{ borderColor: "var(--border)" }}
                className="rounded-xl border p-4 mb-3"
              >
                <div className="space-y-2 text-xs font-mono">
                  {[
                    ["1234567", "1.2M"],
                    ["10000", "10K"],
                    ["9999", "9,999"],
                    ["42", "42"],
                    ["0.1234", "0.12"],
                  ].map(([input, output]) => (
                    <div key={input} className="flex gap-4">
                      <span
                        style={{ color: "var(--text-muted)", minWidth: "7rem" }}
                      >
                        {input}
                      </span>
                      <span style={{ color: "var(--emerald)" }}>
                        → &quot;{output}&quot;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs mb-2"
              >
                reads: <code className="font-mono">locale, style, digits</code>
              </p>
            </div>

            <div>
              <h3
                style={{ color: "var(--text-primary)" }}
                className="font-mono text-base mb-3"
              >
                currency
              </h3>
              <p className="mb-3">
                Money via the{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  Intl.NumberFormat
                </code>{" "}
                currency style.{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  currency
                </code>{" "}
                is required — any ISO 4217 code. Missing it throws a
                TypeError.
              </p>
              <Code>{`anyamount(1999, { mode: 'currency', currency: 'EUR', locale: 'en' })
// "€1,999.00"

anyamount(1999, { mode: 'currency', currency: 'RSD', locale: 'sr' })
// "1.999,00 RSD"

anyamount(1999, { mode: 'currency', currency: 'JPY', locale: 'ja' })
// "￥1,999"  — JPY has no minor unit, Intl knows

anyamount(1999.99, { mode: 'currency', currency: 'EUR', locale: 'en', digits: 0 })
// "€2,000"`}</Code>
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs mb-2"
              >
                reads:{" "}
                <code className="font-mono">locale, currency, digits</code>
              </p>
            </div>

            <div>
              <h3
                style={{ color: "var(--text-primary)" }}
                className="font-mono text-base mb-3"
              >
                unit
              </h3>
              <p className="mb-3">
                Measurements via the{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  Intl.NumberFormat
                </code>{" "}
                unit style.{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  unit
                </code>{" "}
                is required — any sanctioned identifier, including compound{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  -per-
                </code>{" "}
                pairs. Missing it throws a TypeError.
              </p>
              <Code>{`anyamount(3.2, { mode: 'unit', unit: 'gigabyte', locale: 'en' })
// "3.2 GB"

anyamount(120, { mode: 'unit', unit: 'kilometer-per-hour', locale: 'en' })
// "120 km/h"

anyamount(3.2, { mode: 'unit', unit: 'gigabyte', locale: 'en', style: 'long' })
// "3.2 gigabytes"

anyamount(5, { mode: 'unit', unit: 'kilometer', locale: 'en', style: 'narrow' })
// "5km"`}</Code>
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs mb-2"
              >
                reads:{" "}
                <code className="font-mono">locale, unit, style, digits</code>
              </p>
            </div>
          </Section>

          <Section id="options" title="Options">
            <Prop
              name="mode"
              type="'smart' | 'currency' | 'unit'"
              def="'smart'"
              desc="Rendering strategy. Each mode reads only the options that apply to it."
            />
            <Prop
              name="locale"
              type="string | string[]"
              def="runtime locale"
              desc="Any valid BCP 47 locale tag, or a fallback array — 'en', 'en-US', 'zh-TW', ['sr-Latn-RS', 'en']."
            />
            <Prop
              name="currency"
              type="string"
              desc="Currency mode only, required. Any ISO 4217 code — 'EUR', 'USD', 'JPY', 'RSD'."
            />
            <Prop
              name="unit"
              type="Unit"
              desc="Unit mode only, required. A sanctioned unit identifier or a compound '<unit>-per-<unit>' pair. Typed as a union — your editor autocompletes it."
            />
            <Prop
              name="style"
              type="'long' | 'short' | 'narrow'"
              def="'short'"
              desc="Smart and unit modes. Wording length: '1.2M' vs '1.2 million', '3.2 GB' vs '3.2 gigabytes'."
            />
            <Prop
              name="digits"
              type="number"
              def="per mode"
              desc="Maximum fraction digits. Defaults: smart — 2 plain / 1 compact, unit — 2, currency — the currency's own."
            />
          </Section>

          <Section id="units" title="Units">
            <p>
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl
              </code>{" "}
              supports a fixed, sanctioned list of unit identifiers (from
              ECMA-402), plus any{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                &lt;unit&gt;-per-&lt;unit&gt;
              </code>{" "}
              compound of them. anyamount ships the full list as a TypeScript
              union, so invalid units fail at compile time.
            </p>
            <Code>{`acre bit byte celsius centimeter day degree fahrenheit
fluid-ounce foot gallon gigabit gigabyte gram hectare hour
inch kilobit kilobyte kilogram kilometer liter megabit
megabyte meter microsecond mile mile-scandinavian milliliter
millimeter millisecond minute month nanosecond ounce percent
petabyte pound second stone terabit terabyte week yard year`}</Code>
            <Code>{`// compounds work too
anyamount(120, { mode: 'unit', unit: 'kilometer-per-hour' })   // "120 km/h"
anyamount(8.5, { mode: 'unit', unit: 'liter-per-kilometer' })  // "8.5 L/km"
anyamount(2, { mode: 'unit', unit: 'meter-per-second' })       // "2 m/s"`}</Code>
          </Section>

          <Section id="locales" title="Locales">
            <p>
              Same calls in a few languages — no extra setup, no locale files.
            </p>
            <Code>{`// smart mode
anyamount(1234567, { locale: 'ru' })   // "1,2 млн"
anyamount(1234567, { locale: 'de' })   // "1,2 Mio."
anyamount(1234567, { locale: 'ja' })   // "123.5万"

// currency mode
anyamount(1999, { mode: 'currency', currency: 'USD', locale: 'de' })
// "1.999,00 $"
anyamount(1999, { mode: 'currency', currency: 'INR', locale: 'hi' })
// "₹1,999.00"

// unit mode
anyamount(120, { mode: 'unit', unit: 'kilometer-per-hour', locale: 'ru' })
// "120 км/ч"`}</Code>
            <p>
              Pass any valid{" "}
              <a
                href="https://www.ietf.org/rfc/rfc5646.txt"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--sky)" }}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                BCP 47
              </a>{" "}
              language tag — including regional variants like{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                en-GB
              </code>
              ,{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                zh-TW
              </code>
              , or{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                pt-BR
              </code>
              . Locale is optional; when omitted, native{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl
              </code>{" "}
              uses the runtime locale. Fallback arrays like{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                [&apos;sr-Latn-RS&apos;, &apos;en&apos;]
              </code>{" "}
              also work.
            </p>
            <p>
              Output is pure — no clock reads, no environment sniffing — so
              server and client render identically. SSR-safe by construction.
            </p>
          </Section>

          <Section id="compatibility" title="Compatibility">
            <p>
              anyamount uses{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.NumberFormat
              </code>{" "}
              with compact notation and unit support — widely available since
              2020.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden mt-2"
            >
              {[
                ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
                ["Chrome", "77+", ""],
                ["Firefox", "78+", ""],
                ["Safari", "14.1+", ""],
                ["Edge", "79+", ""],
                ["Vercel Edge Runtime", "✓", ""],
                ["Cloudflare Workers", "✓", ""],
                ["Deno", "✓", ""],
              ].map(([env, ver, note], i) => (
                <div
                  key={env}
                  className="flex items-center gap-4 px-4 py-2.5 text-sm font-mono"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--table-alt)" : "transparent",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      minWidth: "10rem",
                    }}
                  >
                    {env}
                  </span>
                  <span style={{ color: "var(--emerald)", minWidth: "3rem" }}>
                    {ver}
                  </span>
                  {note && (
                    <span
                      style={{ color: "var(--text-muted)" }}
                      className="text-xs"
                    >
                      {note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section id="limitations" title="Limitations">
            <p>A few things worth knowing before you ship:</p>
            <div className="space-y-3">
              {[
                {
                  title: "No byte auto-scaling yet",
                  body: "anyamount(3200000000, { mode: 'unit', unit: 'byte' }) will not pick GB for you — pass the unit you want. Automatic scaling is planned for v0.2.",
                },
                {
                  title: "Output depends on the runtime's Intl data",
                  body: "anyamount delegates all formatting to native Intl. Exact output — separators, spacing, compact suffixes — may vary between Node versions, browsers, and OSes. Don't hardcode expected strings in tests; use pattern matching instead.",
                },
                {
                  title: "Sanctioned units only",
                  body: "Intl supports a fixed list of unit identifiers and -per- compounds of them. There is no way to format arbitrary custom units — that's an Intl constraint, not an anyamount one.",
                },
                {
                  title: "0.x trial release",
                  body: "This is v0.1 — one function, three modes, on purpose. No percent mode, no ranges, no parsing. The API may still move before 1.0; new options will arrive in minors.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  style={{ borderColor: "var(--border)" }}
                  className="rounded-xl border p-4"
                >
                  <p
                    style={{ color: "var(--text-primary)" }}
                    className="font-medium mb-1 text-sm"
                  >
                    {title}
                  </p>
                  <p style={{ color: "var(--text-muted)" }} className="text-sm">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
