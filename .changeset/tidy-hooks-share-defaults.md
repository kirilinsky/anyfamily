---
"anyfamily-react": minor
---

`AnyfamilyProvider` now takes `defaults` — per-hook option defaults for the
settings that are the same app-wide, so a currency or a style is written once
instead of at every call site. A call's own options win key by key; a call that
names a different `mode` than the default replaces it rather than layering onto
it, since the options types are discriminated unions and the default's
mode-specific keys do not belong to another mode. `locale` is not mode-specific
and crosses either way, keeping the precedence `options.locale` → the default's
locale → the provider's `locale`. `useAnyfamilyDefaults()` reads them back.

The eight plain functions are re-exported as well, for formatting outside a
hook without adding the underlying package as a second dependency.

Also: `useAnyword` now keys its memo on the option fields rather than on a
stringified object, so reordering the keys of an inline options literal no
longer drops the memoized array, and the key costs less per render.
