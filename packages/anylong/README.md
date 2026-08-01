<p align="center">
  <img src="./logo.png" alt="anylong" width="420" />
</p>

<h1 align="center">anylong</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anylong"><img src="https://img.shields.io/npm/v/anylong?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anylong"><img src="https://img.shields.io/bundlephobia/minzip/anylong?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anylong?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Any duration in, localized string out.</strong>
  <br />
  A micro wrapper around native <code>Intl.DurationFormat</code> — one export, zero data files, any locale.
</p>

<p align="center">
  <a href="https://anyfamily.site/anylong">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anylong">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Any reasonable input. Any locale. ~2.5kb gzip. Zero dependencies.**

Throw a number, a `Date`, two `Date`s, an ISO 8601 duration, a shorthand string,
or a plain object at it — get a localized duration string back. Detection is
deterministic: ambiguous input throws instead of guessing.

```ts
import { anylong } from "anylong";

anylong(9_000_000);                  // "2 hr, 30 min"   — milliseconds
anylong("PT2H30M");                  // "2 hr, 30 min"   — ISO 8601
anylong("2h 30m");                   // "2 hr, 30 min"   — shorthand
anylong({ hours: 2, minutes: 30 });  // "2 hr, 30 min"   — duration record
anylong(startedAt, finishedAt);      // between two Dates
anylong("P1DT4H", { locale: "ru", style: "long" });        // "1 день 4 часа"
anylong({ hours: 2, minutes: 30 }, { style: "digital" });  // "2:30:00"
```

---

## install

```bash
npm install anylong
```

---

## usage

```ts
anylong(input, options);
anylong(dateA, dateB, options);
```

The two-date form is order-independent and measures real elapsed time, so DST
boundaries do not distort it.

`anylong.parts()` takes the same arguments — including the two-date form — and
returns `{ type, value, unit? }` parts instead of a string.

```tsx
anylong.parts("2h 30m", { locale: "en" });
// [{ type: "integer", value: "2", unit: "hour" }, …]

anylong.parts("2h 30m", { locale: "en" }).map((p, i) =>
  p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
);
```

