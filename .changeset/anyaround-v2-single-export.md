---
"anyaround": major
---

anyaround now exports a single name. anyaroundInfo are gone — the same functionality is
reached as `anyaround.info`.

```diff
- import { anyaround, ... } from "anyaround";
+ import { anyaround } from "anyaround";

- anyaroundInfo("US");
+ anyaround.info("US");
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. Part of the family-wide v2 shape: the bare call does the job,
everything else hangs off the same name.
