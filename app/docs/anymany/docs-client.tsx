"use client";

import {
  Code,
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
  { id: "anymany", label: "anymany()" },
  { id: "migrating", label: "From 1.x" },
  { id: "parts", label: "anymany.parts()" },
  { id: "sort", label: "sort" },
  { id: "max", label: "max" },
  { id: "options", label: "Options" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "locales", label: "Locales" },
  { id: "ssr", label: "SSR" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const COMPATIBILITY = [
  ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
  ["Chrome", "72+", ""],
  ["Firefox", "78+", ""],
  ["Safari", "14.1+", ""],
  ["Edge", "79+", ""],
  ["Vercel Edge Runtime", "✓", ""],
  ["Cloudflare Workers", "✓", ""],
  ["Deno", "✓", ""],
];

const LIMITATIONS = [
  {
    title: "Output depends on the runtime's Intl data",
    body: "anymany delegates all formatting to native Intl. Exact output — joiner words, comma placement, the Oxford comma — may vary between Node versions, browsers, and regional variants (en vs en-GB). Don't hardcode expected strings in tests; use pattern matching instead.",
  },
  {
    title: "No pluralization, by design",
    body: "Intl ships no word data, and anymany ships zero language dictionaries — that is what keeps it lightweight and correct in every locale. The overflow counter is '+N' (localized digits) instead of 'and N more'. Need words? Pass your own via the overflow callback.",
  },
  {
    title: "The overflow item is a regular list element",
    body: "With max set, the '+N' counter goes through Intl.ListFormat like any other item, so conjunction mode reads 'x, y, z, and +4'. No hidden joiner magic — combine max with type: 'unit' for a plain comma list.",
  },
  {
    title: "Node.js < 18",
    body: "The package declares engines.node >= 18 and CI tests Node 20/22/24. Older versions down to 13 will usually work — the required Intl APIs are there — but they are unsupported and untested.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anymany"
      nav={NAV}
      accentDark="#2ce69d"
      accentLight="#047857"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anymany</strong> is a
          list formatter built entirely on the native <Mono>Intl</Mono> browser
          API. One function, one options object. Sorted right, joined right, in
          any locale. Stable since 1.0 — the public API follows semver.
        </p>
        <p>
          The browser already knows how to join and collate lists in 200+
          languages. anymany just makes that API pleasant to use.
        </p>
        <Code>{`import { anymany } from 'anymany'

anymany(['banana', 'apple', 'cherry'])
// "banana, apple, and cherry"

anymany(['S', 'M', 'L'], { type: 'disjunction' })
// "S, M, or L"

anymany(['x', 'y', 'z', 'a', 'b', 'c', 'd'], { max: 3 })
// "x, y, z, and +4"`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anymany
# or
pnpm add anymany
# or
yarn add anymany`}</Code>
        <p>
          Or take the whole family at once with <Mono>npm install anyfamily</Mono>
          .
        </p>
      </Section>

      <Section id="anymany" title="anymany()">
        <p>
          The single entry point. Pass an array of strings, optionally pass
          options. Non-string items are coerced via <Mono>String()</Mono>. An
          empty array returns <Mono>&quot;&quot;</Mono>; a single item is
          returned as-is.
        </p>
        <Code>{`anymany(items)
anymany(items, options?)

anymany(['read', 'write'])
// "read and write"

anymany(['a', 'b', 'c'], { style: 'short' })
// "a, b, & c"

anymany(['4 kg', '2 m'], { type: 'unit' })
// "4 kg, 2 m"

anymany(['cherry', 'apple', 'Banana'], { sort: true })
// "apple, Banana, and cherry"`}</Code>
      </Section>

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anymanyParts</Mono> 
           — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anymany, anymanyParts } from 'anymany'
+ import { anymany } from 'anymany'

- anymanyParts(items)
+ anymany.parts(items)`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="parts" title="anymany.parts()">
        <p>
          Same arguments as <Mono>anymany()</Mono>, but returns the output as{" "}
          <Mono>{"{ type, value }"}</Mono> parts instead of a string — style the
          items apart from the separators, or rebuild the output your own way.
        </p>
        <Code>{`import { anymany } from 'anymany'

anymany.parts(['a', 'b'])
// [
//   { type: 'element', value: 'a' },
//   { type: 'literal', value: ' and ' },
//   { type: 'element', value: 'b' },
// ]

// React: bold the items
anymany.parts(tags).map((p, i) =>
  p.type === 'element' ? <b key={i}>{p.value}</b> : p.value,
)`}</Code>
      </Section>

      <Section id="sort" title="Sorting">
        <p>
          <Mono>sort</Mono> runs the items through <Mono>Intl.Collator</Mono>{" "}
          before joining — real language-aware collation, not code-point order.
          The input array is never mutated.
        </p>
        <Code>{`anymany(['cherry', 'apple', 'Banana'], { sort: true })
// "apple, Banana, and cherry"   ← plain .sort() puts "Banana" first

anymany(['file10', 'file2'], { sort: 'numeric' })
// "file2 and file10"            ← numbers compared by value

anymany(['a', 'A'], { sort: { caseFirst: 'upper' } })
// "A and a"                     ← any Intl.CollatorOptions`}</Code>
      </Section>
      <Section id="max" title="Max + overflow">
        <p>
          <Mono>max</Mono> caps the visible items; the rest collapse into a
          trailing <Mono>&quot;+N&quot;</Mono> counter. Digits come from{" "}
          <Mono>Intl.NumberFormat</Mono>, so they localize — no words,
          locale-safe.
        </p>
        <Code>{`anymany(['x', 'y', 'z', 'a', 'b', 'c', 'd'], { max: 3 })
// "x, y, z, and +4"

anymany(['x', 'y', 'z', 'a', 'b'], { max: 3, overflow: (n) => \`\${n} more\` })
// "x, y, z, and 2 more"`}</Code>
        <p>
          The overflow item is just another list element, so the default{" "}
          <Mono>type</Mono> places an &quot;and&quot; before it. That is
          intentional — no hidden joiner magic. Prefer a plain comma list?
          Combine <Mono>max</Mono> with <Mono>type: &apos;unit&apos;</Mono>.
        </p>
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

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Tag list
anymany(post.tags, { locale: 'en' })
// "design, typography, and color"

// Sizes / options — "or" instead of "and"
anymany(product.sizes, { type: 'disjunction' })
// "S, M, or L"

// Plain comma list, no joiner word
anymany(['4 kg', '2 m'], { type: 'unit' })
// "4 kg, 2 m"

// Alphabetical the way the language actually orders letters
anymany(names, { sort: true, locale: 'de' })
// "Apfel, Öl und Zebra"

// Filenames with numbers, ordered by value
anymany(files, { sort: 'numeric' })
// "file2 and file10"

// Cap a long list
anymany(participants, { max: 3 })
// "Ann, Bob, Cy, and +4"

// …with your own overflow wording
anymany(participants, { max: 3, overflow: (n) => \`\${n} more\` })
// "Ann, Bob, Cy, and 2 more" `}</Code>
      </Section>

      <Section id="react" title="React / Next.js">
        <p>
          anymany is pure and synchronous, so it works in a component as-is. What 
          <Mono>anyfamily-react</Mono> adds is a shared locale: set it once on 
          <Mono>AnyfamilyProvider</Mono> and every hook below picks it up, so you
          do not thread <Mono>locale</Mono> through every call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnymany } from 'anyfamily-react'

function Tags({ tags }: { tags: string[] }) {
  return <p>{useAnymany(tags, { sort: true, max: 5 })}</p>
}

<AnyfamilyProvider locale="en">
  <Tags tags={post.tags} />
</AnyfamilyProvider>`}</Code>
      </Section>



      <Section id="locales" title="Locales">
        <p>Same calls in a few languages — no extra setup, no locale files.</p>
        <Code>{`anymany(['a', 'b', 'c'], { locale: 'en' })   // "a, b, and c"
anymany(['a', 'b', 'c'], { locale: 'ru' })   // "a, b и c"
anymany(['a', 'b', 'c'], { locale: 'de' })   // "a, b und c"
anymany(['a', 'b', 'c'], { locale: 'ja' })   // "a、b、c"

anymany(['a', 'b', 'c'], { type: 'disjunction', locale: 'ru' })
// "a, b или c"

anymany(['Öl', 'Zebra', 'Apfel'], { sort: true, locale: 'de' })
// "Apfel, Öl und Zebra"   ← Ö sorts after A, not after Z

anymany(['файл10', 'файл2'], { sort: 'numeric', locale: 'ru' })
// "файл2 и файл10"

anymany(['a', 'b', 'c', 'd', 'e', 'f', 'g'], { max: 3, locale: 'ar-EG' })
// "a وb وc و+٤"           ← localized overflow digits`}</Code>
        <p>
          Pass any valid{" "}
          <a
            href="https://www.ietf.org/rfc/rfc5646.txt"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--sky)" }}
            className="cursor-pointer transition-opacity hover:opacity-70"
          >
            BCP 47
          </a>{" "}
          language tag — including regional variants like <Mono>en-GB</Mono>,{" "}
          <Mono>zh-TW</Mono>, or <Mono>pt-BR</Mono>. Locale is optional; when
          omitted, native <Mono>Intl</Mono> uses the runtime locale. Fallback
          arrays like <Mono>[&apos;sr-Latn-RS&apos;, &apos;en&apos;]</Mono> also
          work.
        </p>
      </Section>

      <Section id="ssr" title="SSR">
        <p>
          anymany is pure — same input, same output, no clocks, no randomness, no
          DOM. Server and client render identically as long as the{" "}
          <Mono>locale</Mono> is passed explicitly (the runtime locale may differ
          between server and browser).
        </p>
        <Code>{`import { anymany } from 'anymany'

export function TagList({ tags }: { tags: string[] }) {
  return <p>{anymany(tags, { locale: 'en', sort: true, max: 5 })}</p>
}`}</Code>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          anymany uses <Mono>Intl.ListFormat</Mono>, <Mono>Intl.Collator</Mono>,
          and <Mono>Intl.NumberFormat</Mono> — all widely supported.
        </p>
        <Rows>
          {COMPATIBILITY.map(([env, ver, note]) => (
            <div
              key={env}
              className="flex items-center gap-4 px-4 py-2.5 font-mono text-sm"
            >
              <span style={{ color: "var(--text-secondary)", minWidth: "10rem" }}>
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
