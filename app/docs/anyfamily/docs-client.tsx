"use client";

import Link from "next/link";

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
  { id: "exports", label: "Exports" },
  { id: "shape", label: "One shape" },
  { id: "bundle", label: "Bundle cost" },
  { id: "choosing", label: "Which to install" },
  { id: "versioning", label: "Versioning" },
  { id: "support", label: "Support flags" },
  { id: "types", label: "Types" },
  { id: "limitations", label: "Limitations" },
];

type Export = {
  /** The single exported name — also the package it comes from. */
  name: string;
  /** What the bare call takes and returns. */
  signature: string;
  /** The native Intl API underneath. */
  intl: string;
  /** One line on the job. The reference link carries the detail. */
  job: string;
  /** Everything hanging off the name, `.parts` included. */
  extras: string[];
};

const EXPORTS: Export[] = [
  {
    name: "anywhen",
    signature: "(date, options?) => string",
    intl: "Intl.DateTimeFormat",
    job: "Dates and times — relative when near, calendar labels for recent days, absolute when far.",
    extras: ["parts"],
  },
  {
    name: "anyamount",
    signature: "(value, options?) => string",
    intl: "Intl.NumberFormat",
    job: "Numbers, currency and units, compact by default.",
    extras: ["parts", "symbol"],
  },
  {
    name: "anymany",
    signature: "(items, options?) => string",
    intl: "Intl.ListFormat (+ Collator)",
    job: "An array into a sentence, joined and sorted the way the locale does it.",
    extras: ["parts"],
  },
  {
    name: "anyaround",
    signature: "(code, options?) => string",
    intl: "Intl.DisplayNames",
    job: "Region, language, script, currency and calendar codes into readable names — plus the flag Intl leaves out.",
    extras: ["info"],
  },
  {
    name: "anylong",
    signature: "(input, options?) => string",
    intl: "Intl.DurationFormat",
    job: "Durations, from milliseconds, ISO 8601, shorthand, a record or two dates.",
    extras: ["parts", "supported"],
  },
  {
    name: "anyplural",
    signature: "(count, forms, options?) => string",
    intl: "Intl.PluralRules",
    job: "Cardinal and ordinal plurals, including the locales with six forms.",
    extras: ["parts"],
  },
  {
    name: "anyword",
    signature: "(text, options?) => string[]",
    intl: "Intl.Segmenter",
    job: "Words, graphemes and sentences — counted and cut the way people see them.",
    extras: ["parts", "count", "truncate", "supported"],
  },
  {
    name: "anylocale",
    signature: "(tag?) => AnylocaleInfo",
    intl: "Intl.Locale info",
    job: "How a locale behaves: direction, week start, weekend, calendars, zones, hour cycle, digits.",
    extras: ["supported"],
  },
];

const CHOICES = [
  {
    title: "anyfamily",
    body: "You want more than two of them, or you do not yet know which. One dependency line, one version to track, and the bundler drops what you never import. The default answer.",
  },
  {
    title: "The individual packages",
    body: "You want exactly one or two, and you would rather see them by name in package.json. Identical code and identical bundle — the meta is a re-export, not a wrapper.",
  },
  {
    title: "anyfamily-react",
    body: "You are in React and want the locale set once for the whole tree, relative time that refreshes itself, and stable references for the hooks that return objects. It depends on all eight, so it replaces anyfamily rather than joining it.",
  },
];

