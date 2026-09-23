---
"anyfamily": minor
---

Picks up anylocale 1.1: the re-exported `AnylocaleInfo.minimalDays` is now `number | undefined`. Newer engines (Node 24) no longer report the field, and anylocale used to fill it with a wrong `1`. Also picks up the anywhen and anymany doc fixes (smart-mode `thresholds`, `max` counting).
