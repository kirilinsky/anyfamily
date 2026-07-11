import type { ReactNode } from "react";

/** Small styled form primitives shared by every package example. */

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1.5 1.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E\")";

export function Select({
  value,
  onChange,
  options,
  accent,
  testid,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  accent: string;
  testid?: string;
}) {
  return (
    <select
      data-testid={testid}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        borderColor: `${accent}55`,
        color: accent,
        backgroundImage: CHEVRON,
        backgroundPosition: "right 0.5rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "0.6rem",
      }}
      className="h-8 shrink-0 cursor-pointer appearance-none rounded-md border bg-transparent pl-2 pr-6 font-mono text-sm outline-none transition-colors hover:brightness-125"
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#141414", color: "#ededed" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function TextInput({
  value,
  onChange,
  accent,
  width,
  placeholder,
  testid,
}: {
  value: string;
  onChange: (v: string) => void;
  accent: string;
  width?: string;
  placeholder?: string;
  testid?: string;
}) {
  return (
    <input
      data-testid={testid}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      placeholder={placeholder}
      style={{ color: accent, width: width ?? "9ch" }}
      className="h-8 shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 text-center font-mono text-sm outline-none transition-colors hover:border-white/20 focus:border-white/30"
    />
  );
}

export function Result({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex min-h-9 items-center rounded-md border border-white/[0.07] bg-black/40 px-3 py-2 font-mono text-sm text-white/90">
      {children}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-white/40">
      {children}
    </span>
  );
}
