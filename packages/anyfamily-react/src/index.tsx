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
import { anymany, type AnymanyOptions } from "anymany";
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
export type { AnymanyOptions } from "anymany";
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

const AnyfamilyLocaleContext = createContext<Locale | undefined>(undefined);
const AnyfamilyDefaultsContext = createContext<AnyfamilyDefaults | undefined>(undefined);

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

/**
 * Shares a locale and a set of option defaults across every anyfamily-react
 * hook in the tree. A hook's own options always win.
 */
export function AnyfamilyProvider({
  locale,
  defaults,
  children,
}: AnyfamilyProviderProps) {
  // `defaults` is nearly always written inline, which is a fresh object on
  // every render of whatever holds the provider. Key the memo on its contents
  // so consumers don't re-render for a change that isn't one. This runs at the
  // app root over a handful of keys, not per row of a list.
  const key = JSON.stringify(defaults ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `defaults`
  const stableDefaults = useMemo(() => defaults, [key]);

  return (
    <AnyfamilyLocaleContext.Provider value={locale}>
      <AnyfamilyDefaultsContext.Provider value={stableDefaults}>
        {children}
      </AnyfamilyDefaultsContext.Provider>
    </AnyfamilyLocaleContext.Provider>
  );
}

/** The locale currently provided by the nearest {@linkcode AnyfamilyProvider}, if any. */
export function useAnyfamilyLocale(): Locale | undefined {
  return useContext(AnyfamilyLocaleContext);
}

/** The option defaults from the nearest {@linkcode AnyfamilyProvider}, if any — for wrapping a hook of your own. */
export function useAnyfamilyDefaults(): AnyfamilyDefaults | undefined {
  return useContext(AnyfamilyDefaultsContext);
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

  const merged =
    defaults && modesAgree ? ({ ...defaults, ...options } as T) : options;
  if (merged?.locale !== undefined) return merged;

  const locale = defaults?.locale ?? contextLocale;
  if (locale === undefined) return merged;
  return { ...merged, locale } as T;
}

/**
 * A memo key for a set of anyword options — the whole of `AnywordOptions`, in a
 * fixed order. `JSON.stringify` would cost more on every render and key on the
 * object's own key order, so `{ by, locale }` and `{ locale, by }` — the same
 * options — would miss each other's memo.
 */
function anywordKey(options: AnywordOptions | undefined): string {
  const locale = options?.locale;
  const tag = Array.isArray(locale) ? locale.join(",") : (locale ?? "");
  return `${options?.by ?? ""}|${options?.raw ? 1 : 0}|${tag}`;
}

const DEFAULT_TICK_MS = 60_000;
// Beyond this age, "smart"/"relative" output is in days/months and a 60s poll
// never changes it — ticking is pure waste. Only applies to the default tick;
// an explicit `refresh` always does what it's told.
const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

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
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  // Merge before splitting `refresh` off, so the provider can set a tick too.
  const { refresh, ...rest } = resolve(options, defaults?.anywhen, locale) ?? {};
  const merged = rest as AnywhenOptions;
  const mode = merged.mode ?? "smart";
  const timestamp = toTimestamp(date);

  const [, tick] = useState(0);
  useEffect(() => {
    if (refresh === false || mode === "absolute") return;
    if (refresh === undefined && Math.abs(Date.now() - timestamp) > STALE_AFTER_MS) return;
    const id = setInterval(() => tick((n) => n + 1), refresh ?? DEFAULT_TICK_MS);
    return () => clearInterval(id);
  }, [refresh, mode, timestamp]);

  return anywhen(date, merged);
}

/** Like `anyamount`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyamount(value: number, options?: AnyamountOptions): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyamount(value, resolve(options, defaults?.anyamount, locale));
}

/** Like `anyamount.symbol`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyamountSymbol(
  currency: string,
  options?: AnyamountSymbolOptions,
): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyamount.symbol(
    currency,
    resolve(options, defaults?.anyamountSymbol, locale),
  );
}

/** Like `anymany`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnymany(items: readonly string[], options?: AnymanyOptions): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anymany(items, resolve(options, defaults?.anymany, locale));
}

/** Like `anyaround`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyaround(code: string, options?: AnyaroundOptions): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyaround(code, resolve(options, defaults?.anyaround, locale));
}

/** Like `anylong`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnylong(input: DurationInput, options?: AnylongOptions): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anylong(input, resolve(options, defaults?.anylong, locale));
}

/** Like `anyplural`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyplural(count: number, forms: Forms, options?: AnypluralOptions): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyplural(count, forms, resolve(options, defaults?.anyplural, locale));
}

/**
 * Like `anyword`, reading `locale` from the nearest {@linkcode AnyfamilyProvider}
 * when not set explicitly. Unlike the other hooks this one returns an array, so
 * the result is memoized — the same segments keep the same reference until the
 * text or the options actually change, and passing it to a `useEffect` or a
 * `memo`'d child doesn't retrigger on every render.
 */
export function useAnyword(text: string, options?: AnywordOptions): string[] {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  const merged = resolve(options, defaults?.anyword, locale);
  // Inline option objects are a fresh reference every render, so key the memo on
  // the options' contents rather than their identity.
  const key = anywordKey(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `merged`
  return useMemo(() => anyword(text, merged), [text, key]);
}

/** Like `anyword.count`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnywordCount(text: string, options?: AnywordOptions): number {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyword.count(text, resolve(options, defaults?.anyword, locale));
}

/** Like `anyword.truncate`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnywordTruncate(
  text: string,
  limit: number,
  options?: AnywordTruncateOptions,
): string {
  const locale = useAnyfamilyLocale();
  const defaults = useAnyfamilyDefaults();
  return anyword.truncate(
    text,
    limit,
    resolve(options, defaults?.anywordTruncate, locale),
  );
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
  const key = Array.isArray(tag) ? tag.join(",") : (tag as string | undefined);
  return useMemo(
    () =>
      anylocale(tag ?? new Intl.DateTimeFormat().resolvedOptions().locale),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands in for `tag`
    [key],
  );
}
