<p align="center">
  <img src="https://i.ibb.co/hRbGtqjM/gt.png" alt="anywhen logo" width="230" />
</p>

<h1 align="center">anywhen</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anywhen"><img src="https://img.shields.io/npm/v/anywhen?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anywhen"><img src="https://img.shields.io/bundlephobia/minzip/anywhen?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anywhen"><img src="https://codecov.io/github/kirilinsky/anywhen/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anywhen?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  <strong>Tiny human-readable date formatter built on native <code>Intl</code>.</strong>
  <br />
  Turn dates into <code>"now"</code>, <code>"yesterday, 2:35 PM"</code>, <code>"через 3 часа"</code>, or <code>"2016年2月5日"</code>.
</p>

<p align="center">
  <a href="https://anywhen-kappa.vercel.app/">▸ live demo</a>
</p>

---

**One function. Smart defaults. Any locale. ~1.1kb gzip. Zero dependencies.**

`Intl` is powerful. anywhen makes it usable.

Built for feeds, chats, notifications, dashboards, and docs — anywhere a raw
timestamp should read like a person wrote it. No locale files. No plugins. No
config.

```ts
import { anywhen } from "anywhen";

anywhen(date);
// "yesterday, 2:35 PM"  — smart mode (default)

anywhen(date, { mode: "absolute", locale: "en" });
// "Feb 5, 2016"

anywhen(date, { mode: "relative", locale: "en" });
// "3 hours ago"

anywhen(date, { mode: "relative", locale: "ru" });
// "3 часа назад"

anywhen(date, { mode: "absolute", locale: "ja" });
// "2016年2月5日"
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

`input` is a `Date`, unix timestamp, or ISO string.

```ts
anywhen(new Date());
anywhen(Date.now());
anywhen("2016-02-05T14:00:00Z");
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

// SSR-safe Next.js / React Server Components
anywhen(createdAt, {
  locale: "en",
  now: requestTime,
  timeZone: "Europe/Belgrade",
});
```

---

## modes

The `mode` option picks the rendering strategy. Default is `"smart"`.

### smart

Context-aware. Picks the most readable format based on distance from now —
covers past and future.

```ts
anywhen(date, { locale: "en" });
// < 45s            → "now"
// < 1 hour         → "10 minutes ago"
// future > 1 hour  → "in 2 weeks"
// same day         → "today, 14:35"
// yesterday        → "yesterday, 09:00"
// < 7 days         → "Wednesday, 11:20"
// older            → "Feb 5, 2016"

anywhen(date, { locale: "en", time: false });
// "yesterday"  — clock removed

anywhen(date, { locale: "en", now: requestTime, timeZone: "Europe/Belgrade" });
// SSR-safe with stable anchor + timezone

anywhen(date, { locale: "en", style: "short" });
// "10 min. ago"  — shortens relative wording, calendar labels keep their clock
```

Reads: `locale`, `now`, `time`, `timeZone`, `style`, `thresholds`.

`style` maps to `Intl.RelativeTimeFormat` and only changes the relative
phrasing (`"now"`, `"10 min. ago"`, `"in 3 hr."`). Calendar labels
(`today`, `yesterday`, weekday) and the absolute fallback are unaffected.

By default, `smart` mode uses `time: true`, so nearby past dates stay useful in
feeds, chats, and activity logs: `"today, 2:35 PM"`,
`"yesterday, 09:00"`, `"Wednesday, 11:20"`. Use `time: false` for compact UI
where the label is enough: `"today"`, `"yesterday"`, `"Wednesday"`.

### absolute

Plain date formatting via `Intl.DateTimeFormat`. Pass `format` to control the
output shape.

```ts
anywhen(date, { mode: "absolute", locale: "en" });
// "Feb 5, 2016"

anywhen(date, {
  mode: "absolute",
  locale: "en",
  format: { hour: "2-digit", minute: "2-digit" },
});
// "2:35 PM"

anywhen(date, {
  mode: "absolute",
  locale: "en",
  format: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
});
// "Friday, February 5, 2016"
```

Reads: `locale`, `format`, `timeZone`.

### relative

Always relative. Past and future. Never falls back to absolute.

```ts
anywhen(date, { mode: "relative", locale: "en" });
// "3 hours ago"
// "yesterday"
// "in 2 weeks"

anywhen(date, { mode: "relative", locale: "en", numeric: true });
// "1 day ago"   — disables auto-phrases like "yesterday"
// "1 week ago"

anywhen(date, { mode: "relative", locale: "en", style: "short" });
// "3 hr. ago"

