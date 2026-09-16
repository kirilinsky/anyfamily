import type { Preset } from "./presets";

function Label({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      className={`mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:mb-2 ${className}`}
    >
      {children}
    </p>
  );
}

/** "you call": the call typing out, the function name in the accent colour. */
export function CallPanel({
  presets,
  typed,
  fn,
  accent,
  caret,
}: {
  presets: Preset[];
  typed: string;
  /** The prefix painted in the accent colour — the function, or the import clause. */
  fn: string;
  accent: string;
  caret: boolean;
}) {
  return (
    <>
      <Label>you call</Label>
      <div className="grid grid-cols-1 font-mono text-sm leading-relaxed sm:text-base">
        {/* Invisible sizer: every preset's full call stacked in the same grid
            cell reserves the tallest real wrapped height at this width, so
            typing never grows the box mid-animation. */}
        {presets.map((p, k) => (
          <span
            key={k}
            aria-hidden
            className="invisible col-start-1 row-start-1 whitespace-pre-wrap break-words"
          >
            {p.call}
          </span>
        ))}
        <div className="col-start-1 row-start-1 whitespace-pre-wrap break-words">
          <span style={{ color: accent }}>{typed.slice(0, fn.length)}</span>
          <span className="text-white/60">{typed.slice(fn.length)}</span>
          {caret && (
            <span className="ml-0.5 animate-pulse" style={{ color: accent }}>
              ▋
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/** "you get": the real return value, faded until the call has finished typing. */
export function ResultPanel({ out, accent }: { out: string; accent: string }) {
  return (
    <>
      <Label className="mt-4 sm:mt-6">you get</Label>
      <div
        // Only opacity and transform move here. `transition-all` also caught
        // min-height and the paddings, which change at the breakpoints.
        className="flex min-h-[5rem] items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 transition-[opacity,transform] duration-200 ease-out sm:min-h-[8rem] sm:px-5 sm:py-6"
        style={{
          opacity: out ? 1 : 0.25,
          transform: out ? "none" : "translateY(6px)",
        }}
      >
        <span className="font-mono text-lg text-white/25">→</span>
        <span
          className="font-mono text-xl font-semibold break-words sm:text-4xl"
          style={{ color: accent }}
        >
          {out || " "}
        </span>
      </div>
    </>
  );
}
