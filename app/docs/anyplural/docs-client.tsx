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
  { id: "anyplural", label: "anyplural()" },
  { id: "migrating", label: "From 1.x" },
  { id: "parts", label: "anyplural.parts()" },
  { id: "forms", label: "Forms" },
  { id: "categories", label: "Categories" },
  { id: "zero", label: "The zero form" },
  { id: "options", label: "Options" },
  { id: "breaks", label: "What breaks" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React" },
  { id: "locales", label: "Locales" },
  { id: "ssr", label: "SSR" },
  { id: "alternatives", label: "Alternatives" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const CATEGORIES = [
  ["zero", "Arabic 0; a few locales only", 'ar: 0 → "zero"'],
  ["one", "singular — not always literally 1", 'ru: 1, 21, 31 → "one"'],
  ["two", "dual", 'ar: 2 → "two"'],
  ["few", "small plural", 'ru: 2–4, 22–24 → "few"'],
  ["many", "large plural", 'ru: 5–20, 25–30 → "many"'],
  ["other", "the catch-all every locale can reach", 'en: 0, 2, 99 → "other"'],
];

const COMPATIBILITY = [
  ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
  ["Chrome", "63+", ""],
  ["Firefox", "58+", ""],
  ["Safari", "13+", ""],
  ["Edge", "18+", ""],
  ["Vercel Edge Runtime", "✓", ""],
  ["Cloudflare Workers", "✓", ""],
  ["Deno", "✓", ""],
];

const LIMITATIONS = [
  {
    title: "You supply the words",
    body: "anyplural picks the category and formats the number; it ships no dictionaries, so the forms are yours to write. That is what keeps it correct in every locale and near-zero in size — but it is not a translation system. For full message catalogs with interpolation, reach for an i18n framework.",
  },
  {
    title: "Categories are not numbers",
    body: "'one' does not mean 1. Russian resolves 21 and 31 to 'one', and 0 to 'many'. Write forms per category, never per number — that is the whole point of Intl.PluralRules.",
  },
  {
    title: "A missing reachable category throws",
    body: "If the resolved category has no form and there is no 'other' to fall back to, anyplural raises a RangeError rather than guessing or rendering an empty word. Supply 'other' unless you are certain the locale can never reach it.",
  },
  {
    title: "Integers are the well-trodden path",
    body: "Intl.PluralRules also has rules for decimals, and passing a fractional count works, but the category a locale picks for 1.5 surprises people. Check the output for the locales you ship before relying on it.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyplural"
      nav={NAV}
      accentDark="#e879c5"
      accentLight="#a21caf"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anyplural</strong>{" "}
          turns a count into its correct plural form in any locale. It asks
          native <Mono>Intl.PluralRules</Mono> which CLDR category the number
          falls into, formats the number with <Mono>Intl.NumberFormat</Mono>, and
          stitches the two together. No rule tables, no dictionaries, zero
          dependencies.
        </p>
        <p>
          <Mono>n === 1 ? &apos;item&apos; : &apos;items&apos;</Mono> is an
          English-only assumption. Russian needs three forms, Arabic six, Japanese
          one. The browser has known all of this for years.
        </p>
        <Code>{`import { anyplural } from 'anyplural'

anyplural(1, { one: 'item', other: 'items' })
// "1 item"

anyplural(5, { one: 'item', other: 'items' })
// "5 items"

anyplural(5, { one: 'год', few: 'года', many: 'лет' }, { locale: 'ru' })
// "5 лет"

anyplural(3, { one: 'st', two: 'nd', few: 'rd', other: 'th' }, { type: 'ordinal' })
// "3rd"`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anyplural
# or
pnpm add anyplural
# or
yarn add anyplural`}</Code>
        <p>
          Zero dependencies, ESM and CJS builds with types. Or take the whole
          family at once with <Mono>npm install anyfamily</Mono>.
        </p>
      </Section>

      <Section id="anyplural" title="anyplural()">
        <p>
          The single entry point. Pass a count and the word forms, optionally
          pass options. Returns the formatted count followed by the matching
          form.
        </p>
        <Code>{`anyplural(count, forms)
anyplural(count, forms, options?)

anyplural(1, { one: 'item', other: 'items' }, { locale: 'en' })
// "1 item"

anyplural(1500, { one: 'item', other: 'items' }, { locale: 'en' })
// "1,500 items"   — the count goes through Intl.NumberFormat

anyplural(2, { one: 'год', few: 'года', many: 'лет' }, { locale: 'ru' })
// "2 года"

anyplural(5, { one: 'plik', few: 'pliki', many: 'plików' }, { locale: 'pl' })
// "5 plików"`}</Code>
        <p>
          Throws <Mono>RangeError</Mono> if <Mono>count</Mono> is not a finite
          number, and also if the resolved category has no form and no{" "}
          <Mono>other</Mono> to fall back to.
        </p>
      </Section>

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anypluralParts</Mono> 
           — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anyplural, anypluralParts } from 'anyplural'
+ import { anyplural } from 'anyplural'

- anypluralParts(5, forms)
+ anyplural.parts(5, forms)`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="parts" title="anyplural.parts()">
        <p>
          Same arguments as <Mono>anyplural()</Mono>, but returns{" "}
          <Mono>{"{ type, value }"}</Mono> parts instead of a string — style the
          number apart from the word, or rebuild the output your own way.
        </p>
        <Code>{`import { anyplural } from 'anyplural'

anyplural.parts(5, { one: 'item', other: 'items' }, { locale: 'en' })
// [
//   { type: 'integer', value: '5' },
//   { type: 'literal', value: ' items' },
// ]

// React: bold the number
anyplural.parts(count, forms).map((p, i) =>
  p.type === 'integer' ? <b key={i}>{p.value}</b> : p.value,
)`}</Code>
        <p>
          Number parts come straight from{" "}
          <Mono>Intl.NumberFormat.formatToParts</Mono>, so a grouped count splits
          into <Mono>integer</Mono> / <Mono>group</Mono> / <Mono>integer</Mono>{" "}
          the same way it would there. The word is a single{" "}
          <Mono>literal</Mono>.
        </p>
      </Section>

      <Section id="forms" title="Forms">
        <p>
          <Mono>forms</Mono> is a plain object keyed by CLDR plural category.
          Supply <Mono>other</Mono> as the catch-all — it is the terminal
          fallback for every locale.
        </p>
        <Code>{`// English cardinal — two forms is enough
{ one: 'item', other: 'items' }

// Russian cardinal — never resolves to 'other' for integers
{ one: 'год', few: 'года', many: 'лет' }

// English ordinal — the suffix, not the word
{ one: 'st', two: 'nd', few: 'rd', other: 'th' }

// Japanese — one form covers everything
{ other: '個' }`}</Code>
        <p>
          A locale that can never reach a category may omit it — Russian cardinal
          integers never resolve to <Mono>other</Mono>, so the example above is
          complete. But a form that resolves to a missing category with no
          reachable fallback throws at runtime, so when in doubt include{" "}
          <Mono>other</Mono>.
        </p>
      </Section>

      <Section id="categories" title="Categories">
        <p>
          The six CLDR categories. Which ones a locale actually uses — and for
          which numbers — is <Mono>Intl.PluralRules</Mono>&apos; business, not
          yours.
        </p>
        <Rows>
          {CATEGORIES.map(([name, meaning, example]) => (
            <div
              key={name}
              className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-4"
            >
              <code
                style={{ color: "var(--doc-accent)", minWidth: "5rem" }}
                className="font-mono text-sm"
              >
                {name}
              </code>
              <span style={{ color: "var(--text-secondary)", minWidth: "15rem" }}>
                {meaning}
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
          The names are labels, not quantities. Russian resolves 21 and 31 to{" "}
          <Mono>one</Mono>, and 0 to <Mono>many</Mono>. Write forms per category,
          never per number.
        </p>
      </Section>

      <Section id="zero" title="The zero form">
        <p>
          <Mono>zero</Mono> gets one extra behaviour on top of the CLDR category:
          when the count is exactly 0 and a <Mono>zero</Mono> form is present,
          that form is the whole output — the number is dropped. It is the
          natural way to write an empty state.
        </p>
        <Code>{`anyplural(0, { zero: 'No messages', one: 'message', other: 'messages' }, { locale: 'en' })
// "No messages"        — not "0 No messages"

anyplural(0, { one: 'message', other: 'messages' }, { locale: 'en' })
// "0 messages"         — no zero form, so the count stays

anyplural(2, { zero: 'No messages', one: 'message', other: 'messages' }, { locale: 'en' })
// "2 messages"         — zero only applies at 0`}</Code>
        <p>
          <Mono>anyplural.parts</Mono> reports this as a single{" "}
          <Mono>literal</Mono> part, since there is no number to split out.
        </p>
        <p>
          This is separate from Arabic, where <Mono>zero</Mono> is a real CLDR
          category that <Mono>Intl.PluralRules</Mono> resolves on its own.
        </p>
      </Section>

      <Section id="options" title="Options">
        <Prop
          name="locale"
          type="string | string[]"
          def="runtime locale"
          desc="Any valid BCP 47 locale tag, or a fallback array — 'en', 'ru', 'pt-BR', ['sr-Latn-RS', 'en']. Decides both the plural rules and the number formatting."
        />
        <Prop
          name="type"
          type="'cardinal' | 'ordinal'"
          def="'cardinal'"
          desc="Cardinal counts how many ('5 items'); ordinal ranks ('3rd'). Mapped straight to Intl.PluralRules."
        />
        <Prop
          name="format"
          type="Intl.NumberFormatOptions"
          def="plain integer"
          desc="Any options accepted by Intl.NumberFormat, applied to the count — grouping, decimals, compact notation, currency."
        />
      </Section>

      <Section id="breaks" title="What breaks without this">
        <p>Every one of these is a ternary somebody shipped, and each is wrong somewhere.</p>
        <Cards
          items={[
            {
              title: "count === 1 ? 'item' : 'items'",
              body: "That is a rule about English, written as if it were a rule about counting. Russian needs three forms, Arabic six, Welsh six. The ternary does not fail loudly — it just writes bad grammar to everyone who is not reading English.",
            },
            {
              title: "Zero is not always the plural form",
              body: "English says \"0 items\", French treats 0 like 1, and several locales have a distinct zero category. Special-casing zero in the code is a fourth wrong answer.",
            },
            {
              title: "Ordinals follow different rules entirely",
              body: "1st, 2nd, 3rd, 4th is a separate rule set from one/other, and the two disagree even in English — the plural of 2 is \"other\", the ordinal of 2 is \"two\". A suffix table stops working at 11th, 12th, 13th.",
            },
            {
              title: "A fraction is not one",
              body: "\"1.5 items\", not \"1.5 item\": 1.5 selects other in English even though it is between one and two. Comparing against 1 with === gets that wrong, and comparing with ranges gets it wrong somewhere else.",
            },
          ]}
        />
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Item counter
anyplural(cart.length, { one: 'item', other: 'items' })
// "3 items"

// Localized "N years"
anyplural(age, { one: 'год', few: 'года', many: 'лет' }, { locale: 'ru' })
// "5 лет"

// Ranking / leaderboard position
anyplural(rank, { one: 'st', two: 'nd', few: 'rd', other: 'th' }, { type: 'ordinal' })
// "1st"

// Empty state — the zero form replaces the whole output, number included
anyplural(count, { zero: 'No messages', one: 'message', other: 'messages' })
// 0 → "No messages", 1 → "1 message", 9 → "9 messages"

// Big numbers, grouped
anyplural(inbox, { one: 'email', other: 'emails' }, { locale: 'en' })
// "12,480 emails" `}</Code>
      </Section>

      <Section id="react" title="React">
        <p>
          <Mono>anyfamily-react</Mono> exposes the same function as{" "}
          <Mono>useAnyplural</Mono>, reading the locale from a shared{" "}
          <Mono>AnyfamilyProvider</Mono> so you do not thread it through every
          call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnyplural } from 'anyfamily-react'

function Inbox({ count }: { count: number }) {
  return <p>{useAnyplural(count, { one: 'message', other: 'messages' })}</p>
}

<AnyfamilyProvider locale="ru">
  <Inbox count={5} />
</AnyfamilyProvider>`}</Code>
      </Section>
      <Section id="locales" title="Locales">
        <p>
          Same call, different rules — no locale files, no rule tables of your
          own.
        </p>
        <Code>{`const en = { one: 'item', other: 'items' }
anyplural(1, en, { locale: 'en' })   // "1 item"
anyplural(0, en, { locale: 'en' })   // "0 items"

const ru = { one: 'год', few: 'года', many: 'лет' }
anyplural(1, ru, { locale: 'ru' })   // "1 год"
anyplural(2, ru, { locale: 'ru' })   // "2 года"
anyplural(5, ru, { locale: 'ru' })   // "5 лет"
anyplural(21, ru, { locale: 'ru' })  // "21 год"   ← 'one', not 'many'

const pl = { one: 'plik', few: 'pliki', many: 'plików' }
anyplural(2, pl, { locale: 'pl' })   // "2 pliki"
anyplural(5, pl, { locale: 'pl' })   // "5 plików"

anyplural(1, { other: '個' }, { locale: 'ja' })   // "1 個"`}</Code>
        <p>
          The count is formatted in the same locale, so grouping separators and
          digits follow it too — <Mono>1,500</Mono> in English,{" "}
          <Mono>1 500</Mono> in Russian, Eastern Arabic numerals in{" "}
          <Mono>ar-EG</Mono>.
        </p>
        <Code>{`anyplural(1500, { other: 'items' }, { locale: 'en', format: { notation: 'compact' } })
// "1.5K items"

anyplural(1999, { one: 'euro', other: 'euros' }, {
  locale: 'en',
  format: { style: 'currency', currency: 'EUR' },
})
// "€1,999.00 euros"`}</Code>
      </Section>


      <Section id="ssr" title="SSR">
        <p>
          anyplural is pure and synchronous — no clock, no state — so server and
          client render identically. Pass an explicit <Mono>locale</Mono> to keep
          it that way regardless of the runtime default.
        </p>
        <Code>{`import { anyplural } from 'anyplural'

export function ResultCount({ n }: { n: number }) {
  return <p>{anyplural(n, { one: 'result', other: 'results' }, { locale: 'en' })}</p>
}`}</Code>
      </Section>

      <Section id="alternatives" title="vs the alternatives">
        <p>
          What you would otherwise reach for, and what changes if you do.
        </p>
        <CompareTable
          head={["anyplural", "i18next", "intl-messageformat"]}
          rows={[
            ["gzip", "< 1kb", "~14kb", "~30kb"],
            ["locale data bundled", "no", "yes", "yes"],
            ["plural rules", "native Intl", "tables", "native Intl"],
            ["dependencies", "0", "1+", "4+"],
          ]}
        />
        <p>anyplural is not an i18n framework — it does one thing. Reach for i18next or ICU MessageFormat when you need message catalogs, interpolation grammars or gender selects.</p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          anyplural uses <Mono>Intl.PluralRules</Mono> and{" "}
          <Mono>Intl.NumberFormat</Mono> — both available everywhere modern.
          Ordinal rules need <Mono>Intl.PluralRules</Mono> with{" "}
          <Mono>type: &apos;ordinal&apos;</Mono>, supported since the same
          releases.
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
