import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import { FamilyLogo } from "@/components/family-logo";
import { MountGate } from "@/components/mount-gate";
import type { Pkg } from "@/lib/packages";

/**
 * Chrome shared by every per-package demo route: the noise wash, the centered
 * column, the wordmark, and the footer.
 *
 * The wrapper sets `--accent` to the package's color, which is what
 * `--color-accent` in globals.css resolves against — so `text-accent`,
 * `border-accent` and `accent-accent` inside a demo mean that package's accent
 * without any per-route Tailwind config.
 */
export function DemoShell({
  pkg,
  logoClassName = "h-auto w-40 opacity-90",
  children,
}: {
  pkg: Pkg;
  logoClassName?: string;
  children: ReactNode;
}) {
  return (
    <main
      style={{ "--accent": pkg.accent } as CSSProperties}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 pt-20 pb-28 sm:py-20"
    >
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-20 flex w-full max-w-3xl flex-col items-center gap-8">
        <h1 className="sr-only">
          {pkg.id} — {pkg.tagline}: {pkg.description}
        </h1>
        <FamilyLogo
          suffix={pkg.suffix}
          accent={pkg.accent}
          animate
          className={logoClassName}
        />
        <MountGate>{children}</MountGate>
      </div>

      <DemoFooter pkg={pkg} />
    </main>
  );
}

function DemoFooter({ pkg }: { pkg: Pkg }) {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-20 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="mx-auto flex min-h-14 max-w-3xl flex-col items-center justify-center gap-1 px-6 py-2 sm:min-h-12 sm:flex-row sm:justify-between sm:py-0">
        <p className="text-center font-mono text-[11px] text-white/30">
          {pkg.footerLine}
        </p>

        <div className="flex items-center">
          <Link
            href="/"
            className="px-3 py-2 text-xs tracking-widest text-white/25 uppercase transition-colors hover:text-white/60 sm:py-3"
          >
            anyfamily
          </Link>
          {pkg.hasDocs && (
            <Link
              href={`/docs/${pkg.id}`}
              className="px-3 py-2 text-xs tracking-widest text-white/25 uppercase transition-colors hover:text-white/60 sm:py-3"
            >
              docs
            </Link>
          )}
          <a
            href={pkg.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs tracking-widest text-white/25 uppercase transition-colors hover:text-white/60 sm:py-3"
          >
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}
