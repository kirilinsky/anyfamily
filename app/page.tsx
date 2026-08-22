import Link from "next/link";

import { CyclingLogo } from "@/components/cycling-logo";
import { FamilyLogo } from "@/components/family-logo";
import { InstallChip } from "@/components/install-chip";
import { SectionNav } from "@/components/section-nav";
import { Tag } from "@/components/ui";
import versions from "@/data/versions.json";
import colors from "@/data/colors.json";
import { BASE_URL, PACKAGES, demoHref, type Pkg } from "@/lib/packages";
import {
  CodeAnimation,
  type Preset,
  AROUND_PRESETS,
  AMOUNT_PRESETS,
  WHEN_PRESETS,
  MANY_PRESETS,
  LONG_PRESETS,
  PLURAL_PRESETS,
  WORD_PRESETS,
  LOCALE_PRESETS,
  FAMILY_PRESETS,
  REACT_PRESETS,
} from "@/components/examples";

/**
 * Demo presets live in a client module, so they are joined onto the shared
 * registry here by id rather than stored in `lib/packages.ts` (which server
 * code — metadata, sitemap — imports too).
 */
const PRESETS_BY_ID: Record<string, Preset[]> = {
  anywhen: WHEN_PRESETS,
  anyamount: AMOUNT_PRESETS,
  anymany: MANY_PRESETS,
  anyaround: AROUND_PRESETS,
  anylong: LONG_PRESETS,
  anyplural: PLURAL_PRESETS,
  anyword: WORD_PRESETS,
  anylocale: LOCALE_PRESETS,
};

const LINK_CLASS =
  "rounded-lg border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] lowercase tracking-wide text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/90";

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
      className={LINK_CLASS}
    >
      {label} ↗
    </a>
  );
}

/**
 * The demo button. Ported packages route inside this app; the rest still point
 * at their standalone site and keep the external arrow until they move.
 */
function DemoLink({ pkg }: { pkg: Pkg }) {
  const href = demoHref(pkg);
  if (pkg.legacySite) {
    return <ExtLink href={href} label="demo" accent={pkg.accent} />;
  }
  return (
    <Link
      href={href}
      style={{ borderColor: `${pkg.accent}44` }}
      className={LINK_CLASS}
    >
      demo →
    </Link>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
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
        "The whole any* family in one install — anywhen, anyamount, anymany, anyaround, anylong, anyplural, anyword and anylocale behind a single import.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: BASE_URL,
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
        "React hooks for the any* family — useAnywhen, useAnyamount, useAnymany, useAnyaround, useAnylong, useAnyplural, useAnyword and useAnylocale, sharing one locale provider.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: BASE_URL,
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
          url: p.legacySite ?? `${BASE_URL}/${p.id}`,
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
          { id: "main", label: "the family", accent: "#d6b3e2" },
          ...PACKAGES.map((p) => ({
            id: p.id,
            label: p.id,
            accent: p.accent,
          })),
          { id: "anyfamily", label: "anyfamily", accent: colors.anyfamily },
          {
            id: "anyfamily-react",
            label: "anyfamily-react",
            accent: colors["anyfamily-react"],
          },
        ]}
      />

      <section
        id="main"
        className="relative z-10 flex min-h-dvh snap-start flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="sr-only">the any family</h1>
        <CyclingLogo className="w-56 sm:w-[26rem] lg:w-[32rem]" />

        <p className="mt-8 max-w-lg text-sm text-white/45 sm:mt-12 sm:text-base">
          Eight tools, zero dependencies — because the dependency is your
          browser.{" "}
          <span className="text-white/70">One function each, any locale.</span>
        </p>

        {/* Each badge carries its package's accent and jumps to its section, so
            the list doubles as the page's table of contents. */}
        <div className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-12 sm:gap-2.5">
          {PACKAGES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              title={p.id}
              style={{ borderColor: `${p.accent}33`, color: `${p.accent}cc` }}
              className="rounded-full border bg-white/[0.02] px-3.5 py-1.5 font-mono text-[11px] lowercase transition-colors hover:bg-white/[0.06] sm:px-4 sm:py-2 sm:text-xs"
            >
              {p.tagline}
            </a>
          ))}
        </div>
      </section>

      {/* One full-screen section per package */}
      {PACKAGES.map((p) => (
        <section
          key={p.id}
          id={p.id}
          className="relative z-10 flex min-h-dvh snap-start items-center px-5 py-6 md:px-10 md:py-16"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,318px)_1fr] md:gap-16">
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
                <DemoLink pkg={p} />
                <ExtLink href={p.npm} label="npm" accent={p.accent} />
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
              <CodeAnimation fn={p.id} accent={p.accent} presets={PRESETS_BY_ID[p.id]} />
              <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                <DemoLink pkg={p} />
                <ExtLink href={p.npm} label="npm" accent={p.accent} />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* anyfamily — the 6-in-1 meta-package, closing the tour */}
      <section
        id="anyfamily"
        className="relative z-10 flex min-h-dvh snap-start items-center px-5 py-6 md:px-10 md:py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,318px)_1fr] md:gap-16">
          {/* Left: identity */}
          <div className="flex flex-col items-start gap-3 md:gap-5">
            <h2 className="sr-only">
              anyfamily — all eight any* packages in one install: anywhen,
              anyamount, anymany, anyaround, anylong, anyplural, anyword and
              anylocale behind a single import.
            </h2>
            <FamilyLogo
              suffix="family"
              accent={colors.anyfamily}
              className="h-auto w-32 sm:w-40 md:w-48"
            />
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              One install, all eight — named re-exports, fully typed,
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
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 md:grid-cols-[minmax(0,318px)_1fr] md:gap-16">
          {/* Left: identity */}
          <div className="flex flex-col items-start gap-3 md:gap-5">
            <h2 className="sr-only">
              anyfamily-react — React hooks for the any* family: useAnywhen,
              useAnyamount, useAnymany, useAnyaround, useAnylong, useAnyplural
              and useAnyword, sharing one locale provider.
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
                href="https://github.com/kirilinsky/anyfamily"
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
                href="https://github.com/kirilinsky/anyfamily"
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
