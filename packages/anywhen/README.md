<h1 align="center">anywhen</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/anywhen"><img src="https://img.shields.io/npm/v/anywhen?style=flat-square&color=black" alt="npm" /></a>
  <a href="https://bundlephobia.com/package/anywhen"><img src="https://img.shields.io/bundlephobia/minzip/anywhen?style=flat-square&color=black&label=gzip" /></a>
  <a href="https://github.com/kirilinsky/anywhen/actions"><img src="https://img.shields.io/github/actions/workflow/status/kirilinsky/anywhen/ci.yml?style=flat-square&color=black" alt="ci" /></a>
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

**~800b gzip. zero dependencies. 200+ locales — for free.**

Built entirely on native `Intl`. No locale files to import. No plugins to register. No config.

```ts
import { anydate, anywhen, anyago } from "anywhen";

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

## anydate — show me the date.

Always absolute. Pass any `Intl.DateTimeFormat` options.

```ts
anydate(date, "en"); // "Feb 5, 2016"
anydate(date, "en", { hour: "2-digit", minute: "2-digit" }); // "2:35 PM"
anydate(date, "en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}); // "Friday, February 5, 2016"
anydate(date, "en", { month: "long", year: "numeric" }); // "February 2016"

anydate(date, "de"); // "5. Feb. 2016"
anydate(date, "ja"); // "2016年2月5日"
anydate(date, "ar"); // "٥ فبراير ٢٠١٦"
```

---

## anywhen — when was it.

Smart context — picks the right format automatically. Covers past and future.

```ts
anywhen(date, "en"); // "just now"
anywhen(date, "en"); // "10 minutes ago"
anywhen(date, "en"); // "today, 2:35 PM"
anywhen(date, "en"); // "yesterday, 9:00 AM"
anywhen(date, "de"); // "Mittwoch, 11:20"
anywhen(date, "en"); // "Feb 5, 2016"
anywhen(date, "en"); // "in 2 weeks"
anywhen(date, "ru"); // "через 3 месяца"

anywhen(date, "en", false); // "yesterday" — no clock
```

---

## anyago — how long ago.

Always relative. Past and future.

```ts
anyago(date, "en"); // "3 hours ago"
anyago(date, "en"); // "yesterday"
anyago(date, "en"); // "in 2 weeks"
anyago(date, "de"); // "vor 3 Stunden"
anyago(date, "fr"); // "il y a 3 heures"
anyago(date, "tr"); // "3 saat önce"
anyago(date, "ru"); // "3 часа назад"

anyago(date, "en", true); // "1 day ago" instead of "yesterday"
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
```

---

## vs the alternatives

|                     |  anywhen  | dayjs | date-fns |
| ------------------- | :-------: | :---: | :------: |
| gzip                | **~800b** | ~7kb  |  ~20kb   |
| locale data bundled |  **no**   |  yes  |   yes    |
| locales             | **200+**  |  140  |   100    |
| dependencies        |   **0**   |   0   |    0     |

---

## input types

Every function accepts `Date`, unix timestamp, or ISO string.

```ts
anydate(new Date(), "en");
anydate(Date.now(), "en");
anydate("2016-02-05T14:00:00Z", "en");
```

## compatibility

Node.js 13+ · Chrome 71+ · Firefox 65+ · Safari 14+ · Edge Runtime
