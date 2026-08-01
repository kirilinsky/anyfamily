---
"anyword": major
---

anyword now exports a single name. anywordParts, anywordCount, anywordTruncate and supported are gone — the same functionality is
reached as `anyword.parts`, `anyword.count`, `anyword.truncate` and `anyword.supported`.

```diff
- import { anyword, ... } from "anyword";
+ import { anyword } from "anyword";

- anywordCount(text);
+ anyword.count(text);

- anywordTruncate(text, 20);
+ anyword.truncate(text, 20);
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. Part of the family-wide v2 shape: the bare call does the job,
everything else hangs off the same name.
