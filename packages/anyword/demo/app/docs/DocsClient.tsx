"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anyword", label: "anyword()" },
  { id: "parts", label: "anywordParts()" },
  { id: "count", label: "anywordCount()" },
  { id: "truncate", label: "anywordTruncate()" },
  { id: "granularity", label: "Granularity" },
  { id: "options", label: "Options" },
  { id: "recipes", label: "Recipes" },
  { id: "ssr", label: "SSR" },
  { id: "locales", label: "Locales" },
  { id: "support", label: "Support flag" },
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

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ color: "var(--emerald)" }} className="font-mono">
      {children}
    </code>
  );
}

export function DocsClient() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("overview");

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
              ← anyword
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
        <main className="flex-1 min-w-0 pb-32">
          <h1 className="sr-only">anyword API reference</h1>

          <Section id="overview" title="Overview">
            <p>
              <strong style={{ color: "var(--text-primary)" }}>anyword</strong>{" "}
              is a micro text segmenter built entirely on the native{" "}
              <Mono>Intl.Segmenter</Mono> API. Four functions, one options
              object, three granularities. Stable since 1.0 — the public API
              follows semver.
            </p>
            <p>
              Naive JS quietly gets text wrong: <Mono>.length</Mono> miscounts
              emoji and accents, <Mono>.split(&quot; &quot;)</Mono> finds no
              words in Chinese or Thai, <Mono>[...str]</Mono> rips 👨‍👩‍👧‍👦 into
              pieces. The browser already knows where the real boundaries are.
              anyword is the thin wrapper — no rule tables, no locale files, no
              config.
            </p>
            <Code>{`import { anyword, anywordCount, anywordTruncate } from 'anyword'

anyword("don't stop 世界")
// ["don't", "stop", "世界"]

anyword("👨‍👩‍👧 hi", { by: 'grapheme' })
// ["👨‍👩‍👧", " ", "h", "i"]

anywordCount("世界 test")
// 2

anywordTruncate("héllo 👨‍👩‍👧", 5, { ellipsis: '…' })
// "héllo…"   — never cuts an emoji in half`}</Code>
          </Section>

          <Section id="install" title="Install">
            <Code>{`npm install anyword
# or
pnpm add anyword
# or
yarn add anyword`}</Code>
            <p>
              Zero dependencies, under 1kb gzipped, ESM and CJS builds with
              types. Also on JSR.
            </p>
          </Section>

          <Section id="anyword" title="anyword()">
            <p>
              The main entry point. Pass text, optionally pass options. Returns
              the segments as plain strings, in order.
            </p>
            <Code>{`anyword(text)
anyword(text, options?)

anyword('hi there')                      // ["hi", "there"]
anyword('hi there', { by: 'grapheme' })  // ["h","i"," ","t","h","e","r","e"]
anyword("don't stop 世界")                // ["don't", "stop", "世界"]
anyword('Hi. Go now!', { by: 'sentence' })  // ["Hi. ", "Go now!"]`}</Code>
            <p>
              Word mode drops the segments between words — spaces and
              punctuation. Set <Mono>raw: true</Mono> to keep them, and the
              pieces join back into the original string.
            </p>
            <Code>{`anyword('hi, there!')                  // ["hi", "there"]
anyword('hi, there!', { raw: true })   // ["hi", ",", " ", "there", "!"]`}</Code>
          </Section>

          <Section id="parts" title="anywordParts()">
            <p>
              Same arguments as <Mono>anyword()</Mono>, but returns{" "}
              <Mono>{"{ segment, index, isWordLike? }"}</Mono> instead of plain
              strings. The offsets point into the original text, so you can
              highlight or slice without searching again.
            </p>
            <Code>{`import { anywordParts } from 'anyword'

anywordParts('世界 test')
// [
//   { segment: '世界', index: 0, isWordLike: true },
//   { segment: 'test', index: 3, isWordLike: true },
// ]

// React: highlight the matched word in place
anywordParts(text, { raw: true }).map((p, i) =>
  p.segment === query ? <mark key={i}>{p.segment}</mark> : p.segment,
)`}</Code>
            <p>
              <Mono>isWordLike</Mono> is present in word mode only — in grapheme
              and sentence modes every segment is content.
            </p>
          </Section>

          <Section id="count" title="anywordCount()">
            <p>
              Takes the same options and counts segments instead of returning
              them.
            </p>
            <Code>{`anywordCount('世界 test')                  // 2
anywordCount('世界test')                   // 2   — .split(/\\s+/) says 1
anywordCount('héllo', { by: 'grapheme' })  // 5
anywordCount('👨‍👩‍👧', { by: 'grapheme' })    // 1   — "👨‍👩‍👧".length is 8`}</Code>
            <p>
              Grapheme counting is what a char-limit counter should show: the
              number of characters the user believes they typed.
            </p>
          </Section>

          <Section id="truncate" title="anywordTruncate()">
            <p>
              <Mono>anywordTruncate(text, limit, options?)</Mono> cuts to at
              most <Mono>limit</Mono> segments — graphemes by default, so an
              emoji or an accented letter is never split.
            </p>
            <Code>{`anywordTruncate('héllo 👨‍👩‍👧', 6)                     // "héllo "
anywordTruncate('héllo 👨‍👩‍👧', 5, { ellipsis: '…' })   // "héllo…"
anywordTruncate('one two three', 2, { by: 'word' })  // "one two "
anywordTruncate('short', 99)                         // "short"  — already fits`}</Code>
            <p>
              The cut lands on a segment boundary and keeps everything before it
              verbatim, trailing whitespace included. With <Mono>ellipsis</Mono>
              , that whitespace is trimmed and the ellipsis appended — and only
              when the text was actually too long, so short input comes back
              untouched. The ellipsis itself does not count toward{" "}
              <Mono>limit</Mono>.
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              Throws <Mono>RangeError</Mono> if <Mono>limit</Mono> is negative
              or not finite.
            </p>
          </Section>

          <Section id="granularity" title="Granularity">
            <p>
              <Mono>by</Mono> maps straight to <Mono>Intl.Segmenter</Mono>.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden"
            >
              {[
                [
                  "word",
                  "words (default)",
                  '"don\'t stop 世界" → ["don\'t", "stop", "世界"]',
                ],
                [
                  "grapheme",
                  "user-perceived characters",
                  '"👨‍👩‍👧 hi" → ["👨‍👩‍👧", " ", "h", "i"]',
                ],
                [
                  "sentence",
                  "sentences",
                  '"Hi. Go now!" → ["Hi. ", "Go now!"]',
                ],
              ].map(([value, unit, example], i) => (
                <div
                  key={value}
                  className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-4"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--table-alt)" : "transparent",
                  }}
                >
                  <code
                    style={{ color: "var(--amber)", minWidth: "6rem" }}
                    className="font-mono text-sm"
                  >
                    &quot;{value}&quot;
                  </code>
                  <span
                    style={{ color: "var(--text-secondary)", minWidth: "13rem" }}
                  >
                    {unit}
                  </span>
                  <code
                    style={{ color: "var(--emerald)" }}
                    className="font-mono text-xs break-words"
                  >
                    {example}
                  </code>
                </div>
              ))}
            </div>
            <p>
              Grapheme and sentence modes never drop anything, so{" "}
              <Mono>raw</Mono> does nothing there.
            </p>
          </Section>

          <Section id="options" title="Options">
            <Prop
              name="by"
              type="'word' | 'grapheme' | 'sentence'"
              def="'word'"
              desc="Segmentation unit. anywordTruncate defaults to 'grapheme' instead — cutting by character is what a length limit almost always means."
            />
            <Prop
              name="locale"
              type="string | string[]"
              def="runtime locale"
              desc="Any valid BCP 47 locale tag, or a fallback array — 'en', 'ja', 'th', ['xx-Nope', 'en']."
            />
            <Prop
              name="raw"
              type="boolean"
              def="false"
              desc="Word mode only: keep the segments between words — spaces and punctuation. Ignored for grapheme and sentence, which never drop anything."
            />
            <Prop
              name="ellipsis"
              type="string"
              def="''"
              desc="anywordTruncate only. Appended when the text was actually cut; trailing whitespace is trimmed first. Does not count toward the limit."
            />
          </Section>

          <Section id="recipes" title="Recipes">
            <p>Copy, paste, move on.</p>
            <Code>{`// Word counter
anywordCount(post.body)
// 412

// Character counter users agree with (👨‍👩‍👧 counts as 1, not 8)
anywordCount(input, { by: 'grapheme' })

// Safe preview / char-limit cut
anywordTruncate(bio, 140, { ellipsis: '…' })

// Word-limited excerpt
anywordTruncate(article, 30, { by: 'word', ellipsis: ' …' })

// Per-character animation, emoji intact
anyword(title, { by: 'grapheme' }).map((c, i) => <span key={i}>{c}</span>)

// Safe reverse
anyword(text, { by: 'grapheme' }).reverse().join('')

// Initials
anyword(fullName).slice(0, 2)
  .map((w) => anyword(w, { by: 'grapheme' })[0])
  .join('')

// Split into sentences
anyword(text, { by: 'sentence' })`}</Code>
          </Section>

          <Section id="ssr" title="SSR">
            <p>
              anyword is pure and synchronous — no clock, no state — so it
              renders the same on server and client. Pass a <Mono>locale</Mono>{" "}
              to keep output stable across the hydration boundary regardless of
              the runtime default.
            </p>
            <Code>{`import { anywordCount } from 'anyword'

export function CharCounter({ value }: { value: string }) {
  return (
    <span>{anywordCount(value, { by: 'grapheme', locale: 'en' })}/280</span>
  )
}`}</Code>
          </Section>

          <Section id="locales" title="Locales">
            <p>
              Pass any valid BCP 47 tag. Fallback arrays also work. The locale
              matters most for word breaking in scripts without spaces.
            </p>
            <Code>{`anyword('これは日本語です', { locale: 'ja' })  // ["これ", "は", "日本語", "です"]
anyword('สวัสดีชาวโลก', { locale: 'th' })   // ["สวัสดี", "ชาว", "โลก"] — no spaces needed
anyword("don't stop", { locale: 'en' })     // ["don't", "stop"]
anyword('hi', { locale: ['xx-Nope', 'en'] })`}</Code>
            <p>
              When omitted, native <Mono>Intl</Mono> uses the runtime locale.
            </p>
          </Section>

          <Section id="support" title="Support flag">
            <p>
              <Mono>Intl.Segmenter</Mono> is missing on older runtimes. There
              anyword throws a clear error at call time; check the exported{" "}
              <Mono>supported</Mono> flag first if you target them.
            </p>
            <Code>{`import { anyword, supported } from 'anyword'

supported ? anyword(text) : text.split(/\\s+/)`}</Code>
          </Section>

          <Section id="compatibility" title="Compatibility">
            <p>
              anyword uses <Mono>Intl.Segmenter</Mono> — supported everywhere
              modern, and detectable via <Mono>supported</Mono> where it is not.
            </p>
            <div
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border overflow-hidden mt-2"
            >
              {[
                ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
                ["Chrome", "87+", ""],
                ["Firefox", "125+", ""],
                ["Safari", "14.1+", ""],
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
                  title: "Boundaries come from the runtime's ICU data",
                  body: "anyword delegates all segmentation to native Intl. Exact segment lists may vary between Node versions, browsers, and OSes — especially for CJK and Thai. Don't assert on exact arrays across environments; test behaviour, not strings.",
                },
                {
                  title: "Not an NLP toolkit",
                  body: "anyword does one thing: boundaries. No stemming, no stop words, no message catalogs, no tokenizer for model input. Reach for a real NLP library or i18n framework when you need those.",
                },
                {
                  title: "Missing on older runtimes",
                  body: "Intl.Segmenter landed late — Firefox 125, Safari 14.1. On engines without it every anyword function throws. Branch on the exported supported flag if you target them.",
                },
                {
                  title: "Word mode drops separators by default",
                  body: "anyword('hi, there!') returns two words — the comma and spaces are gone, so the pieces do not rejoin into the input. Pass raw: true when you need a lossless round trip.",
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
