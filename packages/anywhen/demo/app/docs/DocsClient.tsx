"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anywhen", label: "anywhen()" },
  { id: "modes", label: "Modes" },
  { id: "options", label: "Options" },
  { id: "ssr", label: "SSR" },
  { id: "input-types", label: "Input types" },
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
              ← anywhen
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
          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>anywhen</strong>{" "}
              is a tiny date formatter built entirely on the native{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl
              </code>{" "}
              browser API. One function, one options object, three modes.
            </p>
            <p>
              The browser already knows how to format dates in 200+ languages.
              anywhen just makes that API pleasant to use.
            </p>
            <Code>{`import { anywhen } from 'anywhen'

anywhen(date)
// "yesterday, 2:35 PM"  — smart mode (default)

anywhen(date, { mode: 'absolute', locale: 'en' })
// "Feb 5, 2016"

anywhen(date, { mode: 'relative', locale: 'en' })
// "3 hours ago"`}</Code>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm install anywhen
# or
pnpm add anywhen
# or
yarn add anywhen`}</Code>
          </Section>

          <Section id="anywhen" title="anywhen()">
            <p>
              The single entry point. Pass a date, optionally pass options.
            </p>
            <Code>{`anywhen(input)
anywhen(input, options?)

anywhen(date)
// runtime locale, smart mode

anywhen(date, { locale: 'en' })
// "yesterday, 2:35 PM"

anywhen(date, { mode: 'relative', locale: 'en', numeric: true })
// "1 day ago"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
})
// "Friday, February 5, 2016"`}</Code>
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
                Context-aware. Picks the most readable format based on distance
                from now — covers past and future.
              </p>
              <div
                style={{ borderColor: "var(--border)" }}
                className="rounded-xl border p-4 mb-3"
              >
                <div className="space-y-2 text-xs font-mono">
                  {[
                    ["< 45s", "now"],
                    ["< 1 hour", "10 minutes ago"],
                    ["future > 1h", "in 2 weeks"],
                    ["same day", "today, 14:35"],
                    ["yesterday", "yesterday, 09:00"],
                    ["< 7 days", "Wednesday, 11:20"],
                    ["older", "Feb 5, 2016"],
                  ].map(([when, output]) => (
                    <div key={when} className="flex gap-4">
                      <span
                        style={{ color: "var(--text-muted)", minWidth: "7rem" }}
                      >
                        {when}
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
                reads:{" "}
                <code className="font-mono">
                  locale, now, time, timeZone
                </code>
              </p>
            </div>

            <div>
              <h3
                style={{ color: "var(--text-primary)" }}
                className="font-mono text-base mb-3"
              >
                absolute
              </h3>
              <p className="mb-3">
                Plain date formatting via{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  Intl.DateTimeFormat
                </code>
                . Pass{" "}
                <code
                  style={{ color: "var(--emerald)" }}
                  className="font-mono"
                >
                  format
                </code>{" "}
                to control the output shape.
              </p>
              <Code>{`anywhen(date, { mode: 'absolute', locale: 'en' })
// "Feb 5, 2016"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { hour: '2-digit', minute: '2-digit' },
})
// "2:35 PM"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { month: 'long', year: 'numeric' },
  timeZone: 'Europe/Belgrade',
})
// "February 2016"`}</Code>
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs mb-2"
              >
                reads:{" "}
                <code className="font-mono">locale, format, timeZone</code>
              </p>
            </div>

            <div>
              <h3
                style={{ color: "var(--text-primary)" }}
                className="font-mono text-base mb-3"
              >
                relative
              </h3>
              <p className="mb-3">
                Always relative. Past and future. Never falls back to an
                absolute date.
              </p>
              <Code>{`anywhen(date, { mode: 'relative', locale: 'en' })
// "3 hours ago"
// "yesterday"
// "in 2 weeks"

anywhen(date, { mode: 'relative', locale: 'en', numeric: true })
// "1 day ago"   — disables auto-phrases
// "1 week ago"`}</Code>
              <p
                style={{ color: "var(--text-muted)" }}
                className="text-xs mb-2"
              >
                reads:{" "}
                <code className="font-mono">locale, now, numeric</code>
              </p>
            </div>
          </Section>

          <Section id="options" title="Options">
            <Prop
              name="mode"
              type="'smart' | 'absolute' | 'relative'"
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
              name="now"
              type="Date | number | string"
              def="current time"
              desc="Reference time for smart and relative modes. Pass this in SSR to keep server and client output stable."
            />
            <Prop
              name="timeZone"
              type="string"
              def="runtime timezone"
              desc="IANA time zone for the displayed clock and smart day boundaries (today, yesterday, weekday). Used by smart and absolute modes."
            />
            <Prop
              name="time"
              type="boolean"
              def="true"
              desc="Smart mode only. Whether to include clock time in today/yesterday/weekday output."
            />
            <Prop
              name="numeric"
              type="boolean"
              def="false"
              desc="Relative mode only. Force numeric output — disables auto-phrases like 'yesterday' or 'last week'."
            />
            <Prop
              name="format"
              type="Intl.DateTimeFormatOptions"
              def="{ day, month, year }"
              desc="Absolute mode only. Any options accepted by Intl.DateTimeFormat. Defaults to a short date."
            />
          </Section>

          <Section id="ssr" title="SSR">
            <p>
              By default, smart and relative modes use the current time. In
              React SSR or Next.js, pass a stable{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                now
              </code>{" "}
              value to avoid hydration drift.
            </p>
            <Code>{`import { anywhen } from 'anywhen'

export function PostMeta({ createdAt, requestTime }: {
  createdAt: string
  requestTime: string
}) {
  return (
    <time dateTime={createdAt}>
      {anywhen(createdAt, {
        locale: 'en',
        now: requestTime,
        timeZone: 'Europe/Belgrade',
      })}
    </time>
  )
}`}</Code>
            <p>
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                timeZone
              </code>{" "}
              controls both the displayed clock and the smart calendar
              boundaries for today, yesterday, and weekday output.
            </p>
          </Section>

          <Section id="input-types" title="Input types">
            <p>All inputs accept three formats interchangeably.</p>
            <Code>{`// Date object
anywhen(new Date())

// Unix timestamp (milliseconds)
anywhen(Date.now())
anywhen(1704499200000)

// ISO string
anywhen('2016-02-05T14:00:00Z')
anywhen('2016-02-05')`}</Code>
          </Section>

          <Section id="locales" title="Locales">
            <p>
              Same calls in a few languages — no extra setup, no locale files.
            </p>
            <Code>{`// smart mode
anywhen(date, { locale: 'de' })   // "gestern, 14:35"
anywhen(date, { locale: 'ru' })   // "вчера, 14:35"
anywhen(date, { locale: 'fr' })   // "hier, 14:35"

// absolute mode
anywhen(date, { mode: 'absolute', locale: 'ja' })   // "2016年2月5日"
anywhen(date, { mode: 'absolute', locale: 'ar' })   // "٥ فبراير ٢٠١٦"
anywhen(date, { mode: 'absolute', locale: 'ru' })   // "5 февр. 2016 г."

// relative mode
anywhen(date, { mode: 'relative', locale: 'de' })   // "vor 3 Stunden"
anywhen(date, { mode: 'relative', locale: 'fr' })   // "il y a 3 heures"
anywhen(date, { mode: 'relative', locale: 'tr' })   // "3 saat önce"`}</Code>
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
          </Section>

          <Section id="compatibility" title="Compatibility">
            <p>
              anywhen uses{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.RelativeTimeFormat
              </code>{" "}
              and{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.DateTimeFormat
              </code>{" "}
              — both widely supported.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden mt-2"
            >
              {[
                ["Node.js", "13+", "full ICU included by default"],
                ["Chrome", "71+", ""],
                ["Firefox", "65+", ""],
                ["Safari", "14+", ""],
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
                  title: "Output depends on the runtime's Intl data",
                  body: "anywhen delegates all formatting to native Intl. Exact output — punctuation, spacing, abbreviated month names — may vary between Node versions, browsers, and OSes. Don't hardcode expected strings in tests; use pattern matching instead.",
                },
                {
                  title: "No custom format strings",
                  body: "Absolute mode accepts Intl.DateTimeFormat options, so you control the pieces. But if you need 'DD/MM/YYYY' with literal slashes — use a formatting library with explicit pattern strings instead.",
                },
                {
                  title: "Smart mode cutoff is fixed at 7 days",
                  body: "The switch from weekday ('Wednesday, 11:20') to absolute date happens at 7 days and is not configurable. Need a custom cutoff? Use mode: 'relative' or mode: 'absolute' directly.",
                },
                {
                  title: "Node.js < 13",
                  body: "Older Node versions shipped with small-icu — only the 'en' locale was guaranteed. Node 13+ includes full ICU. On older versions, install the full-icu package separately.",
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
