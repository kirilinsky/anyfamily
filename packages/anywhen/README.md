<p align="center">
  <img src="./logo.png" alt="anywhen" width="420" />
</p>

<h1 align="center">anywhen</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anywhen"><img src="https://img.shields.io/npm/v/anywhen?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anywhen"><img src="https://img.shields.io/bundlephobia/minzip/anywhen?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml"><img src="https://github.com/kirilinsky/anyfamily/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anywhen?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Tiny human-readable date formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn dates into <code>"now"</code>, <code>"yesterday, 2:35 PM"</code>, <code>"через 3 часа"</code>, or <code>"2016年2月5日"</code>.
</p>

<p align="center">
  <a href="https://anyfamily.site/anywhen">▸ live demo</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/docs/anywhen">▸ full docs</a>
  &nbsp;·&nbsp;
  <a href="https://anyfamily.site/">▸ any family</a>
</p>

---

**One export. Smart defaults. Any locale. ~1.3kb gzip. Zero dependencies.**

`Intl` is powerful. anywhen makes it usable. Built for feeds, chats,
notifications, dashboards and docs — anywhere a raw timestamp should read like a
person wrote it. No locale files, no plugins, no config.

```ts
import { anywhen } from "anywhen";

anywhen(date);                                     // "yesterday, 2:35 PM"  — smart (default)
anywhen(date, { mode: "absolute", locale: "en" }); // "Feb 5, 2016"
anywhen(date, { mode: "relative", locale: "en" }); // "3 hours ago"
anywhen(date, { mode: "relative", locale: "ru" }); // "3 часа назад"
anywhen(date, { mode: "absolute", locale: "ja" }); // "2016年2月5日"
```

---

## install

```bash
npm install anywhen
```

---

## usage

```ts
anywhen(input);
anywhen(input, options);
```

`input` is a `Date`, a unix timestamp in milliseconds, or an ISO 8601 string.

```ts
anywhen(new Date());
anywhen(Date.now());
anywhen("2016-02-05T14:00:00Z");
```

`anywhen.parts()` takes the same arguments and returns
`{ type, value, unit? }` parts instead of a string — style the number apart from
the unit, or rebuild the output your own way.

```tsx
anywhen.parts(date, { mode: "relative", locale: "en" });
// [{ type: "integer", value: "3", unit: "hour" }, { type: "literal", value: " hours ago" }]

anywhen.parts(date, { mode: "relative" }).map((p, i) =>
  p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
);
```

---

## recipes

Copy, paste, move on.

```tsx
// Blog post date
<time dateTime={post.createdAt}>
  {anywhen(post.createdAt, { locale: "en", time: false })}
</time>

// Chat message
<time dateTime={message.sentAt}>
  {anywhen(message.sentAt, { locale: "en" })}
</time>

// Notification
anywhen(notification.createdAt, { mode: "relative", locale: "en" });
// "3 minutes ago"

// Settings screen / invoice date
anywhen(invoice.date, {
  mode: "absolute",
  locale: "en",
  format: { month: "long", day: "numeric", year: "numeric" },
});
// "February 5, 2016"

// SSR-safe: freeze the anchor and the zone
anywhen(createdAt, { locale: "en", now: requestTime, timeZone: "Europe/Belgrade" });
```

