# anyfamily-react

[![anyfamily — anywhen · anyamount · anymany · anyaround · anylong · anyplural](https://anyfamily.site/opengraph-image?v6)](https://anyfamily.site)

React hooks for the **any\*** family:
[anywhen](https://www.npmjs.com/package/anywhen),
[anyamount](https://www.npmjs.com/package/anyamount),
[anymany](https://www.npmjs.com/package/anymany),
[anyaround](https://www.npmjs.com/package/anyaround),
[anylong](https://www.npmjs.com/package/anylong) and
[anyplural](https://www.npmjs.com/package/anyplural) as hooks, sharing one
locale and keeping relative time fresh without hand-rolled `setInterval`
plumbing.

**→ [anyfamily.site](https://anyfamily.site)**

```bash
npm install anyfamily-react
```

```tsx
import { AnyfamilyProvider, useAnywhen, useAnyamount } from "anyfamily-react";

function App() {
  return (
    <AnyfamilyProvider locale="en">
      <Post publishedAt={post.createdAt} price={1999} />
    </AnyfamilyProvider>
  );
}

function Post({ publishedAt, price }: { publishedAt: Date; price: number }) {
  const when = useAnywhen(publishedAt, { mode: "relative" }); // "3 hours ago", ticks itself
  const cost = useAnyamount(price, { mode: "currency", currency: "EUR" });
  return <p>{cost} — {when}</p>;
}
```

## why hooks and not just the functions

- **`AnyfamilyProvider`** — set `locale` once, every hook below picks it up.
  A hook's own `options.locale` always wins over the provider. Changing the
  provider's `locale` re-renders every hook under it, same as any React
  context.
- **`useAnywhen` ticks itself** — relative output ("3 minutes ago") goes
  stale the instant the component stops re-rendering. The hook re-renders on
  an interval (default 60s, `refresh` to override, `refresh: false` to
  disable) so it doesn't. No tick in `"absolute"` mode or once a date is
  over a day old — nothing left that a minute-granularity poll would change.
  The default tick is a fixed poll, not synced to unit boundaries: a
  transition like "59 seconds ago" → "1 minute ago" can lag up to one tick
  behind. Pass an explicit `refresh` if you need tighter alignment.

## hooks

- `useAnywhen(date, options?)` — see `anywhen`. `options.refresh` controls
  the tick interval.
- `useAnyamount(value, options?)` — see `anyamount`.
- `useAnymany(items, options?)` — see `anymany`.
- `useAnyaround(code, options?)` — see `anyaround`.
- `useAnylong(input, options?)` — see `anylong`. `anylongSupported` is
  re-exported for the same feature-detection anylong itself provides.
- `useAnyplural(count, forms, options?)` — see `anyplural`.

`useAnyfamilyLocale()` reads the locale from the nearest provider directly,
for anything not covered by the hooks above.

## license

MIT © [kirilinsky](https://github.com/kirilinsky)
