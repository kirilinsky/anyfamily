"use client";

import {
  Cards,
  Code,
  CompareTable,
  DocsShell,
  Mono,
  Prop,
  Rows,
  Section,
  type DocsNavItem,
} from "@/components/docs-shell";

const NAV: DocsNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anyword", label: "anyword()" },
  { id: "migrating", label: "From 1.x" },
  { id: "parts", label: "anyword.parts()" },
  { id: "count", label: "anyword.count()" },
  { id: "truncate", label: "anyword.truncate()" },
  { id: "granularity", label: "Granularity" },
  { id: "options", label: "Options" },
  { id: "breaks", label: "What breaks" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "ssr", label: "SSR" },
  { id: "locales", label: "Locales" },
  { id: "support", label: "Support flag" },
  { id: "alternatives", label: "Alternatives" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const GRANULARITIES = [
  ["word", "words (default)", '"don\'t stop 世界" → ["don\'t", "stop", "世界"]'],
  ["grapheme", "user-perceived characters", '"👨‍👩‍👧 hi" → ["👨‍👩‍👧", " ", "h", "i"]'],
  ["sentence", "sentences", '"Hi. Go now!" → ["Hi. ", "Go now!"]'],
];

const COMPATIBILITY = [
  ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
  ["Chrome", "87+", ""],
  ["Firefox", "125+", ""],
  ["Safari", "14.1+", ""],
  ["Vercel Edge Runtime", "✓", ""],
  ["Cloudflare Workers", "✓", ""],
  ["Deno", "✓", ""],
];

const LIMITATIONS = [
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
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyword"
      nav={NAV}
      accentDark="#c9f53c"
      accentLight="#4d7c0f"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anyword</strong> is a
          micro text segmenter built entirely on the native{" "}
          <Mono>Intl.Segmenter</Mono> API. Four functions, one options object,
          three granularities. Stable since 1.0 — the public API follows semver.
        </p>
        <p>
          Naive JS quietly gets text wrong: <Mono>.length</Mono> miscounts emoji
          and accents, <Mono>.split(&quot; &quot;)</Mono> finds no words in
          Chinese or Thai, <Mono>[...str]</Mono> rips 👨‍👩‍👧‍👦 into pieces. The
          browser already knows where the real boundaries are. anyword is the
          thin wrapper — no rule tables, no locale files, no config.
        </p>
        <Code>{`import { anyword, anyword.count, anyword.truncate } from 'anyword'

anyword("don't stop 世界")
// ["don't", "stop", "世界"]

anyword("👨‍👩‍👧 hi", { by: 'grapheme' })
// ["👨‍👩‍👧", " ", "h", "i"]

anyword.count("世界 test")
// 2

anyword.truncate("héllo 👨‍👩‍👧", 5, { ellipsis: '…' })
// "héllo…"   — never cuts an emoji in half`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anyword
# or
pnpm add anyword
# or
yarn add anyword`}</Code>
        <p>
          Zero dependencies, under 1kb gzipped, ESM and CJS builds with types.
          Also on JSR. Or take the whole family at once with{" "}
          <Mono>npm install anyfamily</Mono>.
        </p>
      </Section>

      <Section id="anyword" title="anyword()">
        <p>
          The main entry point. Pass text, optionally pass options. Returns the
          segments as plain strings, in order.
        </p>
        <Code>{`anyword(text)
anyword(text, options?)

anyword('hi there')                      // ["hi", "there"]
anyword('hi there', { by: 'grapheme' })  // ["h","i"," ","t","h","e","r","e"]
anyword("don't stop 世界")                // ["don't", "stop", "世界"]
anyword('Hi. Go now!', { by: 'sentence' })  // ["Hi. ", "Go now!"]`}</Code>
        <p>
          Word mode drops the segments between words — spaces and punctuation.
          Set <Mono>raw: true</Mono> to keep them, and the pieces join back into
          the original string.
        </p>
        <Code>{`anyword('hi, there!')                  // ["hi", "there"]
anyword('hi, there!', { raw: true })   // ["hi", ",", " ", "there", "!"]`}</Code>
      </Section>

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anywordParts</Mono> 
          and the other extra exports — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anyword, anywordCount, anywordTruncate, supported } from 'anyword'
+ import { anyword } from 'anyword'

- anywordCount(text)
+ anyword.count(text)

- anywordTruncate(text, 20)
+ anyword.truncate(text, 20)

- supported ? anyword(text) : text.split(/\\s+/)
+ anyword.supported ? anyword(text) : text.split(/\\s+/)`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="parts" title="anyword.parts()">
        <p>
          Same arguments as <Mono>anyword()</Mono>, but returns{" "}
          <Mono>{"{ segment, index, isWordLike? }"}</Mono> instead of plain
          strings. The offsets point into the original text, so you can
          highlight or slice without searching again.
        </p>
        <Code>{`import { anyword } from 'anyword'

anyword.parts('世界 test')
// [
//   { segment: '世界', index: 0, isWordLike: true },
//   { segment: 'test', index: 3, isWordLike: true },
// ]

// React: highlight the matched word in place
anyword.parts(text, { raw: true }).map((p, i) =>
  p.segment === query ? <mark key={i}>{p.segment}</mark> : p.segment,
)`}</Code>
        <p>
          <Mono>isWordLike</Mono> is present in word mode only — in grapheme and
          sentence modes every segment is content.
        </p>
      </Section>

      <Section id="count" title="anyword.count()">
        <p>
          Takes the same options and counts segments instead of returning them.
        </p>
        <Code>{`anyword.count('世界 test')                  // 2
anyword.count('世界test')                   // 2   — .split(/\\s+/) says 1
anyword.count('héllo', { by: 'grapheme' })  // 5
anyword.count('👨‍👩‍👧', { by: 'grapheme' })    // 1   — "👨‍👩‍👧".length is 8`}</Code>
        <p>
          Grapheme counting is what a char-limit counter should show: the number
          of characters the user believes they typed.
        </p>
      </Section>

      <Section id="truncate" title="anyword.truncate()">
        <p>
          <Mono>anyword.truncate(text, limit, options?)</Mono> cuts to at most{" "}
          <Mono>limit</Mono> segments — graphemes by default, so an emoji or an
          accented letter is never split.
        </p>
        <Code>{`anyword.truncate('héllo 👨‍👩‍👧', 6)                     // "héllo "
anyword.truncate('héllo 👨‍👩‍👧', 5, { ellipsis: '…' })   // "héllo…"
anyword.truncate('one two three', 2, { by: 'word' })  // "one two "
anyword.truncate('short', 99)                         // "short"  — already fits`}</Code>
        <p>
          The cut lands on a segment boundary and keeps everything before it
          verbatim, trailing whitespace included. With <Mono>ellipsis</Mono>,
          that whitespace is trimmed and the ellipsis appended — and only when
          the text was actually too long, so short input comes back untouched.
          The ellipsis itself does not count toward <Mono>limit</Mono>.
        </p>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Throws <Mono>RangeError</Mono> if <Mono>limit</Mono> is negative or not
          finite.
        </p>
      </Section>

      <Section id="granularity" title="Granularity">
        <p>
          <Mono>by</Mono> maps straight to <Mono>Intl.Segmenter</Mono>.
        </p>
        <Rows>
          {GRANULARITIES.map(([value, unit, example]) => (
            <div
              key={value}
              className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-4"
            >
              <code
                style={{ color: "var(--doc-accent)", minWidth: "6rem" }}
                className="font-mono text-sm"
              >
                &quot;{value}&quot;
              </code>
              <span style={{ color: "var(--text-secondary)", minWidth: "13rem" }}>
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
        </Rows>
        <p>
          Grapheme and sentence modes never drop anything, so <Mono>raw</Mono>{" "}
          does nothing there.
        </p>
      </Section>

      <Section id="options" title="Options">
        <Prop
          name="by"
          type="'word' | 'grapheme' | 'sentence'"
          def="'word'"
          desc="Segmentation unit. anyword.truncate defaults to 'grapheme' instead — cutting by character is what a length limit almost always means."
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
          desc="anyword.truncate only. Appended when the text was actually cut; trailing whitespace is trimmed first. Does not count toward the limit."
        />
      </Section>

      <Section id="breaks" title="What breaks without this">
        <p>Every one of these is a bug report waiting to be filed by a user with an emoji in their name.</p>
        <Cards
          items={[
            {
              title: "length counts code units, not characters",
              body: "\"👨‍👩‍👧\".length is 8. A 280-character limit measured that way rejects a post that shows as 35 characters, and the number under the input is wrong for anyone writing outside ASCII.",
            },
            {
              title: "slice cuts inside a character",
              body: "Truncating by index splits a surrogate pair into two halves that render as a replacement glyph, or cuts a ZWJ sequence so a family emoji falls apart into three people. The cut has to land on a grapheme boundary.",
            },
            {
              title: "split(' ') assumes spaces exist",
              body: "Japanese, Chinese and Thai do not put them between words. A word count built on spaces returns 1 for an entire paragraph, and a preview truncated on spaces never truncates at all.",
            },
            {
              title: "Regex word boundaries are ASCII rules",
              body: "The \\b word boundary splits don't into two words and treats accented letters inconsistently depending on the flags. Word segmentation is a Unicode algorithm, and the runtime already implements it.",
            },
          ]}
        />
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Word counter
anyword.count(post.body)
// 412

// Character counter users agree with (👨‍👩‍👧 counts as 1, not 8)
anyword.count(input, { by: 'grapheme' })

// Safe preview / char-limit cut
anyword.truncate(bio, 140, { ellipsis: '…' })

// Word-limited excerpt
anyword.truncate(article, 30, { by: 'word', ellipsis: ' …' })

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

      <Section id="react" title="React / Next.js">
        <p>
          anyword is pure and synchronous, so it works in a component as-is. What 
          <Mono>anyfamily-react</Mono> adds is a shared locale: set it once on 
          <Mono>AnyfamilyProvider</Mono> and every hook below picks it up, so you
          do not thread <Mono>locale</Mono> through every call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnyword, useAnywordCount } from 'anyfamily-react'

function CharCounter({ value }: { value: string }) {
  return <span>{useAnywordCount(value, { by: 'grapheme' })}/280</span>
}

// useAnyword returns an array, so it is memoized — the same segments keep the
// same reference until the text or the options change.
function Letters({ title }: { title: string }) {
  return useAnyword(title, { by: 'grapheme' }).map((c, i) => <span key={i}>{c}</span>)
}`}</Code>
        <p>`anywordSupported` is re-exported for feature-detecting `Intl.Segmenter`.</p>
      </Section>

      <Section id="ssr" title="SSR">
        <p>
          anyword is pure and synchronous — no clock, no state — so it renders
          the same on server and client. Pass a <Mono>locale</Mono> to keep
          output stable across the hydration boundary regardless of the runtime
          default.
        </p>
        <Code>{`import { anyword } from 'anyword'

export function CharCounter({ value }: { value: string }) {
  return (
    <span>{anyword.count(value, { by: 'grapheme', locale: 'en' })}/280</span>
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
          <Mono>Intl.Segmenter</Mono> is missing on older runtimes. There anyword
          throws a clear error at call time; check the exported{" "}
          <Mono>supported</Mono> flag first if you target them.
        </p>
        <Code>{`import { anyword } from 'anyword'

anyword.supported ? anyword(text) : text.split(/\\s+/)`}</Code>
        <p>
          Through the <Mono>anyfamily</Mono> meta-package the same flag is
          exported as <Mono>anywordSupported</Mono>, since{" "}
          <Mono>supported</Mono> collides with anylong&apos;s.
        </p>
      </Section>

      <Section id="alternatives" title="vs the alternatives">
        <p>
          What you would otherwise reach for, and what changes if you do.
        </p>
        <CompareTable
          head={["anyword", "grapheme-splitter", "words-count + lodash"]}
          rows={[
            ["gzip", "< 1kb", "~10kb", "~25kb"],
            ["unicode data bundled", "no", "yes", "yes"],
            ["boundary rules", "native Intl", "bundled tables", "regex"],
            ["word / sentence mode", "yes", "grapheme only", "spaces only"],
            ["dependencies", "0", "0", "1+"],
          ]}
        />
        <p>anyword is not an NLP toolkit — it does one thing. Reach for a tokenizer or a full i18n framework when you need stemming, stop words or message catalogs.</p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          anyword uses <Mono>Intl.Segmenter</Mono> — supported everywhere modern,
          and detectable via <Mono>supported</Mono> where it is not.
        </p>
        <Rows>
          {COMPATIBILITY.map(([env, ver, note]) => (
            <div
              key={env}
              className="flex items-center gap-4 px-4 py-2.5 font-mono text-sm"
            >
              <span
                style={{ color: "var(--text-secondary)", minWidth: "10rem" }}
              >
                {env}
              </span>
              <span style={{ color: "var(--emerald)", minWidth: "3rem" }}>
                {ver}
              </span>
              {note && (
                <span style={{ color: "var(--text-muted)" }} className="text-xs">
                  {note}
                </span>
              )}
            </div>
          ))}
        </Rows>
      </Section>

      <Section id="limitations" title="Limitations">
        <p>A few things worth knowing before you ship:</p>
        <div className="space-y-3">
          {LIMITATIONS.map(({ title, body }) => (
            <div
              key={title}
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border p-4"
            >
              <p
                style={{ color: "var(--text-primary)" }}
                className="mb-1 text-sm font-medium"
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
    </DocsShell>
  );
}
