import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnyamountDemo } from "./anyamount-demo";

const pkg = getPackage("anyamount");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anyamount — numbers, currency & units for any locale",
  description:
    "Interactive demo: compact notation for big numbers, currency, and sanctioned units. One function, three modes, any locale, over Intl.NumberFormat.",
  keywords: [
    "number formatting",
    "currency",
    "units",
    "compact notation",
    "numberformat",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anyamount — numbers, currency & units for any locale",
    description:
      "Compact numbers, currency and units in any locale. One call over Intl.NumberFormat.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyamount — numbers, currency & units for any locale",
    description:
      "Compact numbers, currency and units over Intl.NumberFormat. Try it live.",
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

export default function AnyamountPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-44 opacity-90">
        <AnyamountDemo />
      </DemoShell>
    </>
  );
}