In React, `now` is what keeps server and client output identical across the
hydration boundary. `timeZone` controls both the printed clock and the smart
calendar boundaries. If you would rather have relative output refresh itself,
[`anyfamily-react`](https://www.npmjs.com/package/anyfamily-react)'s `useAnywhen`
ticks so `"3 minutes ago"` never goes stale.

---

## modes

`mode` picks the rendering strategy. Each mode reads only the options that apply
to it; the rest are ignored.

| Mode | Does | Reads |
| --- | --- | --- |
| `"smart"` (default) | relative when near, calendar labels for nearby days, absolute when far | `locale`, `now`, `time`, `timeZone`, `style`, `thresholds` |
| `"absolute"` | plain `Intl.DateTimeFormat` output, shaped by `format` | `locale`, `format`, `timeZone` |
| `"relative"` | always relative, past and future, never falls back | `locale`, `now`, `numeric`, `style`, `thresholds` |

Smart mode is symmetric — past and future read the same way:

```ts
anywhen(date, { locale: "en" });
// < 45s            → "now"
// < 1 hour         → "10 minutes ago"  /  "in 10 minutes"
// same day         → "today, 14:35"
// yesterday        → "yesterday, 09:00"
// tomorrow         → "tomorrow, 09:00"
// within 7 days    → "Wednesday, 11:20"
// older / further  → "Feb 5, 2016"
```

→ [Full breakdown of every mode](https://anyfamily.site/docs/anywhen#modes)

---

## options

| Option | Type | Default | Used by |
| --- | --- | --- | --- |
| `mode` | `"smart" \| "absolute" \| "relative"` | `"smart"` | — |
| `locale` | `string \| string[]` | runtime locale | all |
| `now` | `Date \| number \| string` | current time | smart, relative |
| `timeZone` | `string` | runtime timezone | smart, absolute |
| `time` | `boolean` | `true` | smart |
| `numeric` | `boolean` | `false` | relative |
| `style` | `"long" \| "short" \| "narrow"` | `"long"` | smart, relative |
| `format` | `Intl.DateTimeFormatOptions` | `{ day, month, year }` | absolute |
| `thresholds` | `Partial<Record<unit, number>>` | built-in table | smart, relative |

→ [What each option does, with examples](https://anyfamily.site/docs/anywhen#options)

---

## locales

Any valid BCP 47 tag, including regional variants and fallback arrays. When
omitted, native `Intl` uses the runtime locale.

```ts
anywhen(date, { locale: "de" });                    // "gestern, 14:35"
anywhen(date, { locale: "ru" });                    // "вчера, 14:35"
anywhen(date, { locale: ["sr-Latn-RS", "en"] });
anywhen(date, { mode: "absolute", locale: "ja" });  // "2016年2月5日"
```

Non-Gregorian calendars need no extra API — pick one with the `-u-ca-` extension
on `locale`, and ask for the era through `format`.

```ts
anywhen(date, { mode: "absolute", locale: "th-TH-u-ca-buddhist" });
// "5 ก.พ. 2559"
```

→ [Calendars, eras and their limits](https://anyfamily.site/docs/anywhen#calendars)

---

## vs the alternatives

| | anywhen | dayjs | date-fns |
| --- | :---: | :---: | :---: |
| gzip | **~1.3kb** | ~7kb | ~20kb |
| locale data bundled | **no** | yes | yes |
| locales | **200+** | 140 | 100 |
| dependencies | **0** | 0 | 0 |

---

## stability

anywhen follows [semver](https://semver.org/). The public API is a single
export — `anywhen`, with `anywhen.parts` on it — plus `AnywhenOptions` and the
exported types. It only changes shape in a major release. New options arrive in
minors; exact formatted strings come from `Intl` and may vary between ICU
versions, so never assert on them across environments.

### migrating from 1.x

2.0 removed the separate `anywhenParts` export. It is the same function, now
reached through the one name the package exports:

```diff
- import { anywhen, anywhenParts } from "anywhen";
+ import { anywhen } from "anywhen";

- anywhenParts(date, { mode: "relative" });
+ anywhen.parts(date, { mode: "relative" });
```

Arguments, return value and throwing behaviour are unchanged, and nothing else
in the API moved. Every `any*` package follows this shape from 2.0 on: the bare
call does the job, everything else hangs off the same name.

---

## compatibility

Node.js 18+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime · Cloudflare
Workers · Deno

CI runs the full suite on Node 20, 22 and 24.

---

## the any family

anywhen is part of **any family** — tiny, zero-dependency wrappers over native
`Intl`, one API per package.

| | | |
| --- | --- | --- |
| [**anywhen**](https://anyfamily.site/anywhen) | dates & relative time | `Intl.DateTimeFormat` |
| [anyamount](https://anyfamily.site/anyamount) | numbers, currency, units | `Intl.NumberFormat` |
| [anymany](https://anyfamily.site/anymany) | lists | `Intl.ListFormat` |
| [anyaround](https://anyfamily.site/anyaround) | names & flags | `Intl.DisplayNames` |
| [anylong](https://anyfamily.site/anylong) | durations | `Intl.DurationFormat` |
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
