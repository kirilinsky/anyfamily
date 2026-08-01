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
  { id: "anyamount", label: "anyamount()" },
  { id: "migrating", label: "From 1.x" },
  { id: "parts", label: "anyamount.parts()" },
  { id: "symbol", label: "anyamount.symbol()" },
  { id: "modes", label: "Modes" },
  { id: "units", label: "units" },
  { id: "options", label: "Options" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "locales", label: "Locales" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const SMART_TABLE = [
  ["1234567", "1.2M"],
  ["10000", "10K"],
  ["9999", "9,999"],
  ["42", "42"],
  ["0.1234", "0.12"],
];

const COMPATIBILITY = [
  ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
  ["Chrome", "77+", ""],
  ["Firefox", "78+", ""],
  ["Safari", "14.1+", ""],
  ["Edge", "79+", ""],
  ["Vercel Edge Runtime", "✓", ""],
  ["Cloudflare Workers", "✓", ""],
  ["Deno", "✓", ""],
];

const LIMITATIONS = [
  {
    title: "No byte auto-scaling yet",
    body: "anyamount(3200000000, { mode: 'unit', unit: 'byte' }) will not pick GB for you — pass the unit you want. Automatic scaling is planned for a future minor.",
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
    title: "Deliberately small",
    body: "One function, three modes, on purpose. No percent mode, no ranges, no parsing. anyamount follows semver — the 1.x API is stable, new options arrive in minors, breaking changes only in majors.",
  },
];

function Reads({ children }: { children: string }) {
  return (
    <p style={{ color: "var(--text-muted)" }} className="mb-2 text-xs">
      reads: <code className="font-mono">{children}</code>
    </p>
  );
}

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyamount"
      nav={NAV}
      accentDark="#b493e6"
      accentLight="#6d28d9"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anyamount</strong> is
          a tiny number formatter built entirely on the native{" "}
          <Mono>Intl.NumberFormat</Mono> browser API. One function, one options
          object, three modes — plus a helper for bare currency symbols. The 1.x
          API is stable: new options arrive in minors, breaking changes only in
          majors.
        </p>
        <p>
          The browser already knows how to format numbers, money, and units in
          200+ languages. anyamount just makes that API pleasant to use.
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
        <p>
          Or take the whole family at once with <Mono>npm install anyfamily</Mono>
          .
        </p>
      </Section>

      <Section id="anyamount" title="anyamount()">
        <p>The single entry point. Pass a number, optionally pass options.</p>
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

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anyamountParts</Mono> 
          and the other extra exports — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anyamount, anyamountParts, anyamountSymbol } from 'anyamount'
+ import { anyamount } from 'anyamount'

- anyamountParts(1999, opts)
+ anyamount.parts(1999, opts)

- anyamountSymbol('USD')
+ anyamount.symbol('USD')`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="parts" title="anyamount.parts()">
        <p>
          Same arguments as <Mono>anyamount()</Mono>, but returns the{" "}
          <Mono>Intl.NumberFormat.formatToParts</Mono> output unchanged — style
          the number apart from the currency symbol or unit, or rebuild the
          output your own way.
        </p>
        <Code>{`import { anyamount } from 'anyamount'

anyamount.parts(1999, { mode: 'currency', currency: 'EUR', locale: 'en' })
// [
//   { type: 'currency', value: '€' },
//   { type: 'integer', value: '1' },
//   { type: 'group', value: ',' },
//   { type: 'integer', value: '999' },
//   { type: 'decimal', value: '.' },
//   { type: 'fraction', value: '00' },
// ]

// React: shrink the currency symbol
anyamount.parts(price, { mode: 'currency', currency: 'EUR' }).map((p, i) =>
  p.type === 'currency' ? <small key={i}>{p.value}</small> : p.value,
)`}</Code>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Note: part values keep the original Intl characters — the space between
          number and unit can be U+00A0 or U+202F (no-break spaces) depending on
          locale and ICU version.
        </p>
      </Section>

      <Section id="symbol" title="anyamount.symbol()">
        <p>
          Resolves an ISO 4217 code to its localized symbol, with no number
          attached — for labels, currency pickers, and input affixes, where the
          amount is rendered separately (or not at all).
        </p>
        <Code>{`import { anyamount } from 'anyamount'

