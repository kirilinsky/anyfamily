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
  { id: "anywhen", label: "anywhen()" },
  { id: "parts", label: "anywhenParts()" },
  { id: "modes", label: "Modes" },
  { id: "options", label: "Options" },
  { id: "thresholds", label: "Thresholds" },
  { id: "ssr", label: "SSR" },
  { id: "input-types", label: "Input types" },
  { id: "locales", label: "Locales" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const SMART_TABLE = [
  ["< 45s", "now"],
  ["< 1 hour", "10 minutes ago / in 10 minutes"],
  ["same day", "today, 14:35"],
  ["yesterday", "yesterday, 09:00"],
  ["tomorrow", "tomorrow, 09:00"],
  ["within 7 days", "Wednesday, 11:20"],
  ["older / further", "Feb 5, 2016"],
];

const COMPATIBILITY = [
  ["Node.js", "18+", "CI runs the suite on Node 20, 22, 24"],
  ["Chrome", "71+", ""],
  ["Firefox", "65+", ""],
  ["Safari", "14+", ""],
  ["Edge", "79+", ""],
  ["Vercel Edge Runtime", "✓", ""],
  ["Cloudflare Workers", "✓", ""],
  ["Deno", "✓", ""],
];

const LIMITATIONS = [
  {
    title: "Output depends on the runtime's Intl data",
    body: "anywhen delegates all formatting to native Intl. Exact output — punctuation, spacing, abbreviated month names — may vary between Node versions, browsers, and OSes. Don't hardcode expected strings in tests; use pattern matching instead.",
  },
  {
    title: "No custom format strings",
    body: "Absolute mode accepts Intl.DateTimeFormat options, so you control the pieces. But if you need 'DD/MM/YYYY' with literal slashes — use a formatting library with explicit pattern strings instead.",
  },
  {
    title: "Smart calendar cutoff is fixed at 7 days",
    body: "Unit cutoffs (seconds → minutes → hours…) are configurable via the thresholds option since 1.0. The calendar switch from weekday ('Wednesday, 11:20') to absolute date still happens at 7 days and is not configurable.",
  },
  {
    title: "Node.js < 18",
    body: "The package declares engines.node >= 18 and CI tests Node 20/22/24. Older versions down to 13 will usually work — the required Intl APIs are there — but they are unsupported and untested.",
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
      pkgId="anywhen"
      nav={NAV}
      accentDark="#f5b66b"
      accentLight="#b45309"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anywhen</strong> is a
          tiny date formatter built entirely on the native <Mono>Intl</Mono>{" "}
          browser API. One function, one options object, three modes. Stable
          since 1.0 — the public API follows semver.
        </p>
        <p>
          The browser already knows how to format dates in 200+ languages.
          anywhen just makes that API pleasant to use.
        </p>
        <Code>{`import { anywhen } from 'anywhen'

anywhen(date)
// "yesterday, 2:35 PM"  — smart mode (default)

anywhen(date, { mode: 'absolute', locale: 'en' })
// "Feb 5, 2016"

anywhen(date, { mode: 'relative', locale: 'en' })
// "3 hours ago"`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anywhen
# or
pnpm add anywhen
# or
yarn add anywhen`}</Code>
        <p>
          Or take the whole family at once with <Mono>npm install anyfamily</Mono>
          .
        </p>
      </Section>

      <Section id="anywhen" title="anywhen()">
        <p>The single entry point. Pass a date, optionally pass options.</p>
        <Code>{`anywhen(input)
anywhen(input, options?)

anywhen(date)
// runtime locale, smart mode

anywhen(date, { locale: 'en' })
// "yesterday, 2:35 PM"

anywhen(date, { mode: 'relative', locale: 'en', numeric: true })
// "1 day ago"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
})
// "Friday, February 5, 2016"`}</Code>
      </Section>

      <Section id="parts" title="anywhenParts()">
        <p>
          Same arguments as <Mono>anywhen()</Mono>, but returns the output as{" "}
          <Mono>{"{ type, value, unit? }"}</Mono> parts instead of a string —
          style the number apart from the unit, or rebuild the output your own
          way. New in 1.0.
        </p>
        <Code>{`import { anywhenParts } from 'anywhen'

anywhenParts(date, { mode: 'relative', locale: 'en' })
// [
//   { type: 'integer', value: '3', unit: 'hour' },
//   { type: 'literal', value: ' hours ago' },
// ]

// React: bold the number
anywhenParts(date, { mode: 'relative' }).map((p, i) =>
  p.type === 'integer' ? <b key={i}>{p.value}</b> : p.value,
)`}</Code>
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Note: part values keep the original Intl characters — the space before
          AM/PM can be U+202F (narrow no-break space), which some engines replace
          with a regular space in the joined string.
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
            Context-aware. Picks the most readable format based on distance from
            now — covers past and future.
          </p>
          <div
            style={{ borderColor: "var(--border)" }}
            className="mb-3 rounded-xl border p-4"
          >
            <div className="space-y-2 font-mono text-xs">
              {SMART_TABLE.map(([when, output]) => (
                <div key={when} className="flex gap-4">
                  <span style={{ color: "var(--text-muted)", minWidth: "7rem" }}>
                    {when}
                  </span>
                  <span style={{ color: "var(--emerald)" }}>
                    → &quot;{output}&quot;
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Reads>locale, now, time, timeZone, style, thresholds</Reads>
        </div>

        <div>
          <h3
            style={{ color: "var(--text-primary)" }}
            className="mb-3 font-mono text-base"
          >
            absolute
          </h3>
          <p className="mb-3">
            Plain date formatting via <Mono>Intl.DateTimeFormat</Mono>. Pass{" "}
            <Mono>format</Mono> to control the output shape.
          </p>
          <Code>{`anywhen(date, { mode: 'absolute', locale: 'en' })
// "Feb 5, 2016"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { hour: '2-digit', minute: '2-digit' },
})
// "2:35 PM"

anywhen(date, {
  mode: 'absolute',
  locale: 'en',
  format: { month: 'long', year: 'numeric' },
  timeZone: 'Europe/Belgrade',
})
// "February 2016"`}</Code>
          <Reads>locale, format, timeZone</Reads>
        </div>

        <div>
          <h3
            style={{ color: "var(--text-primary)" }}
            className="mb-3 font-mono text-base"
          >
            relative
          </h3>
          <p className="mb-3">
            Always relative. Past and future. Never falls back to an absolute
            date.
          </p>
          <Code>{`anywhen(date, { mode: 'relative', locale: 'en' })
// "3 hours ago"
// "yesterday"
// "in 2 weeks"

anywhen(date, { mode: 'relative', locale: 'en', numeric: true })
// "1 day ago"   — disables auto-phrases
// "1 week ago"

anywhen(date, { mode: 'relative', locale: 'en', style: 'short' })
// "3 hr. ago"

anywhen(date, { mode: 'relative', locale: 'en', style: 'narrow' })
// "3h ago"`}</Code>
          <Reads>locale, now, numeric, style, thresholds</Reads>
        </div>
      </Section>

      <Section id="options" title="Options">
        <Prop
          name="mode"
          type="'smart' | 'absolute' | 'relative'"
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
          name="now"
          type="Date | number | string"
          def="current time"
          desc="Reference time for smart and relative modes. Pass this in SSR to keep server and client output stable."
        />
        <Prop
          name="timeZone"
          type="string"
          def="runtime timezone"
          desc="IANA time zone for the displayed clock and smart day boundaries (today, yesterday, weekday). Used by smart and absolute modes."
        />
        <Prop
          name="time"
          type="boolean"
          def="true"
          desc="Smart mode only. Whether to include clock time in today/yesterday/weekday output."
        />
        <Prop
          name="numeric"
          type="boolean"
          def="false"
          desc="Relative mode only. Force numeric output — disables auto-phrases like 'yesterday' or 'last week'."
        />
        <Prop
          name="style"
          type="'long' | 'short' | 'narrow'"
          def="'long'"
          desc="Smart and relative modes. Maps to Intl.RelativeTimeFormat and shortens the relative phrasing — '10 min. ago', '3h ago'. Calendar labels keep their clock."
        />
        <Prop
          name="format"
          type="Intl.DateTimeFormatOptions"
          def="{ day, month, year }"
          desc="Absolute mode only. Any options accepted by Intl.DateTimeFormat. Defaults to a short date."
        />
        <Prop
          name="thresholds"
          type="Partial<Record<unit, number>>"
          def="built-in table"
          desc="Smart and relative modes. Per-unit cutoffs (in seconds) for picking the display unit. Override any subset; the rest keep their defaults."
        />
      </Section>

      <Section id="thresholds" title="Thresholds">
        <p>
          Each unit is shown while the distance from <Mono>now</Mono> is below
          its cutoff, in seconds. Defaults:{" "}
          <Mono>
            second: 45, minute: 2700, hour: 79200, day: 518400, week: 2160000,
            month: 28512000
          </Mono>
          . New in 1.0.
        </p>
        <Code>{`anywhen(date, { mode: 'relative', locale: 'en', thresholds: { minute: 5400 } })
// 50 minutes ago → "50 minutes ago" instead of "1 hour ago"

anywhen(date, { locale: 'en', thresholds: { second: 120 } })
// smart mode: "now" covers the first 2 minutes`}</Code>
        <p>
          In smart mode <Mono>thresholds.second</Mono> widens the
          &quot;now&quot; window and <Mono>thresholds.minute</Mono> the sub-hour
          minutes window, symmetrically in both directions. Calendar labels
          (today, yesterday, tomorrow, weekday) are not affected.
        </p>
      </Section>

      <Section id="ssr" title="SSR">
        <p>
          By default, smart and relative modes use the current time. In React SSR
          or Next.js, pass a stable <Mono>now</Mono> value to avoid hydration
          drift.
        </p>
        <Code>{`import { anywhen } from 'anywhen'

export function PostMeta({ createdAt, requestTime }: {
  createdAt: string
  requestTime: string
}) {
  return (
    <time dateTime={createdAt}>
      {anywhen(createdAt, {
        locale: 'en',
        now: requestTime,
        timeZone: 'Europe/Belgrade',
      })}
    </time>
  )
}`}</Code>
        <p>
          <Mono>timeZone</Mono> controls both the displayed clock and the smart
          calendar boundaries for today, yesterday, and weekday output.
        </p>
        <p>
          In React, <Mono>anyfamily-react</Mono>&apos;s <Mono>useAnywhen</Mono>{" "}
          also keeps relative output from going stale — it re-renders on an
          interval so &quot;3 minutes ago&quot; stays true.
        </p>
      </Section>

      <Section id="input-types" title="Input types">
        <p>All inputs accept three formats interchangeably.</p>
        <Code>{`// Date object
anywhen(new Date())

// Unix timestamp (milliseconds)
anywhen(Date.now())
anywhen(1704499200000)

// ISO string
anywhen('2016-02-05T14:00:00Z')
anywhen('2016-02-05')`}</Code>
      </Section>

      <Section id="locales" title="Locales">
        <p>Same calls in a few languages — no extra setup, no locale files.</p>
        <Code>{`// smart mode
anywhen(date, { locale: 'de' })   // "gestern, 14:35"
anywhen(date, { locale: 'ru' })   // "вчера, 14:35"
anywhen(date, { locale: 'fr' })   // "hier, 14:35"

// absolute mode
anywhen(date, { mode: 'absolute', locale: 'ja' })   // "2016年2月5日"
anywhen(date, { mode: 'absolute', locale: 'ar' })   // "٥ فبراير ٢٠١٦"
anywhen(date, { mode: 'absolute', locale: 'ru' })   // "5 февр. 2016 г."

// relative mode
anywhen(date, { mode: 'relative', locale: 'de' })   // "vor 3 Stunden"
anywhen(date, { mode: 'relative', locale: 'fr' })   // "il y a 3 heures"
anywhen(date, { mode: 'relative', locale: 'tr' })   // "3 saat önce"`}</Code>
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

      <Section id="compatibility" title="Compatibility">
        <p>
          anywhen uses <Mono>Intl.RelativeTimeFormat</Mono> and{" "}
          <Mono>Intl.DateTimeFormat</Mono> — both widely supported.
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
