"use client";

import { useEffect, useState } from "react";

import { PACKAGES } from "@/lib/packages";
import colors from "@/data/colors.json";

/**
 * The hero wordmark, cycling its suffix through the whole family and closing on
 * an infinity mark before starting over — "any|family", "any|when",
 * "any|amount", … "any|∞".
 *
 * Only the suffix moves. "any" and the divider are drawn once and never
 * re-animated; the outgoing word dissolves while the incoming one condenses in
 * its place, and the whole mark glides — rather than jumps — to stay centred
 * as the word length changes. The viewBox is pinned to the longest suffix so
 * nothing rescales.
 *
 * The first frame is always `family`, matching the server render, so the cycle
 * can only start after hydration. The mark is `aria-hidden` — the hero's
 * `<h1>` already names the site, and a label changing every two seconds would
 * be read out endlessly.
 */
const STEPS: { suffix: string; accent: string }[] = [
  { suffix: "family", accent: colors.anyfamily },
  ...PACKAGES.map((p) => ({ suffix: p.suffix, accent: p.accent })),
  { suffix: "∞", accent: colors.anyfamily },
];

const LONGEST = Math.max(...STEPS.map((s) => s.suffix.length));
const HOLD_MS = 2200;

const CHAR = 56; // approx mono glyph advance at fontSize 100
const SUFFIX_X = 230;
const WIDTH = SUFFIX_X + LONGEST * CHAR + 20;

/** Half the slack a shorter word leaves on the right — the offset that keeps the mark centred. */
const centre = (suffix: string) => ((LONGEST - suffix.length) * CHAR) / 2;

export function CyclingLogo({ className }: { className?: string }) {
  // The current step and the one on its way out, so both words can be drawn
  // at once while the old one dissolves.
  const [{ i, prev }, setStep] = useState<{ i: number; prev: number | null }>({
    i: 0,
    prev: null,
  });

  useEffect(() => {
    // Honour the OS setting: leave the mark on "family" and never cycle.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setStep((s) => ({ i: (s.i + 1) % STEPS.length, prev: s.i })),
      HOLD_MS,
    );
    return () => clearInterval(id);
  }, []);

  const step = STEPS[i];
  const leaving = prev === null ? null : STEPS[prev];

  return (
    <div aria-hidden className={className}>
      <svg viewBox={`0 0 ${WIDTH} 130`} xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
        <defs>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,800;1,400&family=JetBrains+Mono:wght@700&display=swap');
          `}</style>
        </defs>

        <g className="hero-mark" style={{ transform: `translateX(${centre(step.suffix)}px)` }}>
          <text
            x="10"
            y="92"
            fontFamily="'Inter', sans-serif"
            fontWeight="400"
            fontStyle="italic"
            fontSize="100"
            fill="#e9e4d4"
            textLength="180"
            lengthAdjust="spacingAndGlyphs"
          >
            any
          </text>

          <rect
            x="208"
            y="32"
            width="4"
            height="60"
            rx="1"
            className="hero-divider"
            style={{ fill: step.accent }}
          />

          {/* The suffixes are keyed by step so each swap restarts its
              animation; the leaving word is drawn first so the new one
              sits on top as it resolves. */}
          {leaving && (
            <text
              key={`out-${prev}`}
              x={SUFFIX_X}
              y="92"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="700"
              fontSize="100"
              fill={leaving.accent}
              textLength={leaving.suffix.length * CHAR}
              lengthAdjust="spacingAndGlyphs"
              className="hero-suffix hero-suffix-out"
            >
              {leaving.suffix}
            </text>
          )}
          <text
            key={`in-${i}`}
            x={SUFFIX_X}
            y="92"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="700"
            fontSize="100"
            fill={step.accent}
            textLength={step.suffix.length * CHAR}
            lengthAdjust="spacingAndGlyphs"
            className={`hero-suffix${prev === null ? "" : " hero-suffix-in"}`}
          >
            {step.suffix}
          </text>
        </g>
      </svg>
    </div>
  );
}
