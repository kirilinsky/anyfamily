"use client";

import {
  Code,
  DocsShell,
  Mono,
  Rows,
  Section,
  type DocsNavItem,
} from "@/components/docs-shell";

const NAV: DocsNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Install" },
  { id: "anylocale", label: "anylocale()" },
  { id: "fields", label: "Fields" },
  { id: "week", label: "Week & weekend" },
  { id: "surprises", label: "What breaks" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "ssr", label: "SSR" },
  { id: "locales", label: "Locales" },
  { id: "support", label: "Support flag" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const FIELDS: [string, string, string][] = [
  ["tag", "string", "the canonical tag that was resolved — \"en-us\" → \"en-US\""],
  ["direction", '"ltr" | "rtl"', "text direction of the locale's script"],
  ["weekStart", "1–7", "first day of the week, ISO numbering"],
  ["weekend", "number[]", "days counted as the weekend, ISO numbering"],
  ["minimalDays", "number", "days of a week that must fall in a year for it to be that year's first week"],
  ["calendars", "string[]", "usable calendars, preferred first"],
  ["timeZones", "string[]", "IANA zones for the region; empty for language-only tags"],
  ["hourCycles", "string[]", '"h12", "h23", … preferred first'],
  ["numberingSystems", "string[]", '"latn", "arab", … preferred first'],
];

const SURPRISES = [
  {
    title: "Same language, different week",
    body: "en-US starts the week on Sunday, en-GB on Monday. A table keyed on language is wrong for half the English-speaking world — the region subtag is what decides.",
  },
  {
    title: "The weekend is not always a pair",
    body: "fa-IR has a one-day weekend: Friday. Code that destructures two days, or assumes weekend.length === 2, breaks on it.",
  },
  {
    title: "RTL does not imply Arabic digits",
    body: "he-IL is right-to-left and uses Latin numerals; ar-EG is right-to-left and uses Arabic-Indic ones. Direction and numbering system are independent.",
  },
  {
    title: "Language does not decide the clock either",
    body: "en-US is a 12-hour locale, en-GB a 24-hour one. Same language again.",
  },
  {
    title: "ISO numbering is not getDay()",
    body: "weekStart and weekend are ISO: 1 is Monday, 7 is Sunday. Date.prototype.getDay() returns 0 for Sunday. Convert with iso % 7 before comparing.",
  },
];

const LIMITATIONS = [
  {
    title: "It reads, it does not format",
    body: "anylocale hands you facts. Turning a code into a readable name — \"US\" into \"United States\" — is anyaround's job, and formatting a date with them is anywhen's.",
  },
  {
    title: "Values track the runtime's CLDR",
    body: "Everything here comes from the ICU data your engine ships. Exact calendar and time-zone lists can shift between versions, so test behaviour rather than exact arrays.",
  },
  {
    title: "Time zones need a region",
    body: "A language-only tag has no region to look up, so timeZones is empty for \"en\" and populated for \"en-GB\". That is the data, not a bug.",
  },
  {
    title: "Support is uneven and moving",
    body: "The proposal was standardised twice — properties first, then methods — and engines are split. anylocale reads either shape, but where neither exists it throws. Branch on anylocale.supported.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anylocale"
      nav={NAV}
      accentDark="#8497f5"
      accentLight="#4338ca"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anylocale</strong>{" "}
          reads what native <Mono>Intl</Mono> knows about how a locale{" "}
          <em>behaves</em> — text direction, the first day of its week, which
          days are the weekend, which calendars and time zones it uses, whether
          it counts hours to 12 or 24, and which digits it writes with.
        </p>
        <p>
          Everyone hardcodes this and everyone gets it wrong. Your runtime
          already ships the correct table for 200+ locales; anylocale is the thin
          reader. One export, no data files, no config.
        </p>
        <Code>{`import { anylocale } from 'anylocale'

anylocale('ar-EG').direction   // "rtl"
anylocale('en-GB').weekStart   // 1 — Monday
anylocale('en-US').weekStart   // 7 — Sunday, same language
anylocale('fa-IR').weekend     // [5] — Friday only
anylocale('ar-EG').timeZones   // ["Africa/Cairo"]`}</Code>
        <p>
          This is the behaviour side of a locale. For the naming side — what a
          code is <em>called</em> in a given language — reach for{" "}
          <Mono>anyaround</Mono> instead.
        </p>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anylocale
# or
pnpm add anylocale
# or
yarn add anylocale`}</Code>
        <p>
          Zero dependencies, ~1kb gzipped, ESM and CJS builds with types. Or take
          the whole family at once with <Mono>npm install anyfamily</Mono>.
        </p>
      </Section>

      <Section id="anylocale" title="anylocale()">
        <p>
          The single entry point. Pass a BCP 47 tag, or an array used as a
          fallback chain.
        </p>
        <Code>{`anylocale(tag)
anylocale([tag, fallback])

anylocale('pt-BR')                    // the record
anylocale(['xx-Nope', 'de-DE']).tag   // "de-DE"`}</Code>
        <p>
          Fields are computed on access, so reading <Mono>direction</Mono> never
          asks the runtime for calendars or time zones. They are still plain own
          enumerable properties, so spreading and{" "}
          <Mono>JSON.stringify</Mono> behave exactly as you would expect.
        </p>
        <Code>{`const { direction, weekStart } = anylocale(navigator.language)

JSON.stringify(anylocale('en-US'))
// {"tag":"en-US","direction":"ltr","weekStart":7,…}`}</Code>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Throws <Mono>TypeError</Mono> on an empty fallback chain,{" "}
          <Mono>RangeError</Mono> when no tag is well-formed BCP 47, and a plain{" "}
          <Mono>Error</Mono> when the runtime has no Intl Locale Info at all.
        </p>
      </Section>

      <Section id="fields" title="Fields">
        <Rows>
          {FIELDS.map(([name, type, desc]) => (
            <div key={name} className="flex flex-col gap-1 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <code
                  style={{ color: "var(--doc-accent)" }}
                  className="font-mono text-sm"
                >
                  {name}
                </code>
                <code style={{ color: "var(--sky)" }} className="font-mono text-xs">
                  {type}
                </code>
              </div>
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                {desc}
              </p>
            </div>
          ))}
        </Rows>
        <p>
          There are no options — the tag is the whole input. Everything a locale
          can tell you is on the record.
        </p>
      </Section>

      <Section id="week" title="Week & weekend">
        <p>
          <Mono>weekStart</Mono> and <Mono>weekend</Mono> use{" "}
          <strong style={{ color: "var(--text-primary)" }}>ISO numbering</strong>
          : 1 is Monday, 7 is Sunday. That is CLDR&apos;s convention, and it is{" "}
          <em>not</em> JavaScript&apos;s — <Mono>Date.prototype.getDay()</Mono>{" "}
          returns 0 for Sunday.
        </p>
        <Code>{`const iso = anylocale('en-US').weekStart   // 7
const js  = iso % 7                        // 0 — what getDay() would say`}</Code>
        <p>
          To lay out a calendar, rotate the week so it opens on the locale&apos;s
          first day:
        </p>
        <Code>{`const { weekStart, weekend } = anylocale(locale)

const days = Array.from({ length: 7 }, (_, i) => ((weekStart - 1 + i) % 7) + 1)
// en-US -> [7, 1, 2, 3, 4, 5, 6]   Sunday first
// en-GB -> [1, 2, 3, 4, 5, 6, 7]   Monday first
// ar-EG -> [6, 7, 1, 2, 3, 4, 5]   Saturday first

const isWeekend = new Set(weekend)
days.map((d) => ({ day: d, weekend: isWeekend.has(d) }))`}</Code>
        <p>
          <Mono>minimalDays</Mono> is the ISO-8601 week-numbering rule: how many
          days of a week must fall inside a year for that week to count as the
          year&apos;s first. Most locales say 1; a few say 4.
        </p>
      </Section>

      <Section id="surprises" title="What breaks without this">
        <p>
          Every one of these is a real assumption people encode by hand, and each
          is wrong somewhere.
        </p>
        <div className="space-y-3">
          {SURPRISES.map(({ title, body }) => (
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

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Set document direction without a hand-kept RTL language list
document.documentElement.dir = anylocale(userLocale).direction

// …or in a React tree
<html lang={locale} dir={anylocale(locale).direction}>

// Order the columns of a date picker
const start = anylocale(locale).weekStart
const days = Array.from({ length: 7 }, (_, i) => ((start - 1 + i) % 7) + 1)

// Highlight weekend cells — not always Saturday and Sunday
const weekend = new Set(anylocale(locale).weekend)
const isWeekend = (isoDay) => weekend.has(isoDay)

// 12- or 24-hour clock, per the locale rather than per the language
const use12h = anylocale(locale).hourCycles[0] === 'h12'

// Offer the calendar the region actually uses
anylocale('fa-IR').calendars[0]   // "persian"
anylocale('th-TH').calendars[0]   // "buddhist"

// Suggest a default time zone from the user's locale
anylocale('ar-EG').timeZones[0]   // "Africa/Cairo"

// Degrade gracefully where the API is missing
const dir = anylocale.supported ? anylocale(locale).direction : 'ltr'`}</Code>
      </Section>

      <Section id="react" title="React / Next.js">
        <p>
          The most common use is the document direction. Read it once, high in
          the tree, and let the rest of the app inherit it.
        </p>
        <Code>{`import { anylocale } from 'anylocale'

export default function RootLayout({ children, params: { locale } }) {
  const dir = anylocale.supported ? anylocale(locale).direction : 'ltr'
  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  )
}`}</Code>
        <p>
          <Mono>anyfamily-react</Mono> exposes the same reader as{" "}
          <Mono>useAnylocale</Mono>, taking the locale from the shared{" "}
          <Mono>AnyfamilyProvider</Mono> when you do not pass one.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnylocale } from 'anyfamily-react'

function WeekHeader() {
  const { weekStart, weekend } = useAnylocale()
  // …
}

<AnyfamilyProvider locale="ar-EG">
  <WeekHeader />
</AnyfamilyProvider>`}</Code>
      </Section>

      <Section id="ssr" title="SSR">
        <p>
          anylocale is pure and synchronous — no clock, no state, no DOM — so
          server and client render identically for the same tag.
        </p>
        <p>
          One caveat that is about the runtime rather than the package: server
          and browser can ship different ICU builds, and support itself differs
          between them. Pass an explicit tag rather than reading the ambient
          locale, and if you branch on <Mono>anylocale.supported</Mono>, do it in
          a place where a mismatch cannot cause a hydration difference — or gate
          the branch behind an effect.
        </p>
        <Code>{`// Deterministic: the tag comes from the route, not from the environment
export default function Layout({ params: { locale } }) {
  return <html lang={locale} dir={anylocale(locale).direction}>…</html>
}`}</Code>
      </Section>

      <Section id="locales" title="Locales">
        <p>
          Any valid BCP 47 tag. A fallback chain resolves to the first tag the
          runtime has <strong style={{ color: "var(--text-primary)" }}>data</strong>{" "}
          for, not merely the first that parses — <Mono>&quot;xx-Nope&quot;</Mono>{" "}
          is well-formed BCP 47 and would otherwise win.
        </p>
        <Code>{`anylocale('pt-BR').tag                 // "pt-BR"
anylocale('en-us').tag                 // "en-US"  — canonicalised
anylocale(['xx-Nope', 'de-DE']).tag    // "de-DE"
anylocale(['zz-Fake']).tag             // "zz-Fake" — nothing has data`}</Code>
        <p>
          When no tag in the chain has data, the first well-formed one is used
          and the runtime answers with its own defaults. That beats throwing:
          you still get a usable direction and week.
        </p>
      </Section>

      <Section id="support" title="Support flag">
        <p>
          <Mono>anylocale.supported</Mono> is <Mono>true</Mono> when the runtime
          exposes Intl Locale Info in either shape. Where it is{" "}
          <Mono>false</Mono>, every call throws — so branch on it rather than on
          a version table.
        </p>
        <Code>{`import { anylocale } from 'anylocale'

const dir = anylocale.supported ? anylocale(tag).direction : 'ltr'`}</Code>
        <p>
          Through the <Mono>anyfamily</Mono> meta-package the flag is reached the
          same way — <Mono>anylocale.supported</Mono> — since every package now
          carries its own.
        </p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          Intl Locale Info reached Stage 4 (ES2026), but it was standardised{" "}
          <strong style={{ color: "var(--text-primary)" }}>twice</strong>: first
          as properties (<Mono>locale.weekInfo</Mono>), then as methods (
          <Mono>locale.getWeekInfo()</Mono>). Engines are split — Node 22 ships
          only the properties.
        </p>
        <p>
          anylocale reads whichever shape it finds, so you never write{" "}
          <Mono>loc.getWeekInfo?.() ?? loc.weekInfo</Mono> yourself. Because
          support is uneven and still moving, the package deliberately ships no
          version table: <strong style={{ color: "var(--text-primary)" }}>
          feature-detect</strong> with <Mono>anylocale.supported</Mono>.
        </p>
        <p>
          The package itself runs anywhere Node 18+ runs; the <em>data</em> is
          what may be absent. CI runs the suite on Node 20, 22 and 24, skipping
          the data-dependent tests wherever the API is missing.
        </p>
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
