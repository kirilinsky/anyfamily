"use client";

import { useEffect, useRef, useState } from "react";

/** An npm-style install command pill; clicking copies the command. */
export function InstallChip({ command, accent }: { command: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(command).then(() => {
          setCopied(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1600);
        });
      }}
      aria-label={`Copy "${command}" to clipboard`}
      style={{ borderColor: `${accent}44` }}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-white/[0.03] px-5 py-3 font-mono text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white/90 sm:text-base"
    >
      <span className="select-none text-white/30">$</span>
      <span>{command}</span>
      <span
        className="select-none text-[11px] tracking-wide transition-colors"
        style={{ color: copied ? accent : undefined }}
      >
        {copied ? "copied" : (
          <span className="text-white/25 group-hover:text-white/50">copy</span>
        )}
      </span>
    </button>
  );
}
