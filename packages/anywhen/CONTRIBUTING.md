# Contributing to anywhen

anywhen is small and focused, contributions should follow the same philosophy:
minimal, no dependencies, native `Intl` only.

## Setup

```bash
git clone https://github.com/kirilinsky/anywhen.git
cd anywhen
pnpm install
```

## Development

```bash
pnpm test           # run tests
pnpm test:coverage  # coverage report
pnpm typecheck      # type check without emitting
pnpm build          # build to dist/
```

## Guidelines

**Keep it small.** The bundle limit is 1750b. Check it before submitting.

**No dependencies.** Everything must work with native `Intl` — no external locale data, no helper libraries.

**Tests are required.** Any change to `src/index.ts` needs a corresponding test. Edge cases (locale boundaries, future dates, midnight crossings) are especially valuable.

**TypeScript only.** No plain JS files in `src/`.

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm test` and `pnpm typecheck` — both must pass
4. Open a PR with a clear description of what changed and why

## Reporting Bugs

Open an issue at [github.com/kirilinsky/anywhen/issues](https://github.com/kirilinsky/anywhen/issues). Include the locale, input value, expected output, and actual output.

## License

By contributing you agree that your changes will be licensed under [MIT](./LICENSE).
