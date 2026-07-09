"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anymany", label: "anymany()" },
  { id: "parts", label: "anymanyParts()" },
  { id: "options", label: "Options" },
  { id: "sort", label: "Sorting" },
  { id: "max", label: "Max + overflow" },
  { id: "locales", label: "Locales" },
  { id: "ssr", label: "SSR" },
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
              ← anymany
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
          <h1 className="sr-only">anymany API reference</h1>
          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>anymany</strong>{" "}
              is a tiny list formatter built entirely on the native{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl
              </code>{" "}
              browser API. One function, one options object. Sorted right,
              joined right, in any locale. Stable since 1.0 — the public API
              follows semver.
            </p>
            <p>
              The browser already knows how to join and collate lists in 200+
              languages. anymany just makes that API pleasant to use.
            </p>
            <Code>{`import { anymany } from 'anymany'

anymany(['banana', 'apple', 'cherry'])
// "banana, apple, and cherry"

anymany(['a', 'b', 'c'], { type: 'disjunction', locale: 'ru' })
// "a, b или c"

anymany(['x', 'y', 'z', 'a', 'b', 'c', 'd'], { max: 3 })
// "x, y, z, and +4"`}</Code>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm install anymany
# or
pnpm add anymany
# or
yarn add anymany`}</Code>
          </Section>

          <Section id="anymany" title="anymany()">
            <p>
              The single entry point. Pass an array of strings, optionally pass
              options. Non-string items are coerced via{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                String()
              </code>
              . An empty array returns{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                &quot;&quot;
              </code>
              ; a single item is returned as-is.
            </p>
            <Code>{`anymany(items)
anymany(items, options?)

anymany(['read', 'write'])
// "read and write"

anymany(['a', 'b', 'c'], { style: 'short' })
// "a, b, & c"

anymany(['4 kg', '2 m'], { type: 'unit' })
// "4 kg, 2 m"

anymany(['Öl', 'Zebra', 'Apfel'], { sort: true, locale: 'de' })
// "Apfel, Öl und Zebra"`}</Code>
          </Section>

          <Section id="parts" title="anymanyParts()">
            <p>
              Same arguments as{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                anymany()
              </code>
              , but returns the output as{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                {"{ type, value }"}
              </code>{" "}
              parts instead of a string — style the items apart from the
              separators, or rebuild the output your own way.
            </p>
            <Code>{`import { anymanyParts } from 'anymany'

anymanyParts(['a', 'b'])
// [
//   { type: 'element', value: 'a' },
//   { type: 'literal', value: ' and ' },
//   { type: 'element', value: 'b' },
// ]

// React: bold the items
anymanyParts(tags).map((p, i) =>
  p.type === 'element' ? <b key={i}>{p.value}</b> : p.value,
)`}</Code>
          </Section>

          <Section id="options" title="Options">
            <Prop
              name="locale"
              type="string | string[]"
              def="runtime locale"
              desc="Any valid BCP 47 locale tag, or a fallback array — 'en', 'en-US', 'zh-TW', ['sr-Latn-RS', 'en']."
            />
            <Prop
              name="type"
              type="'conjunction' | 'disjunction' | 'unit'"
              def="'conjunction'"
              desc="List flavor, mapped to Intl.ListFormat — 'a, b, and c' / 'a, b, or c' / 'a, b, c'."
            />
            <Prop
              name="style"
              type="'long' | 'short' | 'narrow'"
              def="'long'"
              desc="Joiner wording length, mapped to Intl.ListFormat — 'and' / '&' / none."
            />
            <Prop
              name="sort"
              type="boolean | 'numeric' | Intl.CollatorOptions"
              def="no sorting"
              desc="Sort items with Intl.Collator before joining. true = default collation, 'numeric' = numeric collation, or any Intl.CollatorOptions for full control. Never mutates the input."
            />
            <Prop
              name="max"
              type="number"
              def="no limit"
              desc="Maximum items to show (after sorting). The rest collapse into a trailing '+N' counter with localized digits. Throws RangeError when zero, negative, or fractional."
            />
            <Prop
              name="overflow"
              type="(hidden: number) => string"
              def="`+${N}`"
              desc="Custom overflow label builder, replaces the default '+N'. Receives the number of hidden items."
            />
          </Section>

          <Section id="sort" title="Sorting">
            <p>
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                sort
              </code>{" "}
              runs the items through{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.Collator
              </code>{" "}
              before joining — real language-aware collation, not code-point
              order. The input array is never mutated.
            </p>
            <Code>{`anymany(['Öl', 'Zebra', 'Apfel'], { sort: true, locale: 'de' })
// "Apfel, Öl und Zebra"   ← Ö sorts after A, not after Z

anymany(['файл10', 'файл2'], { sort: 'numeric', locale: 'ru' })
// "файл2 и файл10"        ← numbers compared by value

anymany(['a', 'A'], { sort: { caseFirst: 'upper' } })
// "A and a"               ← any Intl.CollatorOptions`}</Code>
          </Section>

          <Section id="max" title="Max + overflow">
            <p>
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                max
              </code>{" "}
              caps the visible items; the rest collapse into a trailing{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                &quot;+N&quot;
              </code>{" "}
              counter. Digits come from{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.NumberFormat
              </code>
              , so they localize — no words, locale-safe.
            </p>
            <Code>{`anymany(['x', 'y', 'z', 'a', 'b', 'c', 'd'], { max: 3 })
// "x, y, z, and +4"

anymany(['a', 'b', 'c', 'd', 'e', 'f', 'g'], { max: 3, locale: 'ar-EG' })
// "a وb وc و+٤"           ← localized digits

anymany(['x', 'y', 'z', 'a', 'b'], { max: 3, overflow: (n) => \`\${n} more\` })
// "x, y, z, and 2 more"`}</Code>
            <p>
              The overflow item is just another list element, so the default{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                type
              </code>{" "}
              places an &quot;and&quot; before it. That is intentional — no
              hidden joiner magic. Prefer a plain comma list? Combine{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                max
              </code>{" "}
              with{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                type: &apos;unit&apos;
              </code>
              .
            </p>
          </Section>

          <Section id="locales" title="Locales">
            <p>
              Same calls in a few languages — no extra setup, no locale files.
            </p>
            <Code>{`anymany(['a', 'b', 'c'], { locale: 'en' })   // "a, b, and c"
anymany(['a', 'b', 'c'], { locale: 'ru' })   // "a, b и c"
anymany(['a', 'b', 'c'], { locale: 'de' })   // "a, b und c"
anymany(['a', 'b', 'c'], { locale: 'ja' })   // "a、b、c"
anymany(['a', 'b', 'c'], { locale: 'fr' })   // "a, b et c"

anymany(['a', 'b', 'c'], { type: 'disjunction', locale: 'es' })
// "a, b o c"`}</Code>
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

          <Section id="ssr" title="SSR">
            <p>
              anymany is pure — same input, same output, no clocks, no
              randomness, no DOM. Server and client render identically as long
              as the{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                locale
              </code>{" "}
              is passed explicitly (the runtime locale may differ between
              server and browser).
            </p>
            <Code>{`import { anymany } from 'anymany'

export function TagList({ tags }: { tags: string[] }) {
  return <p>{anymany(tags, { locale: 'en', sort: true, max: 5 })}</p>
}`}</Code>
          </Section>

          <Section id="compatibility" title="Compatibility">
            <p>
              anymany uses{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.ListFormat
              </code>
              ,{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.Collator
              </code>
              , and{" "}
              <code style={{ color: "var(--emerald)" }} className="font-mono">
                Intl.NumberFormat
              </code>{" "}
              — all widely supported.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden mt-2"
            >
              {[
                ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
                ["Chrome", "72+", ""],
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
                  title: "Output depends on the runtime's Intl data",
                  body: "anymany delegates all formatting to native Intl. Exact output — joiner words, comma placement, the Oxford comma — may vary between Node versions, browsers, and regional variants (en vs en-GB). Don't hardcode expected strings in tests; use pattern matching instead.",
                },
                {
                  title: "No pluralization, by design",
                  body: "Intl ships no word data, and anymany ships zero language dictionaries — that is what keeps it tiny and correct in every locale. The overflow counter is '+N' (localized digits) instead of 'and N more'. Need words? Pass your own via the overflow callback.",
                },
                {
                  title: "The overflow item is a regular list element",
                  body: "With max set, the '+N' counter goes through Intl.ListFormat like any other item, so conjunction mode reads 'x, y, z, and +4'. No hidden joiner magic — combine max with type: 'unit' for a plain comma list.",
                },
                {
                  title: "Node.js < 18",
                  body: "The package declares engines.node >= 18 and CI tests Node 20/22/24. Older versions down to 13 will usually work — the required Intl APIs are there — but they are unsupported and untested.",
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
