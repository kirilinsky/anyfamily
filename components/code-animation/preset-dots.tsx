import { useState } from "react";

/**
 * One pill per preset. The active pill fills across the cycle so the countdown
 * to the next preset is visible; while paused it sits full. A click jumps to
 * that preset and pauses; clicking the active pill again resumes.
 */
export function PresetDots({
  count,
  active,
  paused,
  fill,
  cycleMs,
  accent,
  onPick,
}: {
  count: number;
  active: number;
  paused: boolean;
  /** 0–100, the countdown progress of the active pill. */
  fill: number;
  cycleMs: number;
  accent: string;
  onPick: (k: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="mt-3 flex items-center gap-3 sm:mt-4">
      {Array.from({ length: count }, (_, k) => {
        const isActive = k === active;
        const hovered = k === hover;
        const resumes = isActive && paused;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onPick(k)}
            onMouseEnter={() => setHover(k)}
            onMouseLeave={() => setHover(null)}
            aria-label={resumes ? "Resume autoplay" : `Show example ${k + 1}`}
            title={resumes ? "resume autoplay" : undefined}
            aria-current={isActive ? "true" : undefined}
            className="group -my-3 cursor-pointer px-0.5 py-3"
          >
            {/* The pill's own width is named rather than animated through
                `all`. It stays a width: scaling it would squash the progress
                fill inside, and this one only moves on hover or a click. */}
            <span
              className="block h-2.5 overflow-hidden rounded-full transition-[width,background-color] duration-150 ease-out"
              style={{
                width: isActive ? 40 : hovered ? 22 : 10,
                background:
                  !isActive && hovered
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.15)",
              }}
            >
              {isActive && (
                // The countdown runs for the whole cycle, every cycle, so it
                // is the one worth keeping off the layout: scaleX from the
                // left paints the same sweep without reflowing anything.
                <span
                  className="block h-full w-full origin-left rounded-full"
                  style={{
                    transform: `scaleX(${fill / 100})`,
                    background: accent,
                    transition: `transform ${fill === 0 || paused ? 0 : cycleMs}ms linear`,
                  }}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
