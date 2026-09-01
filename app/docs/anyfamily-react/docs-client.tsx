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
  { id: "provider", label: "Provider" },
  { id: "hooks", label: "Hooks" },
  { id: "locale", label: "Locale resolution" },
  { id: "ticking", label: "Ticking" },
  { id: "memoized", label: "Memoized hooks" },
  { id: "recipes", label: "Recipes" },
  { id: "ssr", label: "SSR & Next.js" },
  { id: "support", label: "Support flags" },
  { id: "types", label: "Types" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const HOOKS: [string, string, string][] = [
  [
    "useAnywhen",
    "(date, options?) => string",
    "anywhen as a hook, plus a tick that keeps relative output fresh. options.refresh controls the interval.",
  ],
  ["useAnyamount", "(value, options?) => string", "anyamount as a hook."],
  [
    "useAnyamountSymbol",
    "(currency, options?) => string",
    "anyamount.symbol — the bare currency symbol, for labels and input affixes where the amount renders separately.",
  ],
  ["useAnymany", "(items, options?) => string", "anymany as a hook."],
  ["useAnyaround", "(code, options?) => string", "anyaround as a hook."],
  ["useAnylong", "(input, options?) => string", "anylong as a hook."],
  [
    "useAnyplural",
    "(count, forms, options?) => string",
    "anyplural as a hook.",
  ],
  [
    "useAnyword",
    "(text, options?) => string[]",
    "anyword as a hook. Returns an array, memoized on the text and the options' contents.",
  ],
  ["useAnywordCount", "(text, options?) => number", "anyword.count as a hook."],
  [
    "useAnywordTruncate",
    "(text, limit, options?) => string",
    "anyword.truncate as a hook.",
  ],
  [
    "useAnylocale",
    "(tag?) => AnylocaleInfo",
    "anylocale as a hook. Takes the tag as its argument, not as an option; returns an object, memoized on the tag.",
  ],
  [
    "useAnyfamilyLocale",
    "() => Locale | undefined",
    "The locale from the nearest provider, for anything the hooks above do not cover.",
  ],
];

const LIMITATIONS = [
  {
    title: "Client components only",
    body: "The package is a client module — every export sits behind \"use client\". Hooks need state and effects, so a React Server Component cannot call them. Format on the server with the plain functions from anyfamily instead; they are the same code without the React layer.",
  },
  {
    title: "The provider is a context, not a store",
    body: "Changing its locale re-renders every hook underneath it, the same as any other context. Put it high in the tree and change it rarely — a locale that flips on every keystroke re-renders the subtree on every keystroke.",
  },
  {
    title: "The tick is a poll, not a scheduler",
    body: "useAnywhen re-renders on a fixed interval rather than on unit boundaries, so a transition like \"59 seconds ago\" to \"1 minute ago\" can lag up to one tick behind. Pass an explicit refresh where the alignment matters.",
  },
  {
    title: "It adds hooks, not behaviour",
    body: "Every formatting rule, option and edge case lives in the underlying package. When output looks wrong, the answer is in that package's reference — this layer only supplies the locale and re-renders.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anyfamily-react"
      backHref="/#anyfamily-react"
      nav={NAV}
      accentDark="#61dafb"
      accentLight="#0e7490"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            anyfamily-react
          </strong>{" "}
          is the whole any* family as React hooks: every formatter reachable
          through one shared locale, and relative time that stays fresh without
          hand-rolled <Mono>setInterval</Mono> plumbing.
        </p>
        <p>
          It adds no formatting of its own. Each hook is the package it is named
          after, wired to a context and — where it helps — to a tick or a memo.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnywhen, useAnyamount } from 'anyfamily-react'

function App() {
  return (
    <AnyfamilyProvider locale="en">
      <Post publishedAt={post.createdAt} price={1999} />
    </AnyfamilyProvider>
  )
}

function Post({ publishedAt, price }) {
  const when = useAnywhen(publishedAt, { mode: 'relative' })   // "3 hours ago", ticks itself
  const cost = useAnyamount(price, { mode: 'currency', currency: 'EUR' })
  return <p>{cost} — {when}</p>
}`}</Code>
        <p>
          Outside React, or in a server component, reach for{" "}
          <Mono>anyfamily</Mono> — the same eight packages behind plain
          functions.
        </p>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anyfamily-react
# or
pnpm add anyfamily-react
# or
yarn add anyfamily-react`}</Code>
        <p>
          React is a peer dependency (<Mono>^18 || ^19</Mono>); the eight any*
          packages come along as real dependencies, so there is nothing else to
          install. ESM and CJS builds with types.
        </p>
      </Section>

      <Section id="provider" title="AnyfamilyProvider">
        <p>
          Set the locale once, and every hook below it picks it up. The provider
          holds nothing else — it is a single context around a locale.
        </p>
        <Code>{`import { AnyfamilyProvider } from 'anyfamily-react'

<AnyfamilyProvider locale="de-DE">
  <App />
</AnyfamilyProvider>

// a fallback chain works too
<AnyfamilyProvider locale={['xx-Nope', 'de-DE']}>`}</Code>
        <p>
          It is optional. With no provider each hook falls through to its
          package&apos;s own default, which is whatever the runtime resolves —
          exactly what calling the function bare would do.
        </p>
        <p>
          Nesting works the way any context does: the nearest provider wins, so a
          subtree can run in another locale.
        </p>
        <Code>{`<AnyfamilyProvider locale="en">
  <Header />                       {/* en */}
  <AnyfamilyProvider locale="ja">
    <Preview />                    {/* ja */}
  </AnyfamilyProvider>
</AnyfamilyProvider>`}</Code>
      </Section>

      <Section id="hooks" title="Hooks">
        <p>
          One hook per function in the family. Arguments and options are the
          package&apos;s own — follow the link in each row&apos;s description to
          that package&apos;s reference for what the options do.
        </p>
        <Rows>
          {HOOKS.map(([name, type, desc]) => (
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
                  {type}
                </code>
              </div>
              <p style={{ color: "var(--text-muted)" }} className="text-sm">
                {desc}
              </p>
            </div>
          ))}
        </Rows>
        <Code>{`const price   = useAnyamount(1999, { mode: 'currency', currency: 'EUR' })
const symbol  = useAnyamountSymbol('EUR')
const authors = useAnymany(['Ada', 'Grace', 'Alan'])
const country = useAnyaround('DE', { display: 'flag-name' })
const took    = useAnylong({ minutes: 90 })
const label   = useAnyplural(count, { one: 'file', other: 'files' })
const words   = useAnyword(text)
const total   = useAnywordCount(text)
const teaser  = useAnywordTruncate(text, 140)
const info    = useAnylocale()`}</Code>
      </Section>

      <Section id="locale" title="Locale resolution">
        <p>Three levels, nearest first:</p>
        <Code>{`options.locale        // the hook's own — always wins
provider locale       // the nearest AnyfamilyProvider
runtime default       // whatever Intl resolves, when neither is set`}</Code>
        <p>
          The merge is deliberately narrow: the provider fills in{" "}
          <Mono>locale</Mono> only when the hook did not pass one. Every other
          option is yours alone — the provider carries no defaults for{" "}
          <Mono>mode</Mono>, <Mono>currency</Mono> or anything else.
        </p>
        <Code>{`<AnyfamilyProvider locale="de-DE">
  {/* de-DE, from the provider */}
  useAnyamount(1999, { mode: 'currency', currency: 'EUR' })

  {/* ja-JP — the hook's own locale wins */}
  useAnyamount(1999, { mode: 'currency', currency: 'JPY', locale: 'ja-JP' })
</AnyfamilyProvider>`}</Code>
        <p>
          <Mono>useAnylocale</Mono> is the one that differs, because{" "}
          <Mono>anylocale</Mono> takes its tag as an argument rather than as an
          option. With no argument it reads the provider, and with no provider it
          resolves the runtime&apos;s own locale.
        </p>
        <Code>{`useAnylocale()          // provider locale, else the runtime's
useAnylocale('fa-IR')   // explicit, ignores the provider`}</Code>
      </Section>

      <Section id="ticking" title="Ticking">
        <p>
          Relative output goes stale the instant a component stops re-rendering:
          &quot;3 minutes ago&quot; stays &quot;3 minutes ago&quot; for an hour.{" "}
          <Mono>useAnywhen</Mono> re-renders itself on an interval so it does
          not.
        </p>
        <Code>{`useAnywhen(date, { mode: 'relative' })                  // ticks every 60s
useAnywhen(date, { mode: 'relative', refresh: 10_000 }) // every 10s
useAnywhen(date, { mode: 'relative', refresh: false })  // never`}</Code>
        <p>The default tick is skipped where it could not change anything:</p>
        <div className="space-y-3">
          <div
            style={{ borderColor: "var(--border)" }}
            className="rounded-xl border p-4"
          >
            <p
              style={{ color: "var(--text-primary)" }}
              className="mb-1 text-sm font-medium"
            >
              In <Mono>&quot;absolute&quot;</Mono> mode
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              A formatted date does not move. No interval is set at all,
              whatever the mode was when the component mounted.
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
              Past a day old
            </p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              Output is in days or months by then, and a minute-granularity poll
              never changes it. A list of last year&apos;s posts sets no timers.
              An explicit refresh always does what it is told.
            </p>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          The tick is a fixed poll rather than a boundary-aligned schedule, so a
          transition such as &quot;59 seconds ago&quot; to &quot;1 minute
          ago&quot; can lag up to one interval behind. Pass a smaller{" "}
          <Mono>refresh</Mono> where that shows.
        </p>
      </Section>

      <Section id="memoized" title="Memoized hooks">
        <p>
          Most hooks return a string, so referential stability is a non-question.
          The two that do not — <Mono>useAnyword</Mono> (an array) and{" "}
          <Mono>useAnylocale</Mono> (an object) — are memoized, and keep their
          reference until the input actually changes.
        </p>
        <Code>{`const words = useAnyword(text)

useEffect(() => {
  // runs when the segments change, not on every render
}, [words])`}</Code>
        <p>
          The memo is keyed on the options&apos; <em>contents</em>, not their
          identity, so an inline option object — a fresh reference every render —
          does not defeat it.
        </p>
        <Code>{`// safe: same contents, same memoized array
const words = useAnyword(text, { by: 'word' })`}</Code>
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// One locale for the app, from the route
<AnyfamilyProvider locale={params.locale}>
  <App />
</AnyfamilyProvider>

// A comment timestamp that stays honest
const posted = useAnywhen(comment.createdAt, { mode: 'relative' })

// Price and symbol rendered apart
const amount = useAnyamount(cents / 100, { mode: 'currency', currency })
const sign   = useAnyamountSymbol(currency)

// A live character counter that counts what people see
const left = 280 - useAnywordCount(draft, { by: 'grapheme' })

// A teaser that never cuts a word — or an emoji — in half
const teaser = useAnywordTruncate(post.body, 140)

// Direction and week layout from the provider's locale
const { direction, weekStart } = useAnylocale()

// The locale itself, for something the hooks do not cover
const locale = useAnyfamilyLocale()`}</Code>
      </Section>

      <Section id="ssr" title="SSR & Next.js">
        <p>
          The package is a client module: every export is behind{" "}
          <Mono>&quot;use client&quot;</Mono>. Hooks hold state and set effects,
          so a Server Component cannot call them — put the provider in a client
          boundary and let server components render underneath it as children.
        </p>
        <Code>{`// app/providers.tsx
'use client'
import { AnyfamilyProvider } from 'anyfamily-react'

export function Providers({ locale, children }) {
  return <AnyfamilyProvider locale={locale}>{children}</AnyfamilyProvider>
}

// app/[locale]/layout.tsx — a server component
import { Providers } from '../providers'

export default function Layout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body><Providers locale={locale}>{children}</Providers></body>
    </html>
  )
}`}</Code>
        <p>
          To format on the server, skip this package and call the functions
          directly — <Mono>anyfamily</Mono> is the same eight packages without
          the React layer.
        </p>
        <p>
          Two hydration rules, both about determinism rather than about React.
          Pass the locale <strong style={{ color: "var(--text-primary)" }}>
          explicitly</strong> — a hook that falls through to the runtime resolves
          the server&apos;s locale on the server and the browser&apos;s in the
          client, which is a mismatch by construction. And relative time is a
          clock read: the first client render happens later than the server one,
          so render an absolute date on the server, or accept that the first tick
          settles it.
        </p>
        <Code>{`// Deterministic: the tag comes from the route, not from the environment
