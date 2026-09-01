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
  { id: "anylong", label: "anylong()" },
  { id: "migrating", label: "From 1.x" },
  { id: "inputs", label: "Inputs" },
  { id: "refusals", label: "What it refuses" },
  { id: "parts", label: "anylong.parts()" },
  { id: "styles", label: "styles" },
  { id: "clamping", label: "clamping" },
  { id: "options", label: "Options" },
  { id: "breaks", label: "What breaks" },
  { id: "recipes", label: "Recipes" },
  { id: "react", label: "React / Next.js" },
  { id: "locales", label: "Locales" },
  { id: "support", label: "Support flag" },
  { id: "alternatives", label: "Alternatives" },
  { id: "compatibility", label: "Compatibility" },
  { id: "limitations", label: "Limitations" },
];

const STYLES = [
  ["long", "spelled out", '"2 hours, 30 minutes"'],
  ["short", "abbreviated (default)", '"2 hr, 30 min"'],
  ["narrow", "as tight as the locale allows", '"2h 30m"'],
  ["digital", "clock-like", '"2:30:00"'],
];

const COMPATIBILITY = [
  ["Node.js", "23+", "the package itself supports 18+, the API does not"],
  ["Chrome", "129+", ""],
  ["Firefox", "141+", ""],
  ["Safari", "18.4+", ""],
  ["Deno", "✓", ""],
  ["Bun", "✓", ""],
];

const LIMITATIONS = [
  {
    title: "Intl.DurationFormat is the newest API in the family",
    body: "Baseline 2025, and notably missing on Node 22 and earlier — which is still a common CI and serverless default. Every anylong call throws there. Branch on the exported supported flag, or render the demo client-side only, if you target those runtimes.",
  },
  {
    title: "Records are not normalized",
    body: "A duration record you pass in comes back out exactly as given: { minutes: 120 } formats as '120 min', not '2 hr'. Only number and Date inputs get decomposed. That is Intl.DurationFormat's behaviour, kept rather than papered over.",
  },
  {
    title: "Shorthand is English-only in v1",
    body: "'2h 30m' and '2 hours 30 minutes' parse; localized shorthand does not. The output is localized in 200+ languages — the input syntax is not an i18n surface.",
  },
  {
    title: "Ambiguous input throws by design",
    body: "'1:30' could be 1h30m or 1m30s, so anylong refuses rather than guessing. Same for negatives and fractional shorthand. Every rejection names what it received and what it accepts.",
  },
];

