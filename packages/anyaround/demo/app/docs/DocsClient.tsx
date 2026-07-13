"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anyaround", label: "anyaround()" },
  { id: "info", label: "anyaroundInfo()" },
  { id: "modes", label: "Modes" },
  { id: "options", label: "Options" },
  { id: "flags", label: "Flags" },
  { id: "locales", label: "Locales" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const DARK: Record<string, string> = {
  "--bg": "#0a0a0a",
  "--bg-secondary": "#111111",
  "--text-primary": "rgba(255,255,255,0.88)",
  "--text-secondary": "rgba(255,255,255,0.6)",
  "--text-muted": "rgba(255,255,255,0.4)",
  "--border": "rgba(255,255,255,0.1)",
  "--border-soft": "rgba(255,255,255,0.06)",
  "--nav-active": "rgba(255,255,255,0.08)",
  "--code-bg": "#111111",
  "--code-border": "rgba(255,255,255,0.08)",
  "--code-text": "rgba(255,255,255,0.85)",
  "--amber": "#fbbf24",
  "--sky": "#38bdf8",
  "--emerald": "#34d399",
  "--violet": "#c4b5fd",
  "--table-alt": "rgba(255,255,255,0.02)",
};

const LIGHT: Record<string, string> = {
  "--bg": "#ffffff",
  "--bg-secondary": "#f8f8f7",
  "--text-primary": "#111111",
  "--text-secondary": "#3f3f46",
  "--text-muted": "#71717a",
  "--border": "rgba(0,0,0,0.12)",
  "--border-soft": "rgba(0,0,0,0.07)",
  "--nav-active": "rgba(0,0,0,0.05)",
  "--code-bg": "#f4f4f3",
  "--code-border": "rgba(0,0,0,0.08)",
  "--code-text": "#1f2937",
  "--amber": "#b45309",
  "--sky": "#0369a1",
  "--emerald": "#059669",
  "--violet": "#6d28d9",
  "--table-alt": "rgba(0,0,0,0.02)",
};

function Code({ children }: { children: ReactNode }) {
  return (
    <pre
      className="my-3 overflow-x-auto rounded-lg border p-4 text-[13px] leading-relaxed"
      style={{
        background: "var(--code-bg)",
        borderColor: "var(--code-border)",
        color: "var(--code-text)",
      }}
    >
      <code className="font-mono">{children}</code>
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
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-8">
      <h2
        className="mb-4 text-2xl font-semibold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-[15px] leading-relaxed"
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
  children,
}: {
  name: string;
  type: string;
  def?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="border-b py-3 last:border-0"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 font-mono text-[13px]">
        <span style={{ color: "var(--amber)" }}>{name}</span>
        <span style={{ color: "var(--sky)" }}>{type}</span>
        {def && (
          <span style={{ color: "var(--text-muted)" }}>= {def}</span>
        )}
      </div>
      <p className="mt-1.5 text-[14px]" style={{ color: "var(--text-secondary)" }}>
        {children}
      </p>
    </div>
  );
}

export function DocsClient() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const vars = dark ? DARK : LIGHT;
    const root = document.documentElement;
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const { id } of NAV) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <header
        className="fixed inset-x-0 top-0 z-30 h-12 border-b backdrop-blur-sm"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-mono text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            ← anyaround
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              docs
            </span>
            <select
              data-testid="select-docs-nav"
              value={active}
              onChange={(e) => scrollTo(e.target.value)}
              className="rounded-md border bg-transparent px-2 py-1 font-mono text-xs md:hidden"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {NAV.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="rounded-md border px-2 py-1 font-mono text-xs transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {dark ? "☀ light" : "☾ dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-4 pb-24 pt-20">
        <aside className="sticky top-20 hidden h-fit w-44 shrink-0 md:block">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="rounded-md px-3 py-1.5 text-left font-mono text-[13px] transition-colors"
                style={{
                  background: active === n.id ? "var(--nav-active)" : "transparent",
                  color: active === n.id ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 flex-1">
          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>anyaround</strong>{" "}
              turns a region, language, script, currency, or calendar code into
              its localized name — and, for countries, an emoji flag. One
              function over native{" "}
              <code style={{ color: "var(--violet)" }}>Intl.DisplayNames</code>,
              zero dependencies.
            </p>
            <Code>{`import { anyaround } from "anyaround";

anyaround("US");                        // "United States"
anyaround("US", { display: "flag-name" }); // "🇺🇸 United States"
anyaround("US", { locale: "ru" });      // "Соединенные Штаты"
anyaround("en");                        // "English"
anyaround("Cyrl");                      // "Cyrillic"
anyaround("EUR");                       // "Euro"`}</Code>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm install anyaround
pnpm add anyaround
yarn add anyaround`}</Code>
            <p>
              Ships ESM + CJS with type declarations. Requires a runtime with{" "}
              <code style={{ color: "var(--violet)" }}>Intl.DisplayNames</code>{" "}
              (Node 18+, modern browsers).
            </p>
          </Section>

          <Section id="anyaround" title="anyaround()">
            <p>
              <code style={{ color: "var(--sky)" }}>
                anyaround(code, options?) → string
              </code>
            </p>
            <p>
              Resolves a code to a ready-to-render string. In the default{" "}
              <code style={{ color: "var(--amber)" }}>smart</code> mode the kind
              is inferred from the code's shape.
            </p>
            <Code>{`anyaround("FR");                     // "France"
anyaround("fr");                     // "French"
anyaround("419");                    // "Latin America and the Caribbean"
anyaround("Latn");                   // "Latin"
anyaround("JPY");                    // "Japanese Yen"
anyaround("DE", { display: "flag" }); // "🇩🇪"`}</Code>
            <p>
              Throws <code style={{ color: "var(--amber)" }}>TypeError</code> on
              an empty code and{" "}
              <code style={{ color: "var(--amber)" }}>RangeError</code> on an
              unknown mode.
            </p>
          </Section>

          <Section id="info" title="anyaroundInfo()">
            <p>
              <code style={{ color: "var(--sky)" }}>
                anyaroundInfo(code, options?) → {"{ code, type, name, flag, found }"}
              </code>
            </p>
            <p>
              Same arguments, structured result — build your own output or drive
              a <code style={{ color: "var(--violet)" }}>&lt;select&gt;</code>.
            </p>
            <Code>{`anyaroundInfo("US", { locale: "en" });
// { code: "US", type: "region", name: "United States", flag: "🇺🇸", found: true }

anyaroundInfo("en", { locale: "fr" });
// { code: "en", type: "language", name: "anglais", flag: "", found: true }

anyaroundInfo("QZ", { mode: "region" });
// { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }`}</Code>
            <p>
              <code style={{ color: "var(--amber)" }}>flag</code> is{" "}
              <code style={{ color: "var(--emerald)" }}>&quot;&quot;</code>{" "}
              whenever the code is not a flag-bearing alpha-2 region.{" "}
              <code style={{ color: "var(--amber)" }}>found</code> is{" "}
              <code style={{ color: "var(--emerald)" }}>false</code> when{" "}
              <code>Intl</code> had no name — <code>name</code> is then the code
              or <code>&quot;&quot;</code>, so you can tell a hit from a miss.
            </p>
          </Section>

          <Section id="modes" title="Modes">
            <p>
              The <code style={{ color: "var(--amber)" }}>mode</code> option
              picks how a code is read. Default is{" "}
              <code style={{ color: "var(--emerald)" }}>&quot;smart&quot;</code>.
            </p>
            <p style={{ color: "var(--text-primary)" }}>smart — auto-detect by shape</p>
            <Code>{`three digits            → region    "419"
four letters            → script    "Latn"
two uppercase letters   → region    "US"
three uppercase letters → currency  "USD"
anything else           → language  "en", "zh-Hant"`}</Code>
            <p>
              Case is the tiebreaker: <code>&quot;IT&quot;</code> is a region,{" "}
              <code>&quot;it&quot;</code> a language. Pin ambiguous codes with{" "}
              <code style={{ color: "var(--amber)" }}>mode</code>.{" "}
              <code style={{ color: "var(--emerald)" }}>calendar</code> is never
              auto-detected.
            </p>
            <p style={{ color: "var(--text-primary)" }}>region / language / script / currency / calendar</p>
            <Code>{`anyaround("DE", { mode: "region", display: "flag-name" }); // "🇩🇪 Germany"
anyaround("en-US", { mode: "language" });                 // "American English"
anyaround("Cyrl", { mode: "script" });                    // "Cyrillic"
anyaround("EUR", { mode: "currency" });                   // "Euro"
anyaround("gregory", { mode: "calendar" });               // "Gregorian Calendar"`}</Code>
          </Section>

          <Section id="options" title="Options">
            <Prop name="mode" type='"smart" | "region" | "language" | "script" | "currency" | "calendar"' def='"smart"'>
              How the code is interpreted.
            </Prop>
            <Prop name="locale" type="string | string[]" def="runtime locale">
              BCP 47 tag (or fallback list) for the resolved name.
            </Prop>
            <Prop name="style" type='"long" | "short" | "narrow"' def='"long"'>
              Name verbosity, forwarded to <code>Intl.DisplayNames</code>.
            </Prop>
            <Prop name="display" type='"name" | "flag" | "flag-name" | "name-flag"' def='"name"'>
              Output shape for flag-bearing regions. Only in smart / region mode.
            </Prop>
            <Prop name="fallback" type='"code" | "none"' def='"code"'>
              On a miss, <code>name</code> becomes the code
              (<code>&quot;code&quot;</code>) or <code>&quot;&quot;</code>{" "}
              (<code>&quot;none&quot;</code>). Either way{" "}
              <code>found</code> is <code>false</code>.
            </Prop>
            <Prop name="languageDisplay" type='"dialect" | "standard"' def='"dialect"'>
              Dialect (<code>&quot;American English&quot;</code>) vs standard
              (<code>&quot;English (United States)&quot;</code>). Only in language mode.
            </Prop>
            <p className="pt-2">
              The options type is a discriminated union on{" "}
              <code style={{ color: "var(--amber)" }}>mode</code> — TypeScript
              only offers <code>display</code> in smart / region mode and{" "}
              <code>languageDisplay</code> in language mode.
            </p>
          </Section>

          <Section id="flags" title="Flags">
            <p>
              Flags are derived from a two-letter region code by mapping each
              letter to its Unicode Regional Indicator Symbol — no image assets,
              no lookup table.
            </p>
            <Code>{`anyaround("US", { display: "flag" });      // "🇺🇸"
anyaround("US", { display: "flag-name" }); // "🇺🇸 United States"
anyaround("US", { display: "name-flag" }); // "United States 🇺🇸"`}</Code>
            <p>
              Numeric M49 regions (<code>&quot;419&quot;</code>) and non-region
              kinds have no flag, so flag <code>display</code> values fall back
              to the name.
            </p>
          </Section>

          <Section id="locales" title="Locales">
            <p>
              Pass any valid BCP 47 tag, including regional variants and fallback
              arrays.
            </p>
            <Code>{`anyaround("US", { locale: "ru" }); // "Соединенные Штаты"
anyaround("US", { locale: "de" }); // "Vereinigte Staaten"
anyaround("US", { locale: "ja" }); // "アメリカ合衆国"
anyaround("US", { locale: ["sr-Latn-RS", "en"] });`}</Code>
            <p>
              Output is pure — no <code>Date.now()</code>, no environment reads —
              so server and client render identically. SSR-safe by construction.
            </p>
          </Section>

          <Section id="compatibility" title="Compatibility">
            <div
              className="overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                ["Node.js", "18+"],
                ["Chrome", "81+"],
                ["Firefox", "86+"],
                ["Safari", "14.1+"],
                ["Edge Runtime", "✓"],
                ["Cloudflare Workers", "✓"],
                ["Deno", "✓"],
              ].map(([env, ver], i) => (
                <div
                  key={env}
                  className="flex items-center justify-between px-4 py-2 font-mono text-[13px]"
                  style={{
                    background: i % 2 ? "var(--table-alt)" : "transparent",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>{env}</span>
                  <span style={{ color: "var(--emerald)" }}>{ver}</span>
                </div>
              ))}
            </div>
            <p>
              <code style={{ color: "var(--violet)" }}>Intl.DisplayNames</code>{" "}
              is required (widely available since 2021). CI runs on Node 20, 22,
              and 24.
            </p>
          </Section>

          <Section id="limitations" title="Limitations">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["No cities", "Intl has no city display names. Regions and countries only."],
                ["Names track ICU", "Exact strings come from the runtime's ICU version — don't snapshot across environments."],
                ["No reverse lookup", "Code → name only; name → code is not provided."],
                ["Flags are alpha-2 only", "Numeric regions and non-region kinds have no flag."],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-lg border p-4"
                  style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
                >
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </p>
                  <p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </article>
      </div>
    </div>
  );
}
