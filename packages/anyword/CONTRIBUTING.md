# Contributing to anyword

anyword is small and focused, contributions should follow the same philosophy:
minimal, no dependencies, native `Intl` only.

By participating, you agree to abide by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Setup

Development tooling requires Node.js 20+.

```bash
git clone https://github.com/kirilinsky/anyword.git
cd anyword
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

**Keep it small.** The bundle limit is 1100b. Check it before submitting.

**No dependencies.** Everything must work with native `Intl` — no Unicode tables, no helper libraries.

**Tests are required.** Any change to `src/index.ts` needs a corresponding test. Edge cases (composite emoji, combining marks, scripts without spaces, truncation boundaries) are especially valuable.

**Don't assert on exact ICU output across environments.** Segment boundaries come from the runtime's ICU and can shift between versions. Assert on invariants (a joined `raw` pass equals the input, an emoji stays whole) rather than a full segment list where you can.

**TypeScript only.** No plain JS files in `src/`.

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm test` and `pnpm typecheck` — both must pass
4. Open a PR with a clear description of what changed and why

## Reporting Bugs

Open an issue at [github.com/kirilinsky/anyword/issues](https://github.com/kirilinsky/anyword/issues). Include the locale, granularity, input string, expected output, and actual output.

## License

By contributing you agree that your changes will be licensed under [MIT](./LICENSE).