const LIMITATIONS = [
  {
    title: "It adds no behaviour",
    body: "Every formatting rule, option and edge case lives in the package the name comes from. When output looks wrong, the answer is in that package's reference — this layer only forwards.",
  },
  {
    title: "One extra name to keep current",
    body: "A caret range means core fixes reach you without a meta release, but a brand-new export needs the meta republished before you can import it from here. Reach for the package directly if you need something the day it ships.",
  },
  {
    title: "Eight packages still land in node_modules",
    body: "Tree-shaking is about what reaches your bundle, not about what npm installs. On disk the meta costs the same as installing all eight, because that is what it does.",
  },
  {
    title: "No React here",
    body: "These are plain functions, safe in a server component, a script or a worker. Hooks, the shared locale provider and the self-ticking relative time live in anyfamily-react.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyfamily"
      backHref="/#anyfamily"
      nav={NAV}
      accentDark="#7dd3fc"
      accentLight="#0369a1"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anyfamily</strong> is
          the whole any* family in one install: eight micro <Mono>Intl</Mono>{" "}
          tools behind a single import.
        </p>
        <p>
          It has no API of its own. The published module is a re-export — under
          half a kilobyte of ESM that forwards eight names and their types.
          Every option, every default and every edge case belongs to the package
          the name came from, so this page is a map rather than a reference:
          each row below links to the real one.
        </p>
        <Code>{`import { anywhen, anyamount, anyword } from 'anyfamily'

anywhen(post.createdAt, { mode: 'relative' })   // "3 hours ago"
anyamount(1999, { mode: 'currency', currency: 'EUR' })  // "€1,999.00"
anyword.count('世界 test')                       // 2`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anyfamily
# or
pnpm add anyfamily
# or
yarn add anyfamily`}</Code>
        <p>
          Node 18+, ESM and CJS builds with types for both. The eight packages
          come along as dependencies; none of them depends on anything else.
        </p>
      </Section>

      <Section id="exports" title="Exports">
        <p>
          Eight names, one per package. The bare call does the job; the extras
          hang off the same name. Follow a row for its options, its modes and
          its edge cases.
        </p>
        <Rows>
          {EXPORTS.map(({ name, signature, intl, job, extras }) => (
            <div key={name} className="flex flex-col gap-1 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <code
                  style={{ color: "var(--doc-accent)" }}
                  className="font-mono text-sm"
                >
                  {name}
                </code>
                <code
                  style={{ color: "var(--sky)" }}
                  className="font-mono text-xs"
                >
                  {signature}
                </code>
                <Link
                  href={`/docs/${name}`}
                  style={{ color: "var(--text-muted)" }}
                  className="ml-auto font-mono text-xs underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-70"
                >
                  reference →
                </Link>
              </div>
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                {job}
              </p>
              <p
                style={{ color: "var(--text-muted)" }}
                className="font-mono text-xs"
              >
                {extras.map((e) => `${name}.${e}`).join(" · ")}
                <span className="opacity-60"> — over {intl}</span>
              </p>
            </div>
          ))}
        </Rows>
        <p>
          <Mono>.parts</Mono> means the same thing everywhere: the formatted
          output as an array of typed pieces, for when you need to style the
          currency symbol apart from the digits, or the unit apart from the
          number.
        </p>
      </Section>

      <Section id="shape" title="One shape everywhere">
        <p>
          The eight are written to one convention, which is most of what makes
          them worth installing together. Learn one and the next is already
          familiar.
        </p>
        <Code>{`anywhen(date)                 // the string — the bare call is the job
anywhen.parts(date)           // the pieces, when you need to style them
anyword.count(text)           // the extras hang off the same name
anyword.truncate(text, 20)
anyamount.symbol('USD')
anylong.supported             // a flag, same rule`}</Code>
        <p>
          Three rules hold across all of them: one exported name per package;
          the locale is always an option called <Mono>locale</Mono>, taking a
          tag or a fallback chain; and nothing reads ambient state you did not
          pass, so the same arguments give the same output on a server and in a
          browser.
        </p>
        <Code>{`anywhen(date,  { locale: 'de-DE' })
anymany(items, { locale: ['xx-Nope', 'de-DE'] })   // fallback chain
anyplural(n, forms, { locale: 'ru' })`}</Code>
        <p>
          <Mono>anylocale</Mono> is the one exception, and deliberately: it{" "}
          <em>answers questions about</em> a locale rather than formatting in
          one, so the tag is its argument instead of an option.
        </p>
      </Section>

      <Section id="bundle" title="Bundle cost">
        <p>
          The usual worry about a meta-package: does installing eight ship
          eight? Through a bundler, no.
        </p>
        <p>
          The ESM build is a flat list of re-exports and the package sets{" "}
          <Mono>sideEffects: false</Mono>, so an import you never use has no
          reference left to keep it alive and the bundler drops it. Importing{" "}
          <Mono>anywhen</Mono> from <Mono>anyfamily</Mono> costs exactly what
          importing it from <Mono>anywhen</Mono> costs.
        </p>
        <Code>{`// what the published ESM build is, in full
import { anywhen } from 'anywhen'
import { anyamount } from 'anyamount'
// …six more
export { anywhen, anyamount, /* …six more */ }`}</Code>
        <p>Two honest caveats, both worth knowing before you rely on it:</p>
        <div className="space-y-3">
          <div
            style={{ borderColor: "var(--border)" }}
            className="rounded-xl border p-4"
          >
            <p
              style={{ color: "var(--text-primary)" }}
              className="mb-1 text-sm font-medium"
            >
              <Mono>require()</Mono> loads all eight
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              The CJS build calls <Mono>require</Mono> for every package at
              module scope — that is what CJS is. Nothing is tree-shaken, so on
              a CJS path requiring the meta for one formatter loads the other
              seven. Harmless in a server process, wasteful in a bundle: import
              the package directly, or use the ESM build.
            </p>
          </div>
          <div
            style={{ borderColor: "var(--border)" }}
            className="rounded-xl border p-4"
          >
            <p
              style={{ color: "var(--text-primary)" }}
              className="mb-1 text-sm font-medium"
            >
              Shaking is per package, not per extra
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              A package&apos;s extras are properties on its one exported
              function, so importing anyword brings count, truncate and parts
              along even if you only segment. That is true of the package on its
              own as well — the meta adds nothing to it, and the packages are
              small enough that it has never been worth splitting.
            </p>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          None of this touches disk: <Mono>node_modules</Mono> holds all eight
          either way. Tree-shaking is about what reaches the browser.
        </p>
      </Section>

      <Section id="choosing" title="Which one to install">
        <p>Three ways in, same code behind all of them.</p>
        <div className="space-y-3">
          {CHOICES.map(({ title, body }) => (
            <div
              key={title}
              style={{ borderColor: "var(--border)" }}
              className="rounded-xl border p-4"
            >
              <p
                style={{ color: "var(--text-primary)" }}
                className="mb-1 font-mono text-sm"
              >
                {title}
              </p>
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                {body}
              </p>
            </div>
          ))}
        </div>
        <p>
          Switching is a find-and-replace on the import line — the names and
          signatures are identical either way, and mixing the two is fine as
          long as the versions agree.
        </p>
        <Code>{`- import { anywhen } from 'anywhen'
- import { anyamount } from 'anyamount'
+ import { anywhen, anyamount } from 'anyfamily'`}</Code>
      </Section>

      <Section id="versioning" title="Versioning">
        <p>
          The meta carries its own version and depends on the eight by{" "}
          <strong style={{ color: "var(--text-primary)" }}>caret range</strong>,
          not by exact pin.
        </p>
        <Code>{`"dependencies": {
  "anywhen":   "^2.0.1",
  "anyamount": "^2.0.1",
  …
  "anylocale": "^1.0.1"
}`}</Code>
        <p>
          So the meta&apos;s number does not track the packages&apos; numbers,
          and it does not need to. A fix or a feature released in{" "}
          <Mono>anywhen</Mono> reaches you on your next install without anything
          happening here — the caret already covers it. The meta is republished
          for its own reasons: a new export to forward, a new type, a major that
          moves a range.
        </p>
        <p>
          Every package in the family is released together through changesets,
          leaves before metas, so a published meta never points at a version
          that is not on npm yet.
        </p>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          The one number that <em>is</em> paired: <Mono>anyfamily</Mono> and{" "}
          <Mono>anyfamily-react</Mono> move together, so the same version of
          each wraps the same set of packages.
        </p>
      </Section>

      <Section id="support" title="Support flags">
        <p>
          Five of the eight rest on <Mono>Intl</Mono> APIs that have been
          everywhere for years. Three are newer and can be missing on an older
          runtime, so they carry a flag — feature-detect with it rather than
          with a version table.
        </p>
        <Code>{`import { anylong, anyword, anylocale } from 'anyfamily'

anylong.supported     // Intl.DurationFormat
anyword.supported     // Intl.Segmenter
anylocale.supported   // Intl Locale Info

const elapsed = anylong.supported ? anylong(ms) : \`\${Math.round(ms / 1000)}s\``}</Code>
        <p>
          Where a flag is <Mono>false</Mono>, calling that package throws. The
          other five need no flag and have none — asking for{" "}
          <Mono>anywhen.supported</Mono> gets you <Mono>undefined</Mono>, not a
          warning.
        </p>
      </Section>

      <Section id="types" title="Types">
        <p>
          Every option and result type from the eight is re-exported, so a typed
          wrapper needs one import instead of eight.
        </p>
        <Code>{`import type {
  Locale,
  AnywhenOptions, DateInput, Thresholds,
  AnyamountOptions, Unit, SingleUnit,
  AnymanyOptions, Sort,
  AnyaroundOptions, AnyaroundInfo, Display,
  AnylongOptions, DurationInput, DurationRecord,
  AnypluralOptions, Forms, PluralCategory,
  AnywordOptions, AnywordTruncateOptions, Granularity,
  AnylocaleInfo, Direction, Weekday,
} from 'anyfamily'`}</Code>
        <p>
          Names that repeat across packages are prefixed here, since they cannot
          all be <Mono>Mode</Mono>. The rule is mechanical — the package name in
          front, the original after.
        </p>
        <Code>{`Mode           -> AnywhenMode, AnyamountMode, AnyaroundMode
Style          -> AnywhenStyle, AnyamountStyle, AnyaroundStyle
SmartOptions   -> AnyamountSmartOptions, AnyaroundSmartOptions
CurrencyOptions-> AnyamountCurrencyOptions, AnyaroundCurrencyOptions`}</Code>
        <p>
          <Mono>Locale</Mono> is exported once, unprefixed: a tag or a fallback
          chain, structurally identical in all eight.
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
