---
"anylocale": minor
---

`minimalDays` is now `number | undefined`. The field was dropped from the Intl Locale Info spec, and newer engines (Node 24) no longer report it. anylocale used to fill the gap with `1`, which is wrong for locales such as `de-DE` (4). It now returns `undefined` when the runtime says nothing. `JSON.stringify` omits the key in that case.
