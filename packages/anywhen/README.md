<h1 align="center">anywhen</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anywhen"><img src="https://img.shields.io/npm/v/anywhen?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anywhen"><img src="https://img.shields.io/bundlephobia/minzip/anywhen?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anywhen/actions"><img src="https://img.shields.io/github/actions/workflow/status/kirilinsky/anywhen/ci.yml?style=flat-square&color=black" alt="ci" /></a>
  <a href="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml"><img src="https://github.com/kirilinsky/anywhen/actions/workflows/ssr.yml/badge.svg" alt="SSR Ready" /></a>
  <a href="https://codecov.io/github/kirilinsky/anywhen"><img src="https://codecov.io/github/kirilinsky/anywhen/graph/badge.svg" alt="codecov" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/anywhen?style=flat-square&color=black" alt="license" /></a>
</p>

<p align="center">
  Human-readable date formatting for any locale — relative, absolute, or smart context.
</p>

<p align="center">
  <em>show me the date.&nbsp;&nbsp;when was it.&nbsp;&nbsp;how long ago.</em>
</p>

<p align="center">
  <a href="https://anywhen-kappa.vercel.app/">▸ live demo</a>
</p>

---

**~1.3kb gzip. zero dependencies. 200+ locales — for free.**

Built entirely on native `Intl`. No locale files to import. No plugins to register. No config.

```ts
import { anydate, anywhen, anyago } from "anywhen";

// Use the runtime locale by default.
anydate(date); // "Feb 5, 2016"
anywhen(date); // "yesterday, 2:35 PM"
anyago(date); // "3 hours ago"

// Or pass any BCP 47 locale tag.
anydate(date, "en"); // "Feb 5, 2016"
anywhen(date, "en"); // "yesterday, 2:35 PM"
anyago(date, "en"); // "3 hours ago"

anydate(date, "de"); // "5. Feb. 2016"
anywhen(date, "fr"); // "hier, 14:35"
anyago(date, "tr"); // "3 saat önce"
```

---

## install

```bash
npm install anywhen
```

---

## React / Next.js

Use native `<time>` so machines still get the exact timestamp.

```tsx
import { anywhen } from "anywhen";

export function PostMeta({ createdAt }: { createdAt: string }) {
  return <time dateTime={createdAt}>{anywhen(createdAt)}</time>;
}
```

For SSR, pass the same render timestamp on the server and client to avoid
hydration drift.

```tsx
import { anywhen } from "anywhen";

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

`now` freezes the relative calculation. `timeZone` controls the clock and the
smart day boundaries for `today`, `yesterday`, and weekday output.

---

## v0.2 migration

`locale` is now optional and the object-options style is the recommended way to
make boolean options readable. Existing positional calls still work.

```ts
// 0.1 style, still supported
anywhen(date, "en", false);
anyago(date, "en", true);

