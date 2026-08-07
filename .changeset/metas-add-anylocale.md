---
"anyfamily": minor
"anyfamily-react": minor
---

Add anylocale to both meta-packages.

`anyfamily` re-exports `anylocale` and its public types (`AnylocaleInfo`,
`Direction`, `Weekday`) — none of them collide, so none are aliased.

`anyfamily-react` gains `useAnylocale(tag?)` and the `anylocaleSupported`
forward. The hook differs from the formatting hooks in two ways, both forced by
the underlying package: `anylocale` takes its tag as an argument rather than as
an option and has no "whatever the runtime uses" default, so with neither an
argument nor a provider the hook resolves the runtime's locale the way `Intl`
would; and it returns an object, so the result is memoized on the tag and keeps
its reference between renders.
