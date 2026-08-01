---
"anywhen": major
"anyfamily": major
"anyfamily-react": major
---

anywhen now exports a single name. `anywhenParts` is gone — the same function is
reached as `anywhen.parts`.

```diff
- import { anywhen, anywhenParts } from "anywhen";
+ import { anywhen } from "anywhen";

- anywhenParts(date, { mode: "relative" });
+ anywhen.parts(date, { mode: "relative" });
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. This is the first package on the family-wide v2 shape: the bare
call does the job, everything else hangs off the same name.

The meta packages are majors too — `anyfamily` re-exported `anywhenParts` and no
longer does, so their public surface changes with it.
