import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnylongDemo } from "./anylong-demo";

const pkg = getPackage("anylong");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anylong — duration formatting for any locale",
  description:
    "Interactive demo: a number, two Dates, an ISO 8601 string, shorthand or a duration record into a localized string. One function over Intl.DurationFormat, zero dependencies.",
  keywords: [
    "duration",
    "durationformat",
    "elapsed time",
    "iso 8601",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anylong — duration formatting for any locale",
    description:
      "Any duration in, a localized string out. One call over Intl.DurationFormat.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anylong — duration formatting for any locale",
    description:
      "Any duration in, a localized string out, over Intl.DurationFormat. Try it live.",
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

export default function AnylongPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-36 opacity-90">
        <AnylongDemo />
      </DemoShell>
    </>
  );
}
