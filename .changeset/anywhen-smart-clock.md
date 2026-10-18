---
"anywhen": patch
---

Smart mode now writes the clock the locale's own way (`timeStyle: "short"`): `"yesterday, 2:35 PM"` as the README always showed, not `"yesterday, 02:35 PM"`. 24-hour locales keep their own padding (`de`, `ru`: `"09:05"`; `ja`, `es`: `"9:05"`). Smart mode with `timeZone` is also faster: the calendar-day lookup reads `format()` instead of `formatToParts()`, ~4.4µs → ~2.8µs per call for nearby dates.
