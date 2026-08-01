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
  { id: "anyaround", label: "anyaround()" },
  { id: "migrating", label: "From 1.x" },
  { id: "info", label: "anyaround.info()" },
  { id: "modes", label: "Modes" },
  { id: "flags", label: "flags" },
  { id: "options", label: "Options" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "locales", label: "Locales" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const COMPATIBILITY = [
  ["Node.js", "18+"],
  ["Chrome", "81+"],
  ["Firefox", "86+"],
  ["Safari", "14.1+"],
  ["Edge Runtime", "✓"],
  ["Cloudflare Workers", "✓"],
  ["Deno", "✓"],
];

const LIMITATIONS = [
  ["No cities", "Intl has no city display names. Regions and countries only."],
  [
    "Names track ICU",
    "Exact strings come from the runtime's ICU version — don't snapshot across environments.",
  ],
  ["No reverse lookup", "Code → name only; name → code is not provided."],
  [
    "Flags are alpha-2 only",
    "Numeric regions and non-region kinds have no flag.",
  ],
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyaround"
      nav={NAV}
      accentDark="#be2740"
      accentLight="#9f1239"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anyaround</strong>{" "}
          turns a region, language, script, currency, or calendar code into its
          localized name — and, for countries, an emoji flag. One function over
          native <Mono>Intl.DisplayNames</Mono>, zero dependencies.
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
          <Mono>Intl.DisplayNames</Mono> (Node 18+, modern browsers). Or take the
          whole family at once with <Mono>npm install anyfamily</Mono>.
        </p>
      </Section>

      <Section id="anyaround" title="anyaround()">
        <p>
          <code style={{ color: "var(--sky)" }} className="font-mono">
            anyaround(code, options?) → string
          </code>
        </p>
        <p>
          Resolves a code to a ready-to-render string. In the default{" "}
          <Mono>smart</Mono> mode the kind is inferred from the code&apos;s
          shape.
        </p>
        <Code>{`anyaround("FR");                     // "France"
anyaround("fr");                     // "French"
anyaround("419");                    // "Latin America and the Caribbean"
anyaround("Latn");                   // "Latin"
anyaround("JPY");                    // "Japanese Yen"
anyaround("DE", { display: "flag" }); // "🇩🇪"`}</Code>
        <p>
          Throws <Mono>TypeError</Mono> on an empty code and{" "}
          <Mono>RangeError</Mono> on an unknown mode.
        </p>
      </Section>

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anyaroundInfo</Mono> 
           — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anyaround, anyaroundInfo } from 'anyaround'
+ import { anyaround } from 'anyaround'

- anyaroundInfo('US')
+ anyaround.info('US')`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="info" title="anyaround.info()">
        <p>
          <code style={{ color: "var(--sky)" }} className="font-mono">
            anyaround.info(code, options?) →{" "}
            {"{ code, type, name, flag, found }"}
          </code>
        </p>
        <p>
          Same arguments, structured result — build your own output or drive a{" "}
          <Mono>&lt;select&gt;</Mono>.
        </p>
        <Code>{`anyaround.info("US", { locale: "en" });
// { code: "US", type: "region", name: "United States", flag: "🇺🇸", found: true }

anyaround.info("en", { locale: "fr" });
// { code: "en", type: "language", name: "anglais", flag: "", found: true }

anyaround.info("QZ", { mode: "region" });
// { code: "QZ", type: "region", name: "QZ", flag: "🇶🇿", found: false }`}</Code>
        <p>
          <Mono>flag</Mono> is <Mono>&quot;&quot;</Mono> whenever the code is not
          a flag-bearing alpha-2 region. <Mono>found</Mono> is{" "}
          <Mono>false</Mono> when <Mono>Intl</Mono> had no name —{" "}
          <Mono>name</Mono> is then the code or <Mono>&quot;&quot;</Mono>, so you
          can tell a hit from a miss.
        </p>
      </Section>

      <Section id="modes" title="Modes">
        <p>
          The <Mono>mode</Mono> option picks how a code is read. Default is{" "}
          <Mono>&quot;smart&quot;</Mono>.
        </p>
        <p style={{ color: "var(--text-primary)" }}>smart — auto-detect by shape</p>
        <Code>{`three digits            → region    "419"
four letters            → script    "Latn"
two uppercase letters   → region    "US"
three uppercase letters → currency  "USD"
anything else           → language  "en", "zh-Hant"`}</Code>
        <p>
          Case is the tiebreaker: <Mono>&quot;IT&quot;</Mono> is a region,{" "}
          <Mono>&quot;it&quot;</Mono> a language. Pin ambiguous codes with{" "}
          <Mono>mode</Mono>. <Mono>calendar</Mono> is never auto-detected.
        </p>
        <p style={{ color: "var(--text-primary)" }}>
          region / language / script / currency / calendar
        </p>
        <Code>{`anyaround("DE", { mode: "region", display: "flag-name" }); // "🇩🇪 Germany"
anyaround("en-US", { mode: "language" });                 // "American English"
anyaround("Cyrl", { mode: "script" });                    // "Cyrillic"
anyaround("EUR", { mode: "currency" });                   // "Euro"
anyaround("gregory", { mode: "calendar" });               // "Gregorian Calendar"`}</Code>
      </Section>

      <Section id="flags" title="Flags">
        <p>
          Flags are derived from a two-letter region code by mapping each letter
          to its Unicode Regional Indicator Symbol — no image assets, no lookup
          table.
        </p>
        <Code>{`anyaround("US", { display: "flag" });      // "🇺🇸"
anyaround("US", { display: "flag-name" }); // "🇺🇸 United States"
anyaround("US", { display: "name-flag" }); // "United States 🇺🇸"`}</Code>
        <p>
          Numeric M49 regions (<Mono>&quot;419&quot;</Mono>) and non-region kinds
          have no flag, so flag <Mono>display</Mono> values fall back to the
          name.
        </p>
      </Section>
      <Section id="options" title="Options">
        <Prop
          name="mode"
          type={`"smart" | "region" | "language" | "script" | "currency" | "calendar"`}
          def={`"smart"`}
          desc="How the code is interpreted."
        />
        <Prop
          name="locale"
          type="string | string[]"
          def="runtime locale"
          desc="BCP 47 tag (or fallback list) for the resolved name."
        />
        <Prop
          name="style"
          type={`"long" | "short" | "narrow"`}
          def={`"long"`}
          desc="Name verbosity, forwarded to Intl.DisplayNames."
        />
        <Prop
          name="display"
          type={`"name" | "flag" | "flag-name" | "name-flag"`}
          def={`"name"`}
          desc="Output shape for flag-bearing regions. Only in smart / region mode."
        />
        <Prop
          name="fallback"
          type={`"code" | "none"`}
          def={`"code"`}
          desc={`On a miss, name becomes the code ("code") or "" ("none"). Either way found is false.`}
        />
        <Prop
          name="languageDisplay"
          type={`"dialect" | "standard"`}
          def={`"dialect"`}
          desc={`Dialect ("American English") vs standard ("English (United States)"). Only in language mode.`}
        />
        <p className="pt-2">
          The options type is a discriminated union on <Mono>mode</Mono> —
          TypeScript only offers <Mono>display</Mono> in smart / region mode and{" "}
          <Mono>languageDisplay</Mono> in language mode.
        </p>
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Country picker with flags
countries.map((cc) => {
  const { code, name, flag } = anyaround.info(cc)
  return <option key={code} value={code}>{flag} {name}</option>
})

// Language switcher, each language in its own tongue
anyaround('de', { mode: 'language', locale: 'de' })   // "Deutsch"
anyaround('ja', { mode: 'language', locale: 'ja' })   // "日本語"

// Profile location
anyaround(user.country, { display: 'flag-name', locale: 'en' })
// "🇩🇪 Germany"

// Currency label next to an amount
anyaround(order.currency, { mode: 'currency', locale: 'en' })
// "Euro"

// Flag only, for a compact table cell
anyaround(row.country, { display: 'flag' })
// "🇺🇸" `}</Code>
      </Section>

      <Section id="react" title="React / Next.js">
        <p>
          anyaround is pure and synchronous, so it works in a component as-is. What 
          <Mono>anyfamily-react</Mono> adds is a shared locale: set it once on 
          <Mono>AnyfamilyProvider</Mono> and every hook below picks it up, so you
          do not thread <Mono>locale</Mono> through every call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnyaround } from 'anyfamily-react'

function Country({ code }: { code: string }) {
  return <span>{useAnyaround(code, { display: 'flag-name' })}</span>
}

<AnyfamilyProvider locale="en">
  <Country code={user.country} />
</AnyfamilyProvider>`}</Code>
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
          Output is pure — no <Mono>Date.now()</Mono>, no environment reads — so
          server and client render identically. SSR-safe by construction.
        </p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <Rows>
          {COMPATIBILITY.map(([env, ver]) => (
            <div
              key={env}
              className="flex items-center justify-between px-4 py-2 font-mono text-[13px]"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{env}</span>
              <span style={{ color: "var(--emerald)" }}>{ver}</span>
            </div>
          ))}
        </Rows>
        <p>
          <Mono>Intl.DisplayNames</Mono> is required (widely available since
          2021). CI runs on Node 20, 22, and 24.
        </p>
      </Section>

      <Section id="limitations" title="Limitations">
        <div className="grid gap-3 sm:grid-cols-2">
          {LIMITATIONS.map(([title, body]) => (
            <div
              key={title}
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-secondary)",
              }}
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
    </DocsShell>
  );
}
