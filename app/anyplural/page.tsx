import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnypluralDemo } from "./anyplural-demo";

const pkg = getPackage("anyplural");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anyplural — cardinal & ordinal plurals for any locale",
  description:
    "Interactive demo: any count into its correct plural form, cardinal or ordinal, in any locale. One function over Intl.PluralRules — no rule tables, zero dependencies.",
  keywords: [
    "plural",
    "pluralization",
    "pluralrules",
    "ordinal",
    "cardinal",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anyplural — cardinal & ordinal plurals for any locale",
    description:
      "Any count into its correct plural form, cardinal or ordinal, in any locale. One call over Intl.PluralRules.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyplural — cardinal & ordinal plurals for any locale",
    description:
      "Correct plural forms in any locale over Intl.PluralRules. Try it live.",
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

export default function AnypluralPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-44 opacity-90">
        <AnypluralDemo />
      </DemoShell>
    </>
  );
}
