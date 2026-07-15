import type { ReactNode } from "react";

/** A muted pill used for the per-package feature tags. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] tracking-wide text-white/40 lowercase sm:px-2.5 sm:py-1 sm:text-[11px]">
      {children}
    </span>
  );
}
