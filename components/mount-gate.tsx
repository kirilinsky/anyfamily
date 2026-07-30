"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after mount.
 *
 * The demo routes are prerendered, so anything computed during render is baked
 * into the HTML at build time — under the build's Node and its ICU data. The
 * browser's Intl can disagree (different ICU version, different runtime locale,
 * and `Intl.DurationFormat` is missing on Node 22 entirely), which turns every
 * playground into a hydration mismatch. Gating on mount keeps the server render
 * empty so there is nothing to mismatch, the same trick the landing's
 * `CodeAnimation` uses.
 *
 * The shell around this — wordmark, headings, footer — still renders on the
 * server, so the crawlable content is unaffected.
 */
export function MountGate({
  children,
  minHeight = "24rem",
}: {
  children: ReactNode;
  /** Reserved while unmounted, so revealing the demo doesn't jump the page. */
  minHeight?: string;
}) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ minHeight }} aria-hidden />;
  return <>{children}</>;
}