export function DocsClient() {
  return (
    <DocsShell
      pkgId="anylong"
      nav={NAV}
      accentDark="#2cc2c9"
      accentLight="#0e7490"
    >
      <Section id="overview" title="Overview">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>anylong</strong> takes
          any reasonable representation of a duration — milliseconds, two{" "}
          <Mono>Date</Mono>s, an ISO 8601 string, human shorthand, or a duration
          record — and formats it as a localized string with native{" "}
          <Mono>Intl.DurationFormat</Mono>. Zero dependencies, no Temporal, no
          locale files.
        </p>
        <p>
          Input detection is fixed and deterministic. Where an input is genuinely
          ambiguous, anylong throws with a message naming what it got and what it
          accepts, rather than guessing.
        </p>
        <Code>{`import { anylong } from 'anylong'

anylong(9_000_000)                       // "2 hr, 30 min"
anylong("PT2H30M")                       // "2 hr, 30 min"
anylong("2h 30m", { style: "long" })     // "2 hours, 30 minutes"
anylong({ hours: 2, minutes: 30 }, { style: "digital" })  // "2:30:00"
anylong(startedAt, finishedAt)           // duration between two Dates
anylong("P1DT4H", { locale: "ru", style: "long" })        // "1 день 4 часа"`}</Code>
      </Section>

      <Section id="install" title="Install">
        <Code>{`npm install anylong
# or
pnpm add anylong
# or
yarn add anylong`}</Code>
        <p>
          Or take the whole family at once with <Mono>npm install anyfamily</Mono>
          , where the support flag is re-exported as{" "}
          <Mono>anylongSupported</Mono>.
        </p>
      </Section>

      <Section id="anylong" title="anylong()">
        <p>
          One function, two call shapes: a single duration, or two{" "}
          <Mono>Date</Mono>s to measure between.
        </p>
        <Code>{`anylong(input, options?)
anylong(dateA, dateB, options?)`}</Code>
        <p>
          The two-date form is order-independent and measures real elapsed time,
          so DST boundaries do not distort it.
        </p>
        <Code>{`anylong(startedAt, finishedAt)             // "1 day, 4 hr, 30 min"
anylong(finishedAt, startedAt)             // same
anylong(startedAt, finishedAt, { locale: "de" })`}</Code>
      </Section>

      <Section id="migrating" title="Migrating from 1.x">
        <p>
          2.0 removed the separate <Mono>anylongParts</Mono> 
          and the other extra exports — they are the
          same functions and values, reached through the one name the package
          exports.
        </p>
        <Code>{`- import { anylong, anylongParts, supported } from 'anylong'
+ import { anylong } from 'anylong'

- anylongParts('2h 30m')
+ anylong.parts('2h 30m')

- supported ? anylong(ms) : fallback
+ anylong.supported ? anylong(ms) : fallback`}</Code>
        <p>
          Arguments, return values and throwing behaviour are unchanged, and
          nothing else in the API moved. Every <Mono>any*</Mono> package follows
          this shape from 2.0 on: the bare call does the job, everything else
          hangs off the same name.
        </p>
      </Section>

      <Section id="inputs" title="Inputs">
        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            number — milliseconds (or seconds)
          </strong>
        </p>
        <p>
          Auto-decomposed into the largest sensible units, up to days. Zero units
          are skipped; smaller units appear only when non-zero.
        </p>
        <Code>{`anylong(0)                    // "0 sec"
anylong(450)                  // "450 ms"
anylong(3_600_000)            // "1 hr"
anylong(90_061_001)           // "1 day, 1 hr, 1 min, 1 sec, 1 ms"

anylong(90, { unit: "s" })    // "1 min, 30 sec"  — seconds in`}</Code>

        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            Date — distance from now
          </strong>
        </p>
        <p>Past or future, always the absolute value.</p>
        <Code>{`anylong(post.createdAt)   // "3 hr, 12 min"
anylong(deadline)         // works for future dates too`}</Code>

        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            string — ISO 8601 duration
          </strong>
        </p>
        <p>
          Case-insensitive, parsed with a small regex. Units are kept as given —{" "}
          <Mono>&quot;PT90M&quot;</Mono> stays <Mono>&quot;90 min&quot;</Mono>.
        </p>
        <Code>{`anylong("PT2H30M")   // "2 hr, 30 min"
anylong("P1DT4H")    // "1 day, 4 hr"
anylong("PT1.5S")    // "1 sec, 500 ms"`}</Code>

        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            string — human shorthand
          </strong>
        </p>
        <p>
          Case-insensitive, order-independent, English units in v1.{" "}
          <Mono>m</Mono> is minutes, <Mono>mo</Mono> is months. Repeated units
          are an error.
        </p>
        <Code>{`anylong("2h 30m")               // "2 hr, 30 min"
anylong("1d 4h 20s")            // "1 day, 4 hr, 20 sec"
anylong("90s")                  // "90 sec" — units kept as given
anylong("2 hours 30 minutes")   // "2 hr, 30 min"`}</Code>

        <p>
          <strong style={{ color: "var(--text-primary)" }}>
            object — Intl.DurationFormat record
          </strong>
        </p>
        <p>
          Passed through untouched. Accepted keys: <Mono>years</Mono>,{" "}
          <Mono>months</Mono>, <Mono>weeks</Mono>, <Mono>days</Mono>,{" "}
          <Mono>hours</Mono>, <Mono>minutes</Mono>, <Mono>seconds</Mono>,{" "}
          <Mono>milliseconds</Mono>, plus <Mono>microseconds</Mono> and{" "}
          <Mono>nanoseconds</Mono>. Unknown keys are an error. Records are not
          normalized — <Mono>{"{ minutes: 120 }"}</Mono> stays 120 minutes.
        </p>
        <Code>{`anylong({ hours: 2, minutes: 30 })
anylong({ years: 1, months: 2 }, { style: "long" })`}</Code>
      </Section>

      <Section id="refusals" title="What it refuses to guess">
        <p>
          Deterministic beats clever. Every rejection throws with what was
          received and what is accepted — that is a feature, not a gap.
        </p>
        <Code>{`anylong("1:30")
// ✗ ambiguous — hours:minutes or minutes:seconds?
//   Use "1h 30m", "PT1H30M", or { hours: 1, minutes: 30 }.

anylong(-5_000)          // ✗ negative — pass the absolute value or two Dates
anylong("1.5h")          // ✗ fractional shorthand — use "90m" or milliseconds
anylong("2h 3h")         // ✗ repeated unit
anylong(new Date("x"))   // ✗ invalid Date
anylong({ hourz: 2 })    // ✗ unknown key, accepted keys listed
anylong(NaN)             // ✗ with the full accepted-inputs list`}</Code>
      </Section>

      <Section id="parts" title="anylong.parts()">
        <p>
          Same arguments as <Mono>anylong()</Mono> — including the two-date form
          — but returns <Mono>{"{ type, value, unit? }"}</Mono> parts instead of
          a string. Style the numbers apart from the units, or rebuild the output
          your own way.
        </p>
        <Code>{`import { anylong } from 'anylong'

anylong.parts("2h 30m", { locale: "en" })
// [
//   { type: "integer", value: "2", unit: "hour" },
//   { type: "literal", value: " hr, " },
//   { type: "integer", value: "30", unit: "minute" },
//   ...
// ]

// React: bold the numbers
anylong.parts("2h 30m", { locale: "en" }).map((p, i) =>
  p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
)`}</Code>
        <p>
          Joining every part&apos;s <Mono>value</Mono> reproduces the full
          string.
        </p>
      </Section>

      <Section id="styles" title="Styles">
        <Rows>
          {STYLES.map(([value, meaning, example]) => (
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
        <Code>{`anylong("2h 30m", { style: "long" })      // "2 hours, 30 minutes"
anylong("2h 30m", { style: "short" })     // "2 hr, 30 min"       (default)
anylong("2h 30m", { style: "narrow" })    // "2h 30m"
anylong("2h 30m", { style: "digital" })   // "2:30:00"`}</Code>
      </Section>
      <Section id="clamping" title="Clamping units">
        <p>
          <Mono>largestUnit</Mono> and <Mono>smallestUnit</Mono> clamp the
          decomposition of elapsed time — number and <Mono>Date</Mono> inputs.
          Values are rounded at <Mono>smallestUnit</Mono>. Inputs that already
          carry units (ISO, shorthand, records) are passed through as-is and
          ignore both.
        </p>
        <Code>{`anylong(90_061_000, { largestUnit: "hours" })
// "25 hr, 1 min, 1 sec"        — no day rollup

anylong(30 * 86_400_000, { largestUnit: "weeks" })
// "4 wks, 2 days"

anylong(1_500, { smallestUnit: "seconds" })
// "2 sec"                      — never shows ms`}</Code>
      </Section>
      <Section id="options" title="Options">
        <Prop
          name="locale"
          type="string | string[]"
          def="runtime locale"
          desc="Any valid BCP 47 locale tag, or a fallback array — 'en', 'ru', 'pt-BR', ['sr-Latn-RS', 'en']."
        />
        <Prop
          name="style"
          type="'long' | 'short' | 'narrow' | 'digital'"
          def="'short'"
          desc="Overall output style. Applies to every input kind."
        />
        <Prop
          name="unit"
          type="'ms' | 's'"
          def="'ms'"
          desc="How to read a bare number input: milliseconds or seconds. Ignored for every other input kind."
        />
        <Prop
          name="largestUnit"
          type="'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'"
          def="'days'"
          desc="Largest unit produced when decomposing elapsed time. Number and Date inputs only — inputs that already carry units pass through as-is."
        />
        <Prop
          name="smallestUnit"
          type="'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'"
          def="'milliseconds'"
          desc="Smallest unit produced when decomposing elapsed time; the value is rounded here. Number and Date inputs only."
        />
        <Prop
          name="…rest"
          type="Intl.DurationFormatOptions"
          def="—"
          desc="Everything else — fractionalDigits, per-unit styles like hours: '2-digit', hoursDisplay: 'always', numberingSystem — goes straight to Intl.DurationFormat."
        />
        <Code>{`anylong({ minutes: 5 }, { hoursDisplay: "always", style: "digital" })
// "0:05:00"`}</Code>
      </Section>

      <Section id="breaks" title="What breaks without this">
        <p>Every one of these is what a hand-rolled duration formatter gets wrong.</p>
        <Cards
          items={[
            {
              title: "Division by 3600 and a template string",
              body: "\"2h 30m\" is Latin script, English abbreviations and a fixed separator, handed to every reader regardless of locale. The arithmetic is the easy half; the writing is the half that is wrong.",
            },
            {
              title: "Units do not inflect in English only",
              body: "Russian needs час, часа and часов depending on the number in front. A duration formatter that concatenates a number and a unit name is a plural bug in every language that has more than two forms.",
            },
            {
              title: "Zero components in the middle",
              body: "Naive assembly prints \"2 hr, 0 min, 30 sec\" — technically true, and something no one would say. Deciding which components to keep is part of the format, not a post-processing step.",
            },
            {
              title: "\"2:30:00\" is a separate problem",
              body: "The digital clock style is not the worded style with the units removed; it has its own padding and its own separator per locale. Both come from the same call here.",
            },
          ]}
        />
      </Section>

      <Section id="recipes" title="Recipes">
        <p>Copy, paste, move on.</p>
        <Code>{`// Video / track length
anylong(track.ms, { style: 'digital' })
// "3:42"

// Task duration in a log
anylong(job.startedAt, job.finishedAt, { style: 'long' })
// "1 day, 4 hours, 30 minutes"

// Time left until a deadline
anylong(deadline, { largestUnit: 'days' })
// "2 days, 6 hr"

// Cache TTL from seconds
anylong(ttl, { unit: 's', style: 'long' })
// "15 minutes"

// Compact badge
anylong('2h 30m', { style: 'narrow' })
// "2h 30m"

// Degrade gracefully where Intl.DurationFormat is missing
anylong.supported ? anylong(ms) : \`\${Math.round(ms / 60000)} min\``}</Code>
      </Section>

      <Section id="react" title="React / Next.js">
        <p>
          anylong is pure and synchronous, so it works in a component as-is. What 
          <Mono>anyfamily-react</Mono> adds is a shared locale: set it once on 
          <Mono>AnyfamilyProvider</Mono> and every hook below picks it up, so you
          do not thread <Mono>locale</Mono> through every call.
        </p>
        <Code>{`import { AnyfamilyProvider, useAnylong } from 'anyfamily-react'

function Duration({ ms }: { ms: number }) {
  return <span>{useAnylong(ms, { style: 'long' })}</span>
}

<AnyfamilyProvider locale="en">
  <Duration ms={job.elapsed} />
</AnyfamilyProvider>`}</Code>
        <p>`anylongSupported` is re-exported for the same feature detection anylong itself provides.</p>
      </Section>



      <Section id="locales" title="Locales">
        <p>
          Any BCP 47 tag, fallback arrays included. No locale files, no plugins —
          native <Mono>Intl</Mono> ships the data.
        </p>
        <Code>{`anylong("2h 30m", { locale: "ru", style: "long" })   // "2 часа 30 минут"
anylong("2h 30m", { locale: "de", style: "long" })   // "2 Stunden, 30 Minuten"
anylong("2h 30m", { locale: "ja" })                  // "2 時間 30 分"
anylong("2h 30m", { locale: ["sr-Latn-RS", "en"] })`}</Code>
      </Section>

      <Section id="support" title="Support flag">
        <p>
          <Mono>Intl.DurationFormat</Mono> is Baseline 2025 — the newest API the
          family builds on, and the one most likely to be missing. anylong throws
          a clear error at call time there; check the exported{" "}
          <Mono>supported</Mono> flag to degrade gracefully.
        </p>
        <Code>{`import { anylong } from 'anylong'

anylong.supported ? anylong(ms) : \`\${Math.round(ms / 60000)} min\``}</Code>
        <p>
          Through the <Mono>anyfamily</Mono> meta-package the flag is exported as{" "}
          <Mono>anylongSupported</Mono>, since <Mono>supported</Mono> collides
          with anyword&apos;s.
        </p>
      </Section>

      <Section id="alternatives" title="vs the alternatives">
        <p>
          What you would otherwise reach for, and what changes if you do.
        </p>
        <CompareTable
          head={["anylong", "humanize-duration", "pretty-ms"]}
          rows={[
            ["locale data bundled", "none (Intl)", "its own strings", "none, English only"],
            ["locales", "200+", "~80", "1"],
            ["accepts milliseconds", "yes", "yes", "yes"],
            ["accepts ISO 8601 / shorthand", "yes", "no", "no"],
            ["accepts two dates", "yes", "no", "no"],
            ["digital style (2:30:00)", "yes", "no", "no"],
          ]}
        />
        <p>anylong is 2.5kb gzipped and writes a duration down. It does not measure one, and it does not do calendar arithmetic — the months between two dates are a question for a date library, because their length depends on which months they are. Its one hard requirement is Intl.DurationFormat, so branch on anylong.supported.</p>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <p>
          Note the Node line: <Mono>Intl.DurationFormat</Mono> landed in Node 23,
          so anylong throws on Node 18–22 even though the package itself supports
          them. Server-render anything that calls it only where the API exists,
          or gate on <Mono>supported</Mono>.
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