`anylong.supported` reports whether the runtime has `Intl.DurationFormat` —
see [compatibility](#compatibility), it is the newest API in the family.

---

## recipes

Copy, paste, move on.

```ts
// Video / track length
anylong(track.ms, { style: "digital" });
// "3:42"

// Task duration in a log
anylong(job.startedAt, job.finishedAt, { style: "long" });
// "1 day, 4 hours, 30 minutes"

// Time left until a deadline
anylong(deadline, { largestUnit: "days" });
// "2 days, 6 hr"

// Cache TTL from seconds
anylong(ttl, { unit: "s", style: "long" });
// "15 minutes"

// Compact badge
anylong("2h 30m", { style: "narrow" });
// "2h 30m"

// Degrade gracefully on runtimes without Intl.DurationFormat
anylong.supported ? anylong(ms) : `${Math.round(ms / 60000)} min`;
```

---

## inputs

Detection order is fixed. Every rejection names what it received and what it
accepts.

| Input | Behaviour |
| --- | --- |
| `number` | milliseconds, or seconds with `{ unit: "s" }`. Auto-decomposed up to days |
| `Date` | distance from now, always the absolute value |
| two `Date`s | distance between them, order-independent |
| ISO 8601 string | `"PT2H30M"`, `"P1DT4H"`, `"P3W"` — units kept as given |
| shorthand string | `"2h 30m"`, `"2 hours 30 minutes"` — English units, order-independent |
| duration record | `{ hours: 2, minutes: 30 }` — passed through untouched, never normalized |

```ts
anylong("1:30");        // ✗ ambiguous — 1h30m or 1m30s? Use "1h 30m" or "PT1H30M"
anylong(-5_000);        // ✗ negative — pass the absolute value or two Dates
anylong("1.5h");        // ✗ fractional shorthand — use "90m" or milliseconds
anylong("2h 3h");       // ✗ repeated unit
anylong({ hourz: 2 });  // ✗ unknown key, accepted keys listed
```

→ [Every input kind in detail](https://anyfamily.site/docs/anylong#inputs)

---

## options

| Option | Type | Default | Applies to |
| --- | --- | --- | --- |
| `locale` | `string \| string[]` | runtime locale | all |
| `style` | `"long" \| "short" \| "narrow" \| "digital"` | `"short"` | all |
| `unit` | `"ms" \| "s"` | `"ms"` | number input |
| `largestUnit` | `"weeks" … "milliseconds"` | `"days"` | number, Date(s) |
| `smallestUnit` | `"weeks" … "milliseconds"` | `"milliseconds"` | number, Date(s) |
| …rest | any `Intl.DurationFormat` option | — | all |

`largestUnit` / `smallestUnit` clamp the decomposition of elapsed time; inputs
that already carry units pass through as-is. Everything else —
`fractionalDigits`, per-unit styles like `hours: "2-digit"`,
`hoursDisplay: "always"` — goes straight to `Intl.DurationFormat`.

→ [What each option does, with examples](https://anyfamily.site/docs/anylong#options)

---

## styles

```ts
anylong("2h 30m", { style: "long" });    // "2 hours, 30 minutes"
anylong("2h 30m", { style: "short" });   // "2 hr, 30 min"   (default)
anylong("2h 30m", { style: "narrow" });  // "2h 30m"
anylong("2h 30m", { style: "digital" }); // "2:30:00"
```

---

## locales

Any BCP 47 tag, fallback arrays included. No locale files, no plugins — native
`Intl` ships the data.

```ts
anylong("2h 30m", { locale: "ru", style: "long" }); // "2 часа 30 минут"
anylong("2h 30m", { locale: "de", style: "long" }); // "2 Stunden, 30 Minuten"
anylong("2h 30m", { locale: "ja" });                // "2 時間 30 分"
anylong("2h 30m", { locale: ["sr-Latn-RS", "en"] });
```

---

## stability

anylong follows [semver](https://semver.org/). The public API is a single
export — `anylong`, with `anylong.parts` and `anylong.supported` on it — plus
`AnylongOptions` and the exported types. It only changes shape in a major
release. Exact formatted strings come from `Intl` and may vary between ICU
versions, so never assert on them across environments.

### migrating from 1.x

2.0 removed the separate `anylongParts` and `supported` exports. Both are the
same values, now reached through the one name the package exports:

```diff
- import { anylong, anylongParts, supported } from "anylong";
+ import { anylong } from "anylong";

- anylongParts("2h 30m");
+ anylong.parts("2h 30m");

- supported ? anylong(ms) : fallback;
+ anylong.supported ? anylong(ms) : fallback;
```

Arguments, return values and throwing behaviour are unchanged. Every `any*`
package follows this shape from 2.0 on: the bare call does the job, everything
else hangs off the same name.

---

## compatibility

`Intl.DurationFormat` is [Baseline 2025](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat)
— the newest API the family builds on, and the one most likely to be missing.

| | |
| --- | --- |
| Node.js | **23+** — the package supports 18+, the API does not |
| Chrome | 129+ |
| Firefox | 141+ |
| Safari | 18.4+ |
| Deno · Bun | ✓ |

On older runtimes every call throws a clear error. Check `anylong.supported`
first if you target them — note that Node 22 and earlier, still a common CI and
serverless default, are among them.

---

## the any family

anylong is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [anywhen](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [**anylong**](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
| [anyplural](https://anyfamily.site/anyplural) | plurals | `Intl.PluralRules` |
| [anyword](https://anyfamily.site/anyword) | words & graphemes | `Intl.Segmenter` |

Want all of them? [`anyfamily`](https://www.npmjs.com/package/anyfamily) is one
install for the lot, and [`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)
wraps each as a hook with a shared locale provider.

```bash
npm install anyfamily
```

---

MIT © [kirilinsky](https://github.com/kirilinsky)
