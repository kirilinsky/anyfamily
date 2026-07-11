import { FamilyLogo } from "@/components/family-logo";
import { Tag } from "@/components/ui";
import {
  CodeAnimation,
  type Preset,
  AROUND_PRESETS,
  AMOUNT_PRESETS,
  WHEN_PRESETS,
  MANY_PRESETS,
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
  presets: Preset[];
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
    presets: WHEN_PRESETS,
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
    presets: AMOUNT_PRESETS,
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
    presets: MANY_PRESETS,
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
    presets: AROUND_PRESETS,
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
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-[#0a0a0a] [scrollbar-width:none]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen snap-start flex-col items-center justify-center px-6 text-center">
        <h1 className="font-mono text-5xl font-bold tracking-tight text-white sm:text-7xl">
          the{" "}
          <span
            className="text-white/40"
            style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
          >
            any
          </span>
          <span className="text-violet-300">*</span> family
        </h1>
        <p className="mt-6 max-w-xl text-sm text-white/45 sm:text-base">
          Micro, zero-dependency tools built on native{" "}
          <code className="font-mono text-white/70">Intl</code>. No data files, no
          config — just one function each, in any locale.
        </p>
        <div className="mt-16 flex flex-col items-center gap-2 text-white/30">
          <span className="font-mono text-xs uppercase tracking-widest">scroll</span>
          <span className="animate-bounce text-lg">↓</span>
        </div>
      </section>

      {/* One full-screen section per package */}
      {PACKAGES.map((p) => (
        <section
          key={p.id}
          id={p.id}
          className="relative z-10 flex min-h-screen snap-start items-center px-6 py-16 md:px-10"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
            {/* Left: identity */}
            <div className="flex flex-col items-start gap-5">
              <FamilyLogo suffix={p.suffix} accent={p.accent} className="h-auto w-48" />
              <span
                className="font-mono text-sm lowercase tracking-widest"
                style={{ color: `${p.accent}cc` }}
              >
                {p.tagline}
              </span>
              <p className="max-w-sm text-sm leading-relaxed text-white/55">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <ExtLink href={p.site} label="site" accent={p.accent} />
                <ExtLink href={p.npm} label="npm" accent={p.accent} />
              </div>
            </div>

            {/* Right: live typing demo */}
            <div className="flex justify-start md:justify-center">
              <CodeAnimation fn={p.id} accent={p.accent} presets={p.presets} />
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <section className="relative z-10 flex min-h-[40vh] snap-start items-center justify-center px-6 text-center">
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
      </section>
    </main>
  );
}