anywhen(date, { mode: "relative", locale: "en", style: "narrow" });
// "3h ago"
```

Reads: `locale`, `now`, `numeric`, `style`, `thresholds`.

---

## options

| Option     | Type                            | Default          | Used by              |
| ---------- | ------------------------------- | ---------------- | -------------------- |
| `mode`     | `"smart" \| "absolute" \| "relative"` | `"smart"`        | —                    |
| `locale`   | `string \| string[]`            | runtime locale   | all                  |
| `now`      | `Date \| number \| string`      | current time     | smart, relative      |
| `timeZone` | `string`                        | runtime timezone | smart, absolute      |
| `time`     | `boolean`                       | `true`           | smart                |
| `numeric`  | `boolean`                       | `false`          | relative             |
| `style`    | `"long" \| "short" \| "narrow"` | `"long"`         | smart, relative      |
| `format`   | `Intl.DateTimeFormatOptions`    | `{ day, month, year }` | absolute       |
| `thresholds` | `Partial<Record<unit, number>>` | built-in table   | smart, relative      |

Each mode reads only the options that apply to it. The rest are ignored.

### thresholds

Each unit (`second`, `minute`, `hour`, `day`, `week`, `month`) is shown while
the distance from `now` is below its cutoff, in seconds. Override any subset —
the rest keep their defaults (`second: 45`, `minute: 2700`, `hour: 79200`,
`day: 518400`, `week: 2160000`, `month: 28512000`).

```ts
anywhen(date, { mode: "relative", locale: "en", thresholds: { minute: 5400 } });
// 50 minutes ago → "50 minutes ago" instead of "1 hour ago"

anywhen(date, { locale: "en", thresholds: { second: 120 } });
// smart mode: "now" covers the first 2 minutes
```

In smart mode `thresholds.second` widens the `"now"` window, and the full
table applies to future dates. Calendar labels (`today`, `yesterday`,
weekday) are not affected.

---

## parts

`anywhenParts()` accepts the same arguments as `anywhen()` and returns the
output as `{ type, value, unit? }` parts — style the number apart from the
unit, or rebuild the string your own way.

```tsx
import { anywhenParts } from "anywhen";

anywhenParts(date, { mode: "relative", locale: "en" });
// [
//   { type: "integer", value: "3", unit: "hour" },
//   { type: "literal", value: " hours ago" },
// ]

// React: bold the number
anywhenParts(date, { mode: "relative" }).map((p, i) =>
  p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
);
```

---

## React / Next.js

Wrap output in `<time>` so machines still get the exact timestamp.

```tsx
import { anywhen } from "anywhen";

export function PostMeta({ createdAt }: { createdAt: string }) {
  return <time dateTime={createdAt}>{anywhen(createdAt)}</time>;
}
```

For SSR, pass `now` to keep server and client output stable across the
hydration boundary.

```tsx
export function PostMeta({
  createdAt,
  requestTime,
}: {
  createdAt: string;
  requestTime: string;
}) {
  return (
    <time dateTime={createdAt}>
      {anywhen(createdAt, {
        locale: "en",
        now: requestTime,
        timeZone: "Europe/Belgrade",
      })}
    </time>
  );
}
```

`now` freezes the relative anchor. `timeZone` controls both the displayed
clock and the smart calendar boundaries (`today`, `yesterday`, weekday).

---

## locales

Pass any valid BCP 47 tag — including regional variants like `en-GB`, `zh-TW`,
`pt-BR`. Fallback arrays also work.

```ts
anywhen(date, { locale: "de" });           // "gestern, 14:35"
anywhen(date, { locale: "ru" });           // "вчера, 14:35"
anywhen(date, { locale: "fr" });           // "hier, 14:35"
anywhen(date, { locale: ["sr-Latn-RS", "en"] });

anywhen(date, { mode: "absolute", locale: "ja" });   // "2016年2月5日"
anywhen(date, { mode: "absolute", locale: "ar" });   // "٥ فبراير ٢٠١٦"

anywhen(date, { mode: "relative", locale: "tr" });   // "3 saat önce"
```

When omitted, native `Intl` uses the runtime locale.

---

## vs the alternatives

|                     |  anywhen  | dayjs | date-fns |
| ------------------- | :-------: | :---: | :------: |
| gzip                | **~1.1kb** | ~7kb  |  ~20kb   |
| locale data bundled |  **no**   |  yes  |   yes    |
| locales             | **200+**  |  140  |   100    |
| dependencies        |   **0**   |   0   |    0     |

---

## stability

anywhen follows [semver](https://semver.org/). Since 1.0.0 the public API —
`anywhen`, `anywhenParts`, `AnywhenOptions`, and the exported types — only
changes shape in a major release. New options arrive in minors; exact
formatted strings come from `Intl` and may vary between ICU versions, so
never assert on them across environments.

---

## compatibility

Node.js 18+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime · Cloudflare
Workers · Deno

CI runs the full suite on Node 20, 22, and 24. Older runtimes down to
Node 18 work but are not tested on every release.
