"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  anyamount,
  type AnyamountOptions,
  type SymbolOptions as AnyamountSymbolOptions,
} from "anyamount";
import { anymany, type AnymanyOptions, type Items } from "anymany";
import { anyaround, type AnyaroundOptions } from "anyaround";
import { anylocale, type AnylocaleInfo } from "anylocale";
import { anylong, type AnylongOptions, type DurationInput } from "anylong";
import { anywhen, type AnywhenOptions, type DateInput, type Locale } from "anywhen";
import { anyplural, type AnypluralOptions, type Forms } from "anyplural";
import {
  anyword,
  type AnywordOptions,
  type AnywordTruncateOptions,
} from "anyword";

/**
 * The plain functions, re-exported so a component that needs to format outside
 * a hook — in an event handler, inside a `useMemo`, in a callback handed
 * downward — doesn't have to add the underlying package as a second
 * dependency. They are the same bindings the hooks call, extras and all:
 * `anyword.count`, `anyamount.symbol`, `anylong.supported`.
 *
 * They carry this module's `"use client"` boundary with them. To format in a
 * server component, import from `anyfamily` instead.
 */
export {
  anyamount,
  anyaround,
  anylocale,
  anylong,
  anymany,
  anyplural,
  anywhen,
  anyword,
};

export type { AnyamountOptions } from "anyamount";
export type { AnyamountSymbolOptions };
export type { AnymanyOptions, Items } from "anymany";
export type { AnyaroundOptions } from "anyaround";
export type { AnylocaleInfo, Direction, Weekday } from "anylocale";
export type { AnylongOptions, DurationInput } from "anylong";
export type { AnywhenOptions, DateInput } from "anywhen";
export type { AnypluralOptions, Forms } from "anyplural";
export type { AnywordOptions, AnywordTruncateOptions, Granularity } from "anyword";

/**
 * Re-exported so consumers can feature-detect without also importing the
 * underlying packages. Since v2 each package carries its own flag, so these are
 * plain forwards rather than the disambiguating aliases they used to be.
 */
export const anylocaleSupported = anylocale.supported;
export const anylongSupported = anylong.supported;
export const anywordSupported = anyword.supported;

/**
 * A BCP 47 locale tag, or a fallback chain. Structurally identical across
 * every any* package — re-exported from `anywhen` rather than redeclared,
 * same as the `anyfamily` meta-package does.
 */
export type { Locale } from "anywhen";

/**
 * Option defaults shared through {@linkcode AnyfamilyProvider}, one slot per
 * hook family. Anything a call site passes wins; these only fill in what it
 * left out.
 *
 * `anyword` covers `useAnyword` and `useAnywordCount`, but deliberately not
 * `useAnywordTruncate` — truncate segments by grapheme where the other two
 * segment by word, so folding them together would silently move where text
 * gets cut. It has its own slot.
 */
export interface AnyfamilyDefaults {
  anywhen?: UseAnywhenOptions;
  anyamount?: AnyamountOptions;
  anyamountSymbol?: AnyamountSymbolOptions;
  anymany?: AnymanyOptions;
  anyaround?: AnyaroundOptions;
  anylong?: AnylongOptions;
  anyplural?: AnypluralOptions;
  anyword?: AnywordOptions;
  anywordTruncate?: AnywordTruncateOptions;
}

export interface AnyfamilyProviderProps {
  /** Locale forwarded to every any* hook that doesn't set its own `locale` option. */
  locale?: Locale;
  /** Per-hook option defaults, for the settings that are the same app-wide — a currency, a time zone, a style. */
  defaults?: AnyfamilyDefaults;
  children?: ReactNode;
}

interface AnyfamilyContextValue {
  locale?: Locale;
  defaults?: AnyfamilyDefaults;
}

/** What hooks see outside any provider: no locale, no defaults. One constant, so `useAnyfamily()` memoizes on it. */
const NO_PROVIDER: AnyfamilyContextValue = {};

const AnyfamilyContext = createContext<AnyfamilyContextValue>(NO_PROVIDER);

const localeKey = (locale?: Locale): string =>
  typeof locale === "string" ? locale : locale ? locale.join("\0") : "";

/**
 * Shares a locale and a set of option defaults across every anyfamily-react
 * hook in the tree. A hook's own options always win.
 */
