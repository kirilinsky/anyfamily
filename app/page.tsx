import type { ComponentType } from "react";
import { FamilyLogo } from "@/components/family-logo";
import { Tag } from "@/components/ui";
import {
  AroundExample,
  AmountExample,
  WhenExample,
  ManyExample,
} from "@/components/examples";

type Pkg = {
  id: string;
  suffix: string;
  accent: string;
  tagline: string;
  description: string;
  tags: string[];
  npm: string;
  site: string;
  Example: ComponentType<{ accent: string }>;
};

// Canonical brand accents: anyaround #6d1625. On the dark page that red is
// too low-contrast, so anyaround renders with a lightened tint (#c85a6e).
const PACKAGES: Pkg[] = [
  {
    id: "anywhen",
    suffix: "when",
    accent: "#f5b66b",
    tagline: "dates & times",
    description:
      "Dates and times into localized strings and relative phrasing. Built on native Intl, no data files.",
    tags: ["dates", "datetimeformat", "relative", "i18n"],
    npm: "https://www.npmjs.com/package/anywhen",
    site: "https://anywhen-kappa.vercel.app",
    Example: WhenExample,
  },
  {
    id: "anyamount",
    suffix: "amount",
    accent: "#b493e6",
    tagline: "money & numbers",
    description:
      "Numbers, currency, and units into localized, human-readable strings. One function, three modes, any locale.",
    tags: ["currency", "numberformat", "units", "i18n"],
    npm: "https://www.npmjs.com/package/anyamount",
    site: "https://anyamount.vercel.app",
    Example: AmountExample,
  },
  {
    id: "anymany",
    suffix: "many",
    accent: "#2ce69d",
    tagline: "lists",
    description:
      "String arrays into localized lists — sort and join in any locale with the native list formatter.",
    tags: ["lists", "listformat", "i18n"],
    npm: "https://www.npmjs.com/package/anymany",
    site: "https://anymany.vercel.app",
    Example: ManyExample,
  },
  {
    id: "anyaround",
    suffix: "around",
    accent: "#c85a6e",
    tagline: "names & flags",
    description:
      "Region, language, script, currency, and calendar codes into their localized names — decorated with country flags. Any Intl locale.",
    tags: ["flags", "displaynames", "i18n", "ssr"],
    npm: "https://www.npmjs.com/package/anyaround",
    site: "https://anyaround.vercel.app",
    Example: AroundExample,
  },
];

function ExtLink({ href, label, accent }: { href: string; label: string; accent: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ borderColor: `${accent}44` }}
      className="rounded-md border px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-white/50 transition-colors hover:text-white/90"
    >
      {label} ↗
    </a>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-24">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 pt-24 pb-16 text-center sm:pt-28">
        <h1 className="font-mono text-4xl font-bold tracking-tight text-white sm:text-6xl">
          the{" "}
          <span
            className="text-white/40"
            style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
          >
            any
          </span>
          <span className="text-violet-300">*</span> family
        </h1>
        <p className="max-w-xl text-sm text-white/45 sm:text-base">
          Micro, zero-dependency tools built on native{" "}
          <code className="font-mono text-white/70">Intl</code>. No data files, no
          config — just one function each, in any locale. Try them live below.
        </p>
      </header>

      {/* Package rows */}
      <section className="relative z-10">
        {PACKAGES.map((p) => {
          const Example = p.Example;
          return (
            <article
              key={p.id}
              className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.012]"
            >
              <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[220px_1fr] md:gap-12 md:px-10 md:py-16">
                {/* Left: logo */}
                <div className="flex flex-col items-start gap-4">
                  <FamilyLogo suffix={p.suffix} accent={p.accent} className="h-auto w-40" />
                  <span
                    className="font-mono text-xs lowercase tracking-widest"
                    style={{ color: `${p.accent}bb` }}
                  >
                    {p.tagline}
                  </span>
                </div>

                {/* Right: content */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="font-mono text-2xl font-bold text-white">{p.id}</h2>
                    <div className="flex items-center gap-2">
                      <ExtLink href={p.site} label="site" accent={p.accent} />
                      <ExtLink href={p.npm} label="npm" accent={p.accent} />
                    </div>
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>

                  <div className="mt-1 max-w-2xl rounded-xl border border-white/[0.07] bg-black/30 p-4">
                    <Example accent={p.accent} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pt-16 text-center md:px-10">
        <p className="font-mono text-[11px] text-white/30">
          native Intl. zero data. any locale. ·{" "}
          <a
            href="https://github.com/kirilinsky"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/45 transition-colors hover:text-white/70"
          >
            github.com/kirilinsky
          </a>
        </p>
      </footer>
    </main>
  );
}
