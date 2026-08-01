---
"anyplural": major
---

anyplural now exports a single name. anypluralParts are gone — the same functionality is
reached as `anyplural.parts`.

```diff
- import { anyplural, ... } from "anyplural";
+ import { anyplural } from "anyplural";

- anypluralParts(5, forms);
+ anyplural.parts(5, forms);
```

Arguments, return values and throwing behaviour are unchanged; nothing else in
the API moved. Part of the family-wide v2 shape: the bare call does the job,
everything else hangs off the same name.
