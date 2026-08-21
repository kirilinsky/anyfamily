/**
 * Benchmarks the eight any* libraries against their built `dist/`, which is what
 * consumers actually load. Run `pnpm --filter "./packages/*" build` first.
 *
 * Three numbers per package, because they fail in different ways:
 *
 * - **cold**  — first call in a fresh module instance: constructing the native
 *               `Intl` formatter. Measured by importing the bundle again under a
 *               new query string, which gives Node a separate module registry
 *               entry and therefore an empty formatter cache.
 * - **hot**   — steady state, same options every time: pure cache hit plus the
 *               native format call. This is the number most apps live on.
 * - **churn** — rotating over more distinct locales than `CACHE_LIMIT`, so every
 *               call misses and evicts. Where key-building cost shows up.
 * - **mixed** — one hot locale interleaved with the rotating cold ones, timing
 *               *only* the hot call. This is the shape of a real app — one or
 *               two locales plus the occasional odd one — and the only scenario
 *               that separates a FIFO cache from an LRU one: under FIFO the hot
 *               entry is evicted every `CACHE_LIMIT` misses no matter how often
 *               it is used, and has to be rebuilt at cold-call prices.
 *
 * Usage:
 *   node scripts/bench.mjs                # run, and diff against the baseline
 *   node scripts/bench.mjs --save         # run and overwrite the baseline
 *   node scripts/bench.mjs --filter anywhen
 */
import { gzipSync } from "node:zlib";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const BASELINE = join(ROOT, "scripts", "bench-baseline.json");

const args = process.argv.slice(2);
const save = args.includes("--save");
const only = args.includes("--filter") ? args[args.indexOf("--filter") + 1] : null;

/** Enough distinct tags to blow past every package's 50-entry formatter cache. */
const LOCALES = [
  "en-US", "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "pt-BR", "nl-NL",
  "sv-SE", "nb-NO", "da-DK", "fi-FI", "pl-PL", "cs-CZ", "sk-SK", "hu-HU",
  "ro-RO", "bg-BG", "el-GR", "tr-TR", "ru-RU", "uk-UA", "he-IL", "ar-EG",
  "ar-SA", "fa-IR", "hi-IN", "bn-IN", "ta-IN", "th-TH", "vi-VN", "id-ID",
  "ms-MY", "ko-KR", "ja-JP", "zh-CN", "zh-TW", "zh-HK", "en-AU", "en-CA",
  "en-IE", "en-IN", "en-NZ", "en-ZA", "fr-CA", "fr-BE", "de-AT", "de-CH",
  "es-MX", "es-AR", "es-CO", "pt-PT", "it-CH", "nl-BE", "sr-RS", "hr-HR",
  "sl-SI", "et-EE", "lv-LV", "lt-LT", "is-IS", "ga-IE", "cy-GB", "eu-ES",
];

const NOW = new Date("2026-01-01T12:00:00Z");
const THEN = new Date("2026-01-01T09:00:00Z");

/**
 * Each case says how to exercise one package. `job` is the bare call — the thing
 * the README puts in its first example — and `locale` is threaded through so the
 * churn run can vary it.
 */
const CASES = {
  anywhen: {
    job: (m, locale) => m.anywhen(THEN, { mode: "relative", locale, now: NOW }),
  },
  anyamount: {
    job: (m, locale) => m.anyamount(1999.5, { mode: "currency", currency: "EUR", locale }),
  },
  anymany: {
    job: (m, locale) => m.anymany(["alpha", "beta", "gamma"], { locale }),
  },
  anyaround: {
    job: (m, locale) => m.anyaround("US", { locale }),
  },
  anylong: {
    supported: (m) => m.anylong.supported,
    job: (m, locale) => m.anylong("PT2H30M", { locale }),
  },
  anyplural: {
    job: (m, locale) => m.anyplural(5, { one: "item", other: "items" }, { locale }),
  },
  anyword: {
    supported: (m) => m.anyword.supported,
    job: (m, locale) => m.anyword("héllo 世界 test", { locale }),
  },
  anylocale: {
    supported: (m) => m.anylocale.supported,
    job: (m, locale) => m.anylocale(locale).direction,
  },
};

const distUrl = (pkg) => pathToFileURL(join(ROOT, "packages", pkg, "dist", "index.mjs")).href;

/** ns/op, median of `rounds` rounds, each round sized to run at least `minMs`. */
function measure(fn, { minMs = 40, rounds = 7 } = {}) {
  let iters = 1;
  while (true) {
    const started = performance.now();
    for (let i = 0; i < iters; i++) fn(i);
    if (performance.now() - started >= minMs) break;
    iters *= 2;
    if (iters > 1 << 24) break;
  }

  const samples = [];
  for (let r = 0; r < rounds; r++) {
    const started = performance.now();
    for (let i = 0; i < iters; i++) fn(i);
    samples.push(((performance.now() - started) * 1e6) / iters);
  }
  samples.sort((a, b) => a - b);
  return samples[samples.length >> 1];
}

