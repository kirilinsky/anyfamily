---
"anyfamily": major
---

Re-exports the family's v2 shape: seven names, nothing else.

Everything that used to be a second export is gone, because it now hangs off
the package's own name:

```diff
- import { anywhen, anywhenParts, anywordCount, anylongSupported } from "anyfamily";
+ import { anywhen, anyword, anylong } from "anyfamily";

- anywhenParts(date);        →  anywhen.parts(date)
- anymanyParts(items);       →  anymany.parts(items)
- anyaroundInfo("US");       →  anyaround.info("US")
- anylongParts("2h");        →  anylong.parts("2h")
- anylongSupported;          →  anylong.supported
- anyamountParts(1999);      →  anyamount.parts(1999)
- anyamountSymbol("USD");    →  anyamount.symbol("USD")
- anypluralParts(5, forms);  →  anyplural.parts(5, forms)
- anywordParts(text);        →  anyword.parts(text)
- anywordCount(text);        →  anyword.count(text)
- anywordTruncate(text, 20); →  anyword.truncate(text, 20)
- anywordSupported;          →  anyword.supported
```

The prefixed aliases existed only because two packages both exported
`supported` and several exported a `*Parts`. Nothing collides any more, so they
are gone rather than renamed. Types are unaffected.