export function AnyfamilyProvider({ locale, defaults, children }: AnyfamilyProviderProps) {
  // Both props are nearly always written inline — a fresh array or object on
  // every render of whatever holds the provider. Key the memo on their
  // contents so consumers don't re-render for a change that isn't one. This
  // runs at the app root over a handful of keys, not per row of a list.
  const key = `${localeKey(locale)}|${JSON.stringify(defaults ?? null)}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for both props
  const value = useMemo<AnyfamilyContextValue>(() => ({ locale, defaults }), [key]);

  return <AnyfamilyContext.Provider value={value}>{children}</AnyfamilyContext.Provider>;
}

/** The locale currently provided by the nearest {@linkcode AnyfamilyProvider}, if any. */
export function useAnyfamilyLocale(): Locale | undefined {
  return useContext(AnyfamilyContext).locale;
}

/** The option defaults from the nearest {@linkcode AnyfamilyProvider}, if any — for wrapping a hook of your own. */
export function useAnyfamilyDefaults(): AnyfamilyDefaults | undefined {
  return useContext(AnyfamilyContext).defaults;
}

/**
 * Layers a call's options over the provider's defaults, then fills in the
 * locale. Precedence throughout: the call, then the defaults, then the
 * provider's `locale`.
 */
function resolve<T extends { locale?: Locale }>(
  options: T | undefined,
  defaults: T | undefined,
  contextLocale: Locale | undefined,
): T | undefined {
  const callMode = (options as { mode?: string } | undefined)?.mode;
  const defaultMode = (defaults as { mode?: string } | undefined)?.mode;
  // Options are discriminated unions on `mode`. Merging across two different
  // modes would carry the default's mode-specific keys — a `currency` — into a
  // call that asked for something else, so a call naming another mode replaces
  // the defaults rather than layering onto them. `locale` is not mode-specific
  // and survives either way.
  const modesAgree =
    callMode === undefined || defaultMode === undefined || callMode === defaultMode;

  const merged = defaults && modesAgree ? ({ ...defaults, ...options } as T) : options;
  if (merged?.locale !== undefined) return merged;

  const locale = defaults?.locale ?? contextLocale;
  if (locale === undefined) return merged;
  return { ...merged, locale } as T;
}

/** A call's options resolved against one slot of the nearest provider. */
function useResolved<T extends { locale?: Locale }>(
  slot: keyof AnyfamilyDefaults,
  options: T | undefined,
): T | undefined {
  const { locale, defaults } = useContext(AnyfamilyContext);
  return resolve(options, defaults?.[slot] as T | undefined, locale);
}

/**
 * A memo key for a set of anyword options — the whole of `AnywordOptions`, in a
 * fixed order. `JSON.stringify` would cost more on every render and key on the
 * object's own key order, so `{ by, locale }` and `{ locale, by }` — the same
 * options — would miss each other's memo.
 */
function anywordKey(options: AnywordOptions | undefined): string {
  return `${options?.by ?? ""}|${options?.raw ? 1 : 0}|${localeKey(options?.locale)}`;
}

/** The runtime's own locale, the way `Intl` resolves it. */
const runtimeLocale = () => new Intl.DateTimeFormat().resolvedOptions().locale;

const DEFAULT_TICK_MS = 60_000;
// Beyond this age, "smart"/"relative" output is in days/months and a 60s poll
// never changes it — ticking is pure waste. Only applies to the default tick;
// an explicit `refresh` always does what it's told.
const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * One interval per distinct period, shared by every hook that ticks. A list of
 * a hundred timestamps used to mean a hundred timers all firing within the same
 * second; now it is one timer, and the rows re-render together. The interval
 * is created by the first subscriber and cleared by the last.
 */
const tickers = new Map<number, { id: ReturnType<typeof setInterval>; subs: Set<() => void> }>();

function subscribe(ms: number, fn: () => void): () => void {
  let ticker = tickers.get(ms);
  if (!ticker) {
    const subs = new Set<() => void>();
    ticker = { subs, id: setInterval(() => subs.forEach((s) => s()), ms) };
    tickers.set(ms, ticker);
  }
  const { subs, id } = ticker;
  subs.add(fn);
  return () => {
    subs.delete(fn);
    if (subs.size === 0) {
      clearInterval(id);
      tickers.delete(ms);
    }
  };
}

function toTimestamp(date: DateInput): number {
  if (typeof date === "number") return date;
  if (typeof date === "string") return new Date(date).getTime();
  return date.getTime();
}

export interface UseAnywhenOptions extends AnywhenOptions {
  /**
   * How often to re-render so relative output stays fresh, in ms.
   * `false` disables ticking. Defaults to 60s (skipped past a day old);
   * ignored in `"absolute"` mode.
   */
  refresh?: number | false;
}

/** Like `anywhen`, plus a tick that keeps relative output ("3 minutes ago") from going stale. */
export function useAnywhen(date: DateInput, options?: UseAnywhenOptions): string {
  // Merge before splitting `refresh` off, so the provider can set a tick too.
  const { refresh, ...merged } = useResolved("anywhen", options) ?? {};
  const mode = merged.mode ?? "smart";
  const timestamp = toTimestamp(date);

  const [, tick] = useState(0);
  useEffect(() => {
    if (refresh === false || mode === "absolute") return;
    if (refresh === undefined && Math.abs(Date.now() - timestamp) > STALE_AFTER_MS) return;
    return subscribe(refresh ?? DEFAULT_TICK_MS, () => tick((n) => n + 1));
  }, [refresh, mode, timestamp]);

  return anywhen(date, merged);
}

/** Like `anyamount`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyamount(value: number | bigint, options?: AnyamountOptions): string {
  return anyamount(value, useResolved("anyamount", options));
}

/** Like `anyamount.symbol`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyamountSymbol(currency: string, options?: AnyamountSymbolOptions): string {
  return anyamount.symbol(currency, useResolved("anyamountSymbol", options));
}

/** Like `anymany`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnymany(items: Items, options?: AnymanyOptions): string {
  return anymany(items, useResolved("anymany", options));
}

/** Like `anyaround`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyaround(code: string, options?: AnyaroundOptions): string {
  return anyaround(code, useResolved("anyaround", options));
}

/** Like `anylong`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnylong(input: DurationInput, options?: AnylongOptions): string {
  return anylong(input, useResolved("anylong", options));
}

/** Like `anyplural`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyplural(count: number, forms: Forms, options?: AnypluralOptions): string {
  return anyplural(count, forms, useResolved("anyplural", options));
}

/**
 * Like `anyword`, reading `locale` from the nearest {@linkcode AnyfamilyProvider}
 * when not set explicitly. Unlike the other hooks this one returns an array, so
 * the result is memoized — the same segments keep the same reference until the
 * text or the options actually change, and passing it to a `useEffect` or a
 * `memo`'d child doesn't retrigger on every render.
 */
export function useAnyword(text: string, options?: AnywordOptions): string[] {
  const merged = useResolved("anyword", options);
  // Inline option objects are a fresh reference every render, so key the memo on
  // the options' contents rather than their identity.
  const key = anywordKey(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `merged`
  return useMemo(() => anyword(text, merged), [text, key]);
}

/** Like `anyword.count`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnywordCount(text: string, options?: AnywordOptions): number {
  return anyword.count(text, useResolved("anyword", options));
}

/** Like `anyword.truncate`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnywordTruncate(
  text: string,
  limit: number,
  options?: AnywordTruncateOptions,
): string {
  return anyword.truncate(text, limit, useResolved("anywordTruncate", options));
}

/**
 * Like `anylocale`, reading the tag from the nearest {@linkcode AnyfamilyProvider}
 * when none is passed.
 *
 * Two things differ from the formatting hooks:
 *
 * - `anylocale` takes the tag as its argument rather than as an option, and has
 *   no "whatever the runtime uses" default, so with neither an argument nor a
 *   provider the hook resolves the runtime's own locale the way `Intl` would;
 * - it returns an object, so the result is memoized — the same tag keeps the
 *   same reference, and passing it to a `useEffect` or a `memo`'d child doesn't
 *   retrigger on every render.
 *
 * Locale info is a static fact about the tag, so there is nothing to refresh.
 */
export function useAnylocale(input?: Locale): AnylocaleInfo {
  const contextLocale = useAnyfamilyLocale();
  const tag = input ?? contextLocale;
  // An inline array of fallback tags is a fresh reference every render, so key
  // the memo on the tags themselves rather than on their identity.
  const key = localeKey(tag);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `tag`
  return useMemo(() => anylocale(tag ?? runtimeLocale()), [key]);
}

/**
 * The whole family, bound to a provider — what {@linkcode useAnyfamily}
 * returns. Every function has the shape of the package it wraps, extras
 * included, with the provider's locale and defaults already applied.
 *
 * `anylocale` alone differs: its tag is optional here, falling back to the
 * provider's locale and then the runtime's, like {@linkcode useAnylocale}.
 */
export interface Anyfamily {
  anywhen: typeof anywhen;
  anyamount: typeof anyamount;
  anymany: typeof anymany;
  anyaround: typeof anyaround;
  anylong: typeof anylong;
  anyplural: typeof anyplural;
  anyword: typeof anyword;
  anylocale: ((input?: Locale) => AnylocaleInfo) & { supported: boolean };
}

function bind({ locale, defaults: d = {} }: AnyfamilyContextValue): Anyfamily {
  const opt = <T extends { locale?: Locale }>(options: T | undefined, slot: T | undefined) =>
    resolve(options, slot, locale);

  return {
    anywhen: Object.assign(
      (input: DateInput, options?: AnywhenOptions) => anywhen(input, opt(options, d.anywhen)),
      {
        parts: (input: DateInput, options?: AnywhenOptions) =>
          anywhen.parts(input, opt(options, d.anywhen)),
      },
    ),
    anyamount: Object.assign(
      (value: number | bigint, options?: AnyamountOptions) =>
        anyamount(value, opt(options, d.anyamount)),
      {
        parts: (value: number | bigint, options?: AnyamountOptions) =>
          anyamount.parts(value, opt(options, d.anyamount)),
        symbol: (currency: string, options?: AnyamountSymbolOptions) =>
          anyamount.symbol(currency, opt(options, d.anyamountSymbol)),
      },
    ),
    anymany: Object.assign(
      (items: Items, options?: AnymanyOptions) => anymany(items, opt(options, d.anymany)),
      {
        parts: (items: Items, options?: AnymanyOptions) =>
          anymany.parts(items, opt(options, d.anymany)),
      },
    ),
    anyaround: Object.assign(
      (code: string, options?: AnyaroundOptions) => anyaround(code, opt(options, d.anyaround)),
      {
        info: (code: string, options?: AnyaroundOptions) =>
          anyaround.info(code, opt(options, d.anyaround)),
      },
    ),
    anylong: Object.assign(
      // The two-date form puts the options third; anylong itself rejects a
      // non-Date first argument there, so the cast only satisfies the overload.
      (input: DurationInput, b?: Date | AnylongOptions, c?: AnylongOptions) =>
        b instanceof Date
          ? anylong(input as Date, b, opt(c, d.anylong))
          : anylong(input, opt(b, d.anylong)),
      {
        parts: (input: DurationInput, b?: Date | AnylongOptions, c?: AnylongOptions) =>
          b instanceof Date
            ? anylong.parts(input as Date, b, opt(c, d.anylong))
            : anylong.parts(input, opt(b, d.anylong)),
        supported: anylong.supported,
      },
    ),
    anyplural: Object.assign(
      (count: number, forms: Forms, options?: AnypluralOptions) =>
        anyplural(count, forms, opt(options, d.anyplural)),
      {
        parts: (count: number, forms: Forms, options?: AnypluralOptions) =>
          anyplural.parts(count, forms, opt(options, d.anyplural)),
      },
    ),
    anyword: Object.assign(
      (text: string, options?: AnywordOptions) => anyword(text, opt(options, d.anyword)),
      {
        parts: (text: string, options?: AnywordOptions) =>
          anyword.parts(text, opt(options, d.anyword)),
        count: (text: string, options?: AnywordOptions) =>
          anyword.count(text, opt(options, d.anyword)),
        truncate: (text: string, limit: number, options?: AnywordTruncateOptions) =>
          anyword.truncate(text, limit, opt(options, d.anywordTruncate)),
        supported: anyword.supported,
      },
    ),
    anylocale: Object.assign(
      (input?: Locale) => anylocale(input ?? locale ?? runtimeLocale()),
      { supported: anylocale.supported },
    ),
  };
}

/**
 * Every function in the family, bound to the nearest {@linkcode AnyfamilyProvider}:
 * same signatures as the packages, extras included, with the provider's locale
 * and defaults already applied. For the cases a one-value hook doesn't cover —
 * `parts()` and `info()`, a list formatted in a loop, a call inside an event
 * handler — without threading `useAnyfamilyLocale()` through by hand.
 *
 * The object is memoized on the provider's value, so it is safe as an effect
 * dependency and safe to destructure once. Nothing here ticks: for a relative
 * time that stays fresh on its own, use {@linkcode useAnywhen}.
 *
 * @example
 * ```tsx
 * const { anywhen, anyamount } = useAnyfamily();
 *
 * anywhen.parts(post.createdAt, { mode: "relative" }).map((p, i) =>
 *   p.type === "integer" ? <b key={i}>{p.value}</b> : p.value,
 * );
 * <button onClick={() => copy(anyamount(total, { mode: "currency", currency }))} />
 * ```
 */
export function useAnyfamily(): Anyfamily {
  const ctx = useContext(AnyfamilyContext);
  return useMemo(() => bind(ctx), [ctx]);
}
