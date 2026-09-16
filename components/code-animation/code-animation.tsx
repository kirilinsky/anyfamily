"use client";

import { useRef } from "react";

import { CallPanel, ResultPanel } from "./panels";
import { PresetDots } from "./preset-dots";
import type { Preset } from "./presets";
import { useCodeCycle } from "./use-code-cycle";

function safeRun(run: () => string): string {
  try {
    return run();
  } catch {
    return "—";
  }
}

/**
 * Cycles through `presets`, typing each call out character by character, then
 * revealing the value the real package returns. Output is computed only after
 * mount, so the server render stays empty and hydration can't mismatch on ICU
 * differences between Node and the browser.
 */
export function CodeAnimation({
  fn,
  accent,
  presets,
}: {
  fn: string;
  accent: string;
  presets: Preset[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cycle = useCodeCycle(presets, ref);
  const out = cycle.mounted && cycle.done ? safeRun(cycle.preset.run) : "";

  return (
    <div ref={ref} className="w-full max-w-3xl lg:max-w-4xl">
      <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 sm:p-8">
        <CallPanel
          presets={presets}
          typed={cycle.typed}
          fn={cycle.preset.fn ?? fn}
          accent={accent}
          caret={cycle.mounted && !cycle.done}
        />
        <ResultPanel out={out} accent={accent} />
      </div>

      <PresetDots
        count={presets.length}
        active={cycle.index}
        paused={cycle.paused}
        fill={cycle.fill}
        cycleMs={cycle.cycleMs}
        accent={accent}
        onPick={cycle.pick}
      />
    </div>
  );
}