anyamount.symbol('USD', { locale: 'en' })   // "$"
anyamount.symbol('EUR', { locale: 'en' })   // "€"
anyamount.symbol('GBP', { locale: 'en' })   // "£"
anyamount.symbol('JPY', { locale: 'ja' })   // "￥"
anyamount.symbol('RUB', { locale: 'ru' })   // "₽"

anyamount.symbol('USD', { locale: 'en', display: 'code' })   // "USD"
anyamount.symbol('USD', { locale: 'en', display: 'name' })   // "US dollars"`}</Code>
        <p>
          <Mono>display</Mono> defaults to <Mono>&apos;narrowSymbol&apos;</Mono>{" "}
          — the bare symbol, never the disambiguated <Mono>US$</Mono> some
          locales prefer. Codes with no symbol in the locale&apos;s data come
          back as the code itself.
        </p>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Note: a malformed code throws a RangeError straight from Intl —
          &apos;US&apos; is not a currency. Formatting a full amount? Stay in
          currency mode with currencyDisplay; this is the escape hatch for when
          there is no amount.
        </p>
      </Section>

      <Section id="modes" title="Modes">
        <p>
          The <Mono>mode</Mono> option picks the rendering strategy. Each mode
          reads only the options that apply to it — the rest are ignored.
        </p>

        <div>
          <h3
            style={{ color: "var(--text-primary)" }}
            className="mb-3 font-mono text-base"
          >
            smart (default)
          </h3>
          <p className="mb-3">
            Compact notation for big numbers, plain formatting for small ones.
            The cutoff is <Mono>|value| &gt;= 10000</Mono>.
          </p>
          <div
            style={{ borderColor: "var(--border)" }}
            className="mb-3 rounded-xl border p-4"
          >
            <div className="space-y-2 font-mono text-xs">
              {SMART_TABLE.map(([input, output]) => (
                <div key={input} className="flex gap-4">
                  <span style={{ color: "var(--text-muted)", minWidth: "7rem" }}>
                    {input}
                  </span>
                  <span style={{ color: "var(--emerald)" }}>
                    → &quot;{output}&quot;
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Reads>locale, style, digits</Reads>
        </div>

        <div>
          <h3
            style={{ color: "var(--text-primary)" }}
            className="mb-3 font-mono text-base"
          >
            currency
          </h3>
          <p className="mb-3">
            Money via the <Mono>Intl.NumberFormat</Mono> currency style.{" "}
            <Mono>currency</Mono> is required — any ISO 4217 code. Missing it
            throws a TypeError.
          </p>
          <Code>{`anyamount(1999, { mode: 'currency', currency: 'EUR', locale: 'en' })
// "€1,999.00"

anyamount(1999, { mode: 'currency', currency: 'RSD', locale: 'sr' })
// "1.999,00 RSD"

anyamount(1999, { mode: 'currency', currency: 'JPY', locale: 'ja' })
// "￥1,999"  — JPY has no minor unit, Intl knows

anyamount(1999.99, { mode: 'currency', currency: 'EUR', locale: 'en', digits: 0 })
// "€2,000"`}</Code>
          <p className="mb-3">
            <Mono>currencyDisplay</Mono> picks how the currency itself is
            spelled — symbol by default, opt into anything else.
          </p>
          <Code>{`anyamount(1999, { mode: 'currency', currency: 'USD', locale: 'en' })
// "$1,999.00"  — 'symbol' (default)

anyamount(1999, { mode: 'currency', currency: 'USD', locale: 'en-CA', currencyDisplay: 'narrowSymbol' })
// "$1,999.00"  — bare symbol, where the locale would print "US$"

anyamount(1999, { mode: 'currency', currency: 'USD', locale: 'en', currencyDisplay: 'code' })
// "USD 1,999.00"

anyamount(1999, { mode: 'currency', currency: 'USD', locale: 'en', currencyDisplay: 'name' })
// "1,999.00 US dollars"`}</Code>
          <Reads>locale, currency, currencyDisplay, digits</Reads>
        </div>

        <div>
          <h3
            style={{ color: "var(--text-primary)" }}
            className="mb-3 font-mono text-base"
          >
            unit
          </h3>
          <p className="mb-3">
            Measurements via the <Mono>Intl.NumberFormat</Mono> unit style.{" "}
            <Mono>unit</Mono> is required — any sanctioned identifier, including
            compound <Mono>-per-</Mono> pairs. Missing it throws a TypeError.
          </p>
          <Code>{`anyamount(3.2, { mode: 'unit', unit: 'gigabyte', locale: 'en' })
// "3.2 GB"

anyamount(120, { mode: 'unit', unit: 'kilometer-per-hour', locale: 'en' })
// "120 km/h"

anyamount(3.2, { mode: 'unit', unit: 'gigabyte', locale: 'en', style: 'long' })
// "3.2 gigabytes"

anyamount(5, { mode: 'unit', unit: 'kilometer', locale: 'en', style: 'narrow' })
// "5km"`}</Code>
          <Reads>locale, unit, style, digits</Reads>
        </div>
      </Section>

      <Section id="units" title="Units">
        <p>
          <Mono>Intl</Mono> supports a fixed, sanctioned list of unit identifiers
          (from ECMA-402), plus any <Mono>&lt;unit&gt;-per-&lt;unit&gt;</Mono>{" "}
          compound of them. anyamount ships the full list as a TypeScript union,
          so invalid units fail at compile time.
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
          name="currencyDisplay"
          type="'symbol' | 'narrowSymbol' | 'code' | 'name'"
          def="'symbol'"
          desc="Currency mode only. How the currency is spelled: '$1,999.00', 'USD 1,999.00', or '1,999.00 US dollars'. 'narrowSymbol' keeps the bare '$' where a locale would print 'US$'."
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
          desc="maximumFractionDigits — a ceiling, not a fixed width: trailing zeros are not padded on, so digits: 2 renders 2.5, not 2.50. Defaults: smart — 2 plain / 1 compact, unit — 2, currency — the currency's own (which it keeps as a minimum)."
        />
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Dashboard stat
anyamount(views, { locale: 'en' })
// "1.2M"

// …spelled out
anyamount(views, { locale: 'en', style: 'long' })
// "1.2 million"

// Price
anyamount(product.cents / 100, { mode: 'currency', currency: 'EUR', locale: 'de' })
// "1.999,00 €"

// Price with no cents
anyamount(total, { mode: 'currency', currency: 'EUR', digits: 0 })
// "€2,000"

// Storage meter
anyamount(file.gb, { mode: 'unit', unit: 'gigabyte' })
// "3.2 GB"

// Speed, compound unit
anyamount(120, { mode: 'unit', unit: 'kilometer-per-hour', locale: 'ru' })
// "120 км/ч"

// Currency affix inside an input, amount rendered separately
anyamount.symbol(account.currency)
// "$" `}</Code>
      </Section>

      <Section id="react" title="React / Next.js">
        <p>
          anyamount is pure and synchronous, so it works in a component as-is. What 
          <Mono>anyfamily-react</Mono> adds is a shared locale: set it once on 
          <Mono>AnyfamilyProvider</Mono> and every hook below picks it up, so you
          do not thread <Mono>locale</Mono> through every call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnyamount } from 'anyfamily-react'

function Price({ cents }: { cents: number }) {
  return <b>{useAnyamount(cents / 100, { mode: 'currency', currency: 'EUR' })}</b>
}

<AnyfamilyProvider locale="de">
  <Price cents={199900} />
</AnyfamilyProvider>`}</Code>
        <p>`useAnyamountSymbol` is there too, for the bare currency symbol.</p>
      </Section>


      <Section id="locales" title="Locales">
        <p>Same calls in a few languages — no extra setup, no locale files.</p>
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
        <p>
          Output is pure — no clock reads, no environment sniffing — so server
          and client render identically. SSR-safe by construction.
        </p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          anyamount uses <Mono>Intl.NumberFormat</Mono> with compact notation and
          unit support — widely available since 2020.
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
