# anymany

## 2.0.0

### Major Changes

- 0be5676: anymany now exports a single name. anymanyParts are gone — the same functionality is
  reached as `anymany.parts`.

  ```diff
  - import { anymany, ... } from "anymany";
  + import { anymany } from "anymany";

  - anymanyParts(items);
  + anymany.parts(items);
  ```

  Arguments, return values and throwing behaviour are unchanged; nothing else in
  the API moved. Part of the family-wide v2 shape: the bare call does the job,
  everything else hangs off the same name.
