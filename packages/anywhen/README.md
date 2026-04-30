<h1 align="center">anywhen</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anywhen"><img src="https://img.shields.io/npm/v/anywhen?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anywhen"><img src="https://img.shields.io/bundlephobia/minzip/anywhen?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anywhen"><img src="https://codecov.io/github/kirilinsky/anywhen/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anywhen?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  One function. Three modes. Any locale.
</p>

<p align="center">
  <a href="https://anywhen-kappa.vercel.app/">▸ live demo</a>
</p>

---

**~1.1kb gzip. zero dependencies. 200+ locales — for free.**

Built entirely on native `Intl`. No locale files. No plugins. No config.

```ts
import { anywhen } from "anywhen";

anywhen(date);
// "yesterday, 2:35 PM"  — smart mode (default)

anywhen(date, { mode: "absolute", locale: "en" });
// "Feb 5, 2016"

anywhen(date, { mode: "relative", locale: "en" });
// "3 hours ago"
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
```

Reads: `locale`, `now`, `time`, `timeZone`.

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
```

Reads: `locale`, `now`, `numeric`.

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
| `format`   | `Intl.DateTimeFormatOptions`    | `{ day, month, year }` | absolute       |

Each mode reads only the options that apply to it. The rest are ignored.

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

## compatibility

Node.js 13+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime · Cloudflare
Workers · Deno
