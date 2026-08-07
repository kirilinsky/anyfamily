import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnylocaleDemo } from "./anylocale-demo";

const pkg = getPackage("anylocale");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anylocale — text direction, week start and locale facts",
  description:
    "Interactive demo: ask any locale how it behaves — RTL or LTR, first day of the week, weekend days, calendars, time zones, hour cycle and digits. One function over Intl.Locale info.",
  keywords: [
    "rtl detection",
    "text direction",
    "first day of week",
    "week start",
    "weekend",
    "locale info",
    "intl locale",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anylocale — text direction, week start and locale facts",
    description:
      "Ask a locale how it behaves: direction, week start, weekend, calendars, time zones. One call over native Intl.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anylocale — text direction, week start and locale facts",
    description:
      "RTL detection and first-day-of-week without a hand-kept table. Try it live.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: pkg.id,
  description: pkg.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url,
  downloadUrl: pkg.npm,
  codeRepository: pkg.github,
  programmingLanguage: "TypeScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "kirilinsky" },
  isPartOf: { "@type": "CreativeWork", name: "any family", url: BASE_URL },
};

export default function AnylocalePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-44 opacity-90">
        <AnylocaleDemo />
      </DemoShell>
    </>
  );
}
