---
"anylong": major
---

anylong now exports a single name. anylongParts and supported are gone — the same functionality is
reached as `anylong.parts` and `anylong.supported`.

```diff
- import { anylong, ... } from "anylong";
+ import { anylong } from "anylong";

- anylongParts("2h 30m");
+ anylong.parts("2h 30m");

- supported ? anylong(ms) : fallback;
+ anylong.supported ? anylong(ms) : fallback;
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. Part of the family-wide v2 shape: the bare call does the job,
everything else hangs off the same name.
