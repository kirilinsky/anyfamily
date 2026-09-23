---
"anywhen": patch
---

Docs: the `thresholds` JSDoc now says smart mode reads only `second` and `minute`, and that smart's own `minute` default is 3600 (capped at 59 minutes). Before, it listed relative mode's defaults as if both modes used them.
