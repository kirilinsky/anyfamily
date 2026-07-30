import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnywhenDemo } from "./anywhen-demo";

const pkg = getPackage("anywhen");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anywhen — dates & relative time for any locale",
  description:
    "Interactive demo: relative when near, calendar labels for recent days, absolute when far. One function over Intl.DateTimeFormat and Intl.RelativeTimeFormat, zero dependencies.",
  keywords: [
    "date formatting",
    "relative time",
    "datetimeformat",
    "relativetimeformat",
    "timeago",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anywhen — dates & relative time for any locale",
    description:
      "Relative when near, absolute when far. One call over native Intl date formatting.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anywhen — dates & relative time for any locale",
    description:
      "Relative when near, absolute when far, in any locale. Try it live.",
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

export default function AnywhenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-36 opacity-90">
        <AnywhenDemo />
      </DemoShell>
    </>
  );
}