// 0.2 style
anywhen(date, { locale: "en", time: false });
anyago(date, { locale: "en", numeric: true });
```

One behavior changed: `anywhen(today, locale, false)` now returns `"today"`,
not a short absolute date. Use `anydate(today, locale, options)` if you want an
absolute same-day date.

---

## anydate — show me the date.

Always absolute. Pass any `Intl.DateTimeFormat` options.

```ts
anydate(date); // runtime locale
anydate(date, "en"); // "Feb 5, 2016"
anydate(date, "en", { hour: "2-digit", minute: "2-digit" }); // "2:35 PM"
anydate(date, "en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}); // "Friday, February 5, 2016"
anydate(date, "en", { month: "long", year: "numeric" }); // "February 2016"

// Preferred when you want named options in one object:
anydate(date, { locale: "en", weekday: "long", month: "long", day: "numeric" });

anydate(date, "de"); // "5. Feb. 2016"
anydate(date, "ja"); // "2016年2月5日"
anydate(date, "ar"); // "٥ فبراير ٢٠١٦"
```

Signature:

```ts
anydate(input)
anydate(input, locale, options?)
anydate(input, { locale?, ...Intl.DateTimeFormatOptions })
```

---

## anywhen — when was it.

Smart context — picks the right format automatically. Covers past and future.

```ts
anywhen(date); // runtime locale
anywhen(date, "en"); // "just now"
anywhen(date, "en"); // "10 minutes ago"
anywhen(date, "en"); // "today, 2:35 PM"
anywhen(date, "en"); // "yesterday, 9:00 AM"
anywhen(date, "de"); // "Mittwoch, 11:20"
anywhen(date, "en"); // "Feb 5, 2016"
anywhen(date, "en"); // "in 2 weeks"
anywhen(date, "ru"); // "через 3 месяца"

anywhen(date, "en", false); // "yesterday" — no clock
anywhen(date, { locale: "en", time: false }); // same, clearer
anywhen(date, { locale: "en", now: requestTime }); // SSR-safe
anywhen(date, { locale: "en", timeZone: "Europe/Belgrade" });
```

Signature:

```ts
anywhen(input)
anywhen(input, locale, time?)
anywhen(input, time)
anywhen(input, { locale?, now?, time?, timeZone? })
```

`time: false` removes only the clock from today/yesterday/weekday output. It
keeps the smart relative word:

```ts
anywhen(todayAtNoon, "en"); // "today, 12:00 PM"
anywhen(todayAtNoon, "en", false); // "today"
```

---

## anyago — how long ago.

Always relative. Past and future.

```ts
anyago(date); // runtime locale
anyago(date, "en"); // "3 hours ago"
anyago(date, "en"); // "yesterday"
anyago(date, "en"); // "in 2 weeks"
anyago(date, "de"); // "vor 3 Stunden"
anyago(date, "fr"); // "il y a 3 heures"
anyago(date, "tr"); // "3 saat önce"
anyago(date, "ru"); // "3 часа назад"

anyago(date, "en", true); // "1 day ago" instead of "yesterday"
anyago(date, { locale: "en", numeric: true }); // same, clearer
anyago(date, { locale: "en", now: requestTime }); // SSR-safe
```

Signature:

```ts
anyago(input)
anyago(input, locale, numeric?)
anyago(input, numeric)
anyago(input, { locale?, now?, numeric? })
```

---

## anywhere — fix your locale.

One locale across all calls.

```ts
import { anywhere } from "anywhen";

const t = anywhere("de");

t.anydate(date); // "5. Feb. 2016"
t.anydate(date, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}); // "Freitag, 5. Februar 2016"
t.anywhen(date); // "gestern, 14:35"
t.anyago(date); // "vor 3 Stunden"
t.anywhen(date, { time: false }); // "gestern"
t.anyago(date, { numeric: true }); // "vor 3 Stunden"
```

If you omit the locale, `anywhere()` uses the runtime locale while still giving
you the compact instance methods.

```ts
const t = anywhere();

t.anydate(date);
t.anywhen(date, { time: false });
```

---

## vs the alternatives

|                     |  anywhen  | dayjs | date-fns |
| ------------------- | :-------: | :---: | :------: |
| gzip                | **~1.3kb** | ~7kb  |  ~20kb   |
| locale data bundled |  **no**   |  yes  |   yes    |
| locales             | **200+**  |  140  |   100    |
| dependencies        |   **0**   |   0   |    0     |

---

## input types

Every function accepts `Date`, unix timestamp, or ISO string.

```ts
anydate(new Date());
anydate(Date.now());
anydate("2016-02-05T14:00:00Z");
```

## locale

`locale` is optional everywhere. When omitted, native `Intl` uses the runtime's
default locale.

```ts
anydate(date); // user's/runtime locale
anydate(date, "en-US");
anydate(date, "sr-Latn-RS");
anydate(date, ["sr-Latn-RS", "en"]); // fallback list
```

## SSR and time zones

`anywhen()` and `anyago()` use the current time by default. In SSR apps, pass
`now` to make server and client output deterministic.

```ts
const requestTime = new Date().toISOString();

anywhen(post.createdAt, { now: requestTime });
anyago(comment.createdAt, { now: requestTime });
```

`anywhen()` also accepts `timeZone`. The time zone is used for the displayed
clock and for smart calendar boundaries.

```ts
anywhen("2023-12-31T23:30:00Z", {
  locale: "en",
  now: "2024-01-01T00:30:00Z",
  timeZone: "Europe/Belgrade",
}); // "today, 12:30 AM"
```

## compatibility

Node.js 13+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime
