---
"anywhen": minor
---

- **`anywhen.range(from, to, options)`** — two dates as one range, the way the locale writes it with the shared parts collapsed: `"Sep 12 – 15"`, `"12.–15. Sept. 2026"`, `"9:00 – 11:30 AM"`. Absolute only (`locale`, `timeZone`, `format`), order-independent, built on `Intl.DateTimeFormat.formatRange`.
