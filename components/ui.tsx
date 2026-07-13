import type { ReactNode } from "react";

/** A muted pill used for the per-package feature tags. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-white/40">
      {children}
    </span>
  );
}
