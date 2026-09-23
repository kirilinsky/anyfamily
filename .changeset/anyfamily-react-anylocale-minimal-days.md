---
"anyfamily-react": minor
---

Picks up anylocale 1.1: `useAnylocale()` and the re-exported `AnylocaleInfo` now type `minimalDays` as `number | undefined`. Newer engines (Node 24) no longer report the field, and anylocale used to fill it with a wrong `1`.