<AnyfamilyProvider locale={params.locale}>`}</Code>
      </Section>

      <Section id="support" title="Support flags">
        <p>
          Three of the underlying APIs are newer than the rest, so their packages
          carry a support flag. It is re-exported here, letting you
          feature-detect without importing the package alongside.
        </p>
        <Code>{`import {
  anylongSupported,
  anywordSupported,
  anylocaleSupported,
} from 'anyfamily-react'

// Intl.DurationFormat, Intl.Segmenter, Intl Locale Info respectively`}</Code>
        <p>
          These are plain values read at import time, not hooks — call them
          anywhere, including outside a component. Where a flag is{" "}
          <Mono>false</Mono>, the matching hook throws exactly as its function
          would, so branch before rendering it.
        </p>
        <Code>{`function Counter({ text }) {
  const total = useAnywordCount(text)      // needs Intl.Segmenter
  return <span>{total}</span>
}

function SafeCounter({ text }) {
  // Branch around the component, never around the hook call — hooks must run
  // in the same order on every render.
  if (!anywordSupported) return <span>{text.length}</span>
  return <Counter text={text} />
}`}</Code>
      </Section>

      <Section id="types" title="Types">
        <p>
          Every option type from the eight packages is re-exported, so a typed
          wrapper needs one import rather than nine.
        </p>
        <Code>{`import type {
  Locale,
  AnywhenOptions, DateInput,
  AnyamountOptions, AnyamountSymbolOptions,
  AnymanyOptions,
  AnyaroundOptions,
  AnylongOptions, DurationInput,
  AnypluralOptions, Forms,
  AnywordOptions, AnywordTruncateOptions, Granularity,
  AnylocaleInfo, Direction, Weekday,
} from 'anyfamily-react'`}</Code>
        <p>
          <Mono>UseAnywhenOptions</Mono> is the one type this package adds:{" "}
          <Mono>AnywhenOptions</Mono> plus <Mono>refresh</Mono>.
        </p>
        <Code>{`import type { UseAnywhenOptions } from 'anyfamily-react'

function Timestamp({ at, ...rest }: { at: DateInput } & UseAnywhenOptions) {
  return <time>{useAnywhen(at, rest)}</time>
}`}</Code>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          React 18 or 19, as a peer dependency. Nothing exotic is used —
          context, state, effect and memo, all of them present since hooks
          shipped.
        </p>
        <p>
          The formatting underneath is native <Mono>Intl</Mono>, so browser
          support is
          whatever the underlying package says. Three of them may be missing on
          an older runtime — see{" "}
          <Mono>anylongSupported</Mono>, <Mono>anywordSupported</Mono> and{" "}
          <Mono>anylocaleSupported</Mono> above; the other five have been
          everywhere for years.
        </p>
        <p>
          The package tracks the family&apos;s versions: a release bumps it in
          step with the eight, so <Mono>anyfamily-react</Mono> and{" "}
          <Mono>anyfamily</Mono> at the same version wrap the same code.
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