/**
 * ns for the hot call, while cold locales stream past it.
 *
 * Timed by subtraction rather than by wrapping the hot call: `performance.now()`
 * around a ~500ns call costs as much as the call and the variance swamped the
 * result. So time the whole interleaved loop with the same batching every other
 * number uses, then take the churn cost — measured on its own — back out.
 */
function measureMixed(mod, kase, churnNs) {
  const perIteration = measure((i) => {
    kase.job(mod, "en-US");
    kase.job(mod, LOCALES[i % LOCALES.length]);
  });
  return Math.max(0, perIteration - churnNs);
}

/**
 * ns for a first call in a module instance that has never formatted anything.
 * A fresh import per sample, so the formatter cache inside starts empty.
 */
async function measureCold(pkg, kase, samples = 40) {
  const timings = [];
  for (let i = 0; i < samples; i++) {
    const mod = await import(`${distUrl(pkg)}?cold=${i}`);
    const locale = LOCALES[i % LOCALES.length];
    const started = performance.now();
    kase.job(mod, locale);
    timings.push((performance.now() - started) * 1e6);
  }
  timings.sort((a, b) => a - b);
  return timings[timings.length >> 1];
}

function sizes(pkg) {
  const file = join(ROOT, "packages", pkg, "dist", "index.mjs");
  const raw = readFileSync(file);
  return { raw: raw.byteLength, gzip: gzipSync(raw, { level: 9 }).byteLength };
}

const fmtNs = (ns) =>
  ns >= 1e6 ? `${(ns / 1e6).toFixed(2)}ms` : ns >= 1e3 ? `${(ns / 1e3).toFixed(1)}µs` : `${ns.toFixed(0)}ns`;

function delta(now, before) {
  if (before == null) return "";
  const pct = ((now - before) / before) * 100;
  // Run-to-run noise on this harness is ±4%, so anything under 5% is not a
  // result. Treat a real win as one that survives a rebuild and a rerun.
  if (Math.abs(pct) < 5) return "=";
  return `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`;
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
const results = {};

for (const [pkg, kase] of Object.entries(CASES)) {
  if (only && pkg !== only) continue;

  const distPath = join(ROOT, "packages", pkg, "dist", "index.mjs");
  if (!existsSync(distPath)) {
    console.error(`${pkg}: no dist — run \`pnpm --filter "./packages/*" build\` first`);
    process.exitCode = 1;
    continue;
  }

  const mod = await import(distUrl(pkg));
  if (kase.supported && !kase.supported(mod)) {
    results[pkg] = { skipped: "unsupported in this runtime", ...sizes(pkg) };
    continue;
  }

  const hot = measure(() => kase.job(mod, "en-US"));
  const churn = measure((i) => kase.job(mod, LOCALES[i % LOCALES.length]));
  const mixed = measureMixed(mod, kase, churn);
  const cold = await measureCold(pkg, kase);

  results[pkg] = { cold, hot, churn, mixed, ...sizes(pkg) };
}

const pad = baseline ? 13 : 8;
const header =
  "package".padEnd(11) +
  "cold".padStart(9) +
  "hot".padStart(pad) +
  "mixed".padStart(pad) +
  "churn".padStart(pad) +
  "gzip".padStart(pad);
console.log(`\nnode ${process.version}   ${new Date().toISOString()}`);
console.log(baseline ? `baseline: ${baseline.node} ${baseline.date}\n` : "no baseline yet — run with --save to write one\n");
console.log(header);
console.log("-".repeat(header.length));

for (const [pkg, r] of Object.entries(results)) {
  const was = baseline?.results?.[pkg];
  if (r.skipped) {
    console.log(`${pkg.padEnd(11)}${`— ${r.skipped}`.padStart(34)}${`${r.gzip}B`.padStart(10)}`);
    continue;
  }
  const cell = (text, change) => text.padStart(8) + (change ? change.padStart(5) : "");
  console.log(
    pkg.padEnd(11) +
      fmtNs(r.cold).padStart(9) +
      cell(fmtNs(r.hot), baseline && delta(r.hot, was?.hot)) +
      cell(fmtNs(r.mixed), baseline && delta(r.mixed, was?.mixed)) +
      cell(fmtNs(r.churn), baseline && delta(r.churn, was?.churn)) +
      cell(`${r.gzip}B`, baseline && delta(r.gzip, was?.gzip)),
  );
}

console.log(
  "\ncold = first call in a fresh module (builds the Intl formatter)" +
    "\nhot  = same options every call (cache hit)" +
    "\nmixed= the hot call only, with cold locales streaming past it (does the hot entry survive?)" +
    "\nchurn= 64 rotating locales, past the 50-entry cache (every call misses)",
);

if (save) {
  writeFileSync(
    BASELINE,
    JSON.stringify({ node: process.version, date: new Date().toISOString(), results }, null, 2) + "\n",
  );
  console.log(`\nbaseline written to scripts/bench-baseline.json`);
}
