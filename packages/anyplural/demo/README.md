# anyplural demo

Interactive playground for the [`anyplural`](https://www.npmjs.com/package/anyplural) package.

Next.js 16 · React 19 · Tailwind 4.

## run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## what it shows

- edit the `count`, pick a `locale` and `type` (`cardinal` / `ordinal`)
- live `anyplural(...)` output
- `anypluralParts(...)` breakdown

`app/page.tsx` holds the playground. Locale form presets live in the `PRESETS`
map — add a locale there to expand the demo.

> Uses the published `anyplural` from npm. To test local `../src`, add a
> `pnpm-workspace.yaml` and point the dependency at `workspace:*` (or `file:..`).
