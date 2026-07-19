import { FamilyLogo } from "@/components/family-logo";
import { InstallChip } from "@/components/install-chip";
import { SectionNav } from "@/components/section-nav";
import { Tag } from "@/components/ui";
import versions from "@/data/versions.json";
import colors from "@/data/colors.json";
import {
  CodeAnimation,
  type Preset,
  AROUND_PRESETS,
  AMOUNT_PRESETS,
  WHEN_PRESETS,
  MANY_PRESETS,
  LONG_PRESETS,
  FAMILY_PRESETS,
  REACT_PRESETS,
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
  github: string;
  presets: Preset[];
  navLabel: string;
};

const PACKAGES: Pkg[] = [
  {
    id: "anywhen",
    suffix: "when",
    accent: colors.anywhen,
    tagline: "dates & times",
    description:
      "Dates and times into localized strings and relative phrasing. Built on native Intl, no data files.",
    tags: ["dates", "datetimeformat", "relative"],
    npm: "https://www.npmjs.com/package/anywhen",
    site: "https://anywhen-kappa.vercel.app",
    github: "https://github.com/kirilinsky/anywhen",
    presets: WHEN_PRESETS,
    navLabel: "a | w",
  },
  {
    id: "anyamount",
    suffix: "amount",
    accent: colors.anyamount,
    tagline: "money & numbers",
    description:
      "Numbers, currency, and units into localized, human-readable strings. One function, three modes, any locale.",
    tags: ["currency", "numberformat", "units"],
    npm: "https://www.npmjs.com/package/anyamount",
    site: "https://anyamount.vercel.app",
    github: "https://github.com/kirilinsky/anyamount",
    presets: AMOUNT_PRESETS,
    navLabel: "a | a",
  },
  {
    id: "anymany",
    suffix: "many",
    accent: colors.anymany,
    tagline: "lists",
    description:
      "String arrays into localized lists — sort and join in any locale with the native list formatter.",
    tags: ["lists", "listformat", "sort"],
    npm: "https://www.npmjs.com/package/anymany",
    site: "https://anymany.vercel.app",
    github: "https://github.com/kirilinsky/anymany",
    presets: MANY_PRESETS,
    navLabel: "a | m",
  },
  {
    id: "anyaround",
    suffix: "around",
    accent: colors.anyaround,
    tagline: "names & flags",
    description:
      "Region, language, script, currency, and calendar codes into their localized names — decorated with country flags. Any Intl locale.",
    tags: ["flags", "displaynames", "ssr"],
    npm: "https://www.npmjs.com/package/anyaround",
    site: "https://anyaround.vercel.app",
    github: "https://github.com/kirilinsky/anyaround",
    presets: AROUND_PRESETS,
    navLabel: "a | r",
  },
  {
    id: "anylong",
    suffix: "long",
    accent: colors.anylong,
    tagline: "durations",
    description:
      "Any duration in — a number, two Dates, an ISO 8601 string, shorthand, or a duration record — into a localized string. One function over Intl.DurationFormat.",
    tags: ["duration", "durationformat", "elapsed"],
    npm: "https://www.npmjs.com/package/anylong",
    site: "https://anylong.vercel.app",
    github: "https://github.com/kirilinsky/anylong",
    navLabel: "a | l",
    presets: LONG_PRESETS,
  },
];

function ExtLink({
  href,
  label,
  accent,
}: {
  href: string;
  label: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ borderColor: `${accent}44` }}
      className="rounded-lg border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/90"
    >
      {label} ↗
    </a>
  );
}

