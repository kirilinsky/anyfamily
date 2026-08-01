---
"anyamount": major
---

anyamount now exports a single name. anyamountParts and anyamountSymbol are gone — the same functionality is
reached as `anyamount.parts` and `anyamount.symbol`.

```diff
- import { anyamount, ... } from "anyamount";
+ import { anyamount } from "anyamount";

- anyamountParts(1999, opts);
+ anyamount.parts(1999, opts);

- anyamountSymbol("USD");
+ anyamount.symbol("USD");
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. Part of the family-wide v2 shape: the bare call does the job,
everything else hangs off the same name.
