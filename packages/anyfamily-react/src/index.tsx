"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { anyamount, type AnyamountOptions } from "anyamount";
import { anymany, type AnymanyOptions } from "anymany";
import { anyaround, type AnyaroundOptions } from "anyaround";
import {
  anylong,
  supported as anylongSupported,
  type AnylongOptions,
  type DurationInput,
} from "anylong";
import { anywhen, type AnywhenOptions, type DateInput, type Locale } from "anywhen";
import { anyplural, type AnypluralOptions, type Forms } from "anyplural";

export type { AnyamountOptions } from "anyamount";
export type { AnymanyOptions } from "anymany";
export type { AnyaroundOptions } from "anyaround";
export type { AnylongOptions, DurationInput } from "anylong";
export type { AnywhenOptions, DateInput } from "anywhen";
export type { AnypluralOptions, Forms } from "anyplural";
export { anylongSupported };

/**
 * A BCP 47 locale tag, or a fallback chain. Structurally identical across
 * every any* package — re-exported from `anywhen` rather than redeclared,
 * same as the `anyfamily` meta-package does.
 */
export type { Locale } from "anywhen";

const AnyfamilyLocaleContext = createContext<Locale | undefined>(undefined);

export interface AnyfamilyProviderProps {
  /** Locale forwarded to every any* hook that doesn't set its own `locale` option. */
  locale?: Locale;
  children?: ReactNode;
}

/** Shares a locale across every anyfamily-react hook in the tree. A hook's own `options.locale` always wins. */
export function AnyfamilyProvider({ locale, children }: AnyfamilyProviderProps) {
  return (
    <AnyfamilyLocaleContext.Provider value={locale}>
      {children}
    </AnyfamilyLocaleContext.Provider>
  );
}

/** The locale currently provided by the nearest {@linkcode AnyfamilyProvider}, if any. */
export function useAnyfamilyLocale(): Locale | undefined {
  return useContext(AnyfamilyLocaleContext);
}

function withLocale<T extends { locale?: Locale }>(
  options: T | undefined,
  contextLocale: Locale | undefined,
): T | undefined {
  if (options?.locale !== undefined || contextLocale === undefined) return options;
  return { ...options, locale: contextLocale } as T;
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
  const { refresh, ...rest } = options ?? {};
  const merged = withLocale(rest as AnywhenOptions, locale);
  const mode = merged?.mode ?? "smart";
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
  return anyamount(value, withLocale(options, locale));
}

/** Like `anymany`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnymany(items: readonly string[], options?: AnymanyOptions): string {
  const locale = useAnyfamilyLocale();
  return anymany(items, withLocale(options, locale));
}

/** Like `anyaround`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyaround(code: string, options?: AnyaroundOptions): string {
  const locale = useAnyfamilyLocale();
  return anyaround(code, withLocale(options, locale));
}

/** Like `anylong`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnylong(input: DurationInput, options?: AnylongOptions): string {
  const locale = useAnyfamilyLocale();
  return anylong(input, withLocale(options, locale));
}

/** Like `anyplural`, reading `locale` from the nearest {@linkcode AnyfamilyProvider} when not set explicitly. */
export function useAnyplural(count: number, forms: Forms, options?: AnypluralOptions): string {
  const locale = useAnyfamilyLocale();
  return anyplural(count, forms, withLocale(options, locale));
}