const BASE = "https://anyfamily.site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "anyfamily",
      description:
        "The any* family: micro, zero-dependency JavaScript tools built on native Intl.",
      inLanguage: "en",
      author: {
        "@type": "Person",
        name: "kirilinsky",
        url: "https://github.com/kirilinsky",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "anyfamily",
      description:
        "The whole any* family in one install — anywhen, anyamount, anymany and anyaround behind a single import.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: BASE,
      softwareVersion:
        (versions as Record<string, string>)["anyfamily"] || undefined,
      programmingLanguage: "TypeScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "kirilinsky" },
    },
    {
      "@type": "SoftwareApplication",
      name: "anyfamily-react",
      description:
        "React hooks for the any* family — useAnywhen, useAnyamount, useAnymany, useAnyaround and useAnylong, sharing one locale provider.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: BASE,
      softwareVersion:
        (versions as Record<string, string>)["anyfamily-react"] || undefined,
      programmingLanguage: "TypeScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "kirilinsky" },
    },
    {
      "@type": "ItemList",
      name: "The any* family of Intl tools",
      itemListElement: PACKAGES.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "SoftwareApplication",
          name: p.id,
          description: p.description,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          url: p.site,
          softwareVersion:
            (versions as Record<string, string>)[p.id] || undefined,
          programmingLanguage: "TypeScript",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: "kirilinsky" },
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-scroll bg-[#0a0a0a] [scrollbar-width:none]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <SectionNav
        items={[
          { id: "hero", label: "hero", accent: "#d6b3e2" },
          ...PACKAGES.map((p) => ({
            id: p.id,
            label: p.navLabel,
            accent: p.accent,
          })),
          { id: "anyfamily", label: "a | f", accent: colors.anyfamily },
          {
            id: "anyfamily-react",
            label: "a | rx",
            accent: colors["anyfamily-react"],
          },
        ]}
      />

      <section
        id="hero"
        className="relative z-10 flex min-h-dvh snap-start flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="sr-only">the any family</h1>
        <FamilyLogo
          suffix="family"
          accent={colors.anyfamily}
          mark="bar"
          className="h-auto w-56 sm:w-[26rem] lg:w-[32rem]"
        />
        <p className="mt-4 max-w-xl text-sm text-white/45 sm:mt-6 sm:text-base">
          Five formatters, zero dependencies — because the dependency is your
          browser. Dates, money, lists, names, durations:{" "}
          <span className="text-white/70">one function each, any locale</span>.
        </p>
        <div className="mt-10 flex h-9 w-5 justify-center rounded-full border border-white/15 pt-2 sm:mt-16">
          <span className="animate-scroll-cue-dot h-1.5 w-1 rounded-full bg-white/50" />
        </div>
      </section>

      {/* One full-screen section per package */}
      {PACKAGES.map((p) => (
        <section
          key={p.id}
          id={p.id}
          className="relative z-10 flex min-h-dvh snap-start items-center px-5 py-6 md:px-10 md:py-16"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
            {/* Left: identity */}
            <div className="flex flex-col items-start gap-3 md:gap-5">
              <h2 className="sr-only">
                {p.id} — {p.tagline}: {p.description}
              </h2>
              <FamilyLogo
                suffix={p.suffix}
                accent={p.accent}
                className="h-auto w-32 sm:w-40 md:w-48"
              />
              <p className="max-w-sm text-sm leading-relaxed text-white/55">
                {p.description}
              </p>
              <div className="mt-1 hidden md:block">
                <InstallChip command={`npm i ${p.id}`} accent={p.accent} />
              </div>
              <div className="mt-1 hidden flex-wrap items-center gap-2 md:flex">
                <ExtLink href={p.site} label="demo" accent={p.accent} />
                <ExtLink href={p.npm} label="npm" accent={p.accent} />
                <ExtLink href={p.github} label="github" accent={p.accent} />
              </div>
            </div>

            {/* Right: tagline + version + tags above the live typing demo */}
            <div className="flex flex-col items-start gap-2 md:gap-4">
              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-sm lowercase tracking-widest"
                    style={{ color: `${p.accent}cc` }}
                  >
                    {p.tagline}
                  </span>
                  {(versions as Record<string, string>)[p.id] && (
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-white/50"
                      style={{ borderColor: `${p.accent}44` }}
                    >
                      v{(versions as Record<string, string>)[p.id]}
                    </span>
                  )}
                </div>
                <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto [scrollbar-width:none] md:flex-wrap md:gap-2 md:overflow-visible">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
              <CodeAnimation fn={p.id} accent={p.accent} presets={p.presets} />
              <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                <ExtLink href={p.site} label="demo" accent={p.accent} />
                <ExtLink href={p.npm} label="npm" accent={p.accent} />
                <ExtLink href={p.github} label="github" accent={p.accent} />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* anyfamily — the 5-in-1 meta-package, closing the tour */}
      <section
        id="anyfamily"
        className="relative z-10 flex min-h-dvh snap-start items-center px-5 py-6 md:px-10 md:py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
          {/* Left: identity */}
          <div className="flex flex-col items-start gap-3 md:gap-5">
            <h2 className="sr-only">
              anyfamily — all five any* packages in one install: anywhen,
              anyamount, anymany, anyaround and anylong behind a single import.
            </h2>
            <FamilyLogo
              suffix="family"
              accent={colors.anyfamily}
              className="h-auto w-32 sm:w-40 md:w-48"
            />
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              One install, all five — named re-exports, fully typed,
              tree-shakeable.
            </p>
            <div className="mt-1">
              <InstallChip
                command="npm i anyfamily"
                accent={colors.anyfamily}
              />
            </div>
            <div className="mt-1 hidden flex-wrap items-center gap-2 md:flex">
              <ExtLink
                href="https://www.npmjs.com/package/anyfamily"
                label="npm"
                accent={colors.anyfamily}
              />
              <ExtLink
                href="https://github.com/kirilinsky/anyfamily"
                label="github"
                accent={colors.anyfamily}
              />
            </div>
          </div>

          {/* Right: tagline + version above the live typing demo */}
          <div className="flex flex-col items-start gap-2 md:gap-4">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-sm lowercase tracking-widest"
                style={{ color: `${colors.anyfamily}cc` }}
              >
                all at once
              </span>
              {(versions as Record<string, string>)["anyfamily"] && (
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-white/50"
                  style={{ borderColor: `${colors.anyfamily}44` }}
                >
                  v{(versions as Record<string, string>)["anyfamily"]}
                </span>
              )}
            </div>
            <CodeAnimation
              fn="anyfamily"
              accent={colors.anyfamily}
              presets={FAMILY_PRESETS}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
              <ExtLink
                href="https://www.npmjs.com/package/anyfamily"
                label="npm"
                accent={colors.anyfamily}
              />
              <ExtLink
                href="https://github.com/kirilinsky/anyfamily"
                label="github"
                accent={colors.anyfamily}
              />
            </div>
          </div>
        </div>
      </section>

      {/* anyfamily-react — hooks for the family, closing the tour */}
      <section
        id="anyfamily-react"
        className="relative z-10 flex min-h-dvh snap-start items-center px-5 py-6 md:px-10 md:py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
          {/* Left: identity */}
          <div className="flex flex-col items-start gap-3 md:gap-5">
            <h2 className="sr-only">
              anyfamily-react — React hooks for the any* family: useAnywhen,
              useAnyamount, useAnymany, useAnyaround and useAnylong, sharing
              one locale provider.
            </h2>
            <FamilyLogo
              suffix="react"
              accent={colors["anyfamily-react"]}
              className="h-auto w-32 sm:w-40 md:w-48"
            />
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Every any* formatter as a hook — one locale provider, and
              relative time that keeps itself fresh.
            </p>
            <div className="mt-1">
              <InstallChip
                command="npm i anyfamily-react"
                accent={colors["anyfamily-react"]}
              />
            </div>
            <div className="mt-1 hidden flex-wrap items-center gap-2 md:flex">
              <ExtLink
                href="https://www.npmjs.com/package/anyfamily-react"
                label="npm"
                accent={colors["anyfamily-react"]}
              />
              <ExtLink
                href="https://github.com/kirilinsky/anyfamily/tree/main/packages/anyfamily-react"
                label="github"
                accent={colors["anyfamily-react"]}
              />
            </div>
          </div>

          {/* Right: tagline + version above the live typing demo */}
          <div className="flex flex-col items-start gap-2 md:gap-4">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-sm lowercase tracking-widest"
                style={{ color: `${colors["anyfamily-react"]}cc` }}
              >
                hooks for the family
              </span>
              {(versions as Record<string, string>)["anyfamily-react"] && (
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-white/50"
                  style={{ borderColor: `${colors["anyfamily-react"]}44` }}
                >
                  v{(versions as Record<string, string>)["anyfamily-react"]}
                </span>
              )}
            </div>
            <CodeAnimation
              fn="useAnywhen"
              accent={colors["anyfamily-react"]}
              presets={REACT_PRESETS}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
              <ExtLink
                href="https://www.npmjs.com/package/anyfamily-react"
                label="npm"
                accent={colors["anyfamily-react"]}
              />
              <ExtLink
                href="https://github.com/kirilinsky/anyfamily/tree/main/packages/anyfamily-react"
                label="github"
                accent={colors["anyfamily-react"]}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
