"use client";

import { useEffect, useState } from "react";

import { FamilyLogo } from "@/components/family-logo";
import { PACKAGES } from "@/lib/packages";
import colors from "@/data/colors.json";

/**
 * The hero wordmark, cycling its suffix through the whole family and closing on
 * an infinity mark before starting over — "any|family", "any|when",
 * "any|amount", … "any|∞".
 *
 * Three things keep it well-behaved:
 *
 * - the viewBox is pinned to the longest suffix, so "any" never rescales when a
 *   shorter word takes over;
 * - the first frame is always `family`, matching the server render, so the
 *   cycle can only start after hydration;
 * - the whole mark is `aria-hidden` — the hero's `<h1>` already names the site,
 *   and a label changing every 1.6s would be read out endlessly.
 */
const STEPS: { suffix: string; accent: string }[] = [
  { suffix: "family", accent: colors.anyfamily },
  ...PACKAGES.map((p) => ({ suffix: p.suffix, accent: p.accent })),
  { suffix: "∞", accent: colors.anyfamily },
];

const LONGEST = Math.max(...STEPS.map((s) => s.suffix.length));
const HOLD_MS = 1600;

export function CyclingLogo({ className }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    // Honour the OS setting: leave the mark on "family" and never cycle.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setI((n) => (n + 1) % STEPS.length), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  const step = STEPS[i];

  return (
    <div aria-hidden className={className}>
      {/* Keyed so each swap replays the fade; the fill also transitions, so the
          colour glides between accents while the word itself cuts. */}
      <div key={i} className="animate-logo-swap">
        <FamilyLogo
          suffix={step.suffix}
          accent={step.accent}
          widthChars={LONGEST}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
