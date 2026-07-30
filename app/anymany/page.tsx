import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnymanyDemo } from "./anymany-demo";

const pkg = getPackage("anymany");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anymany — localized list formatting for any locale",
  description:
    "Interactive demo: sort and join string arrays the way each locale expects. Conjunction, disjunction and unit lists over Intl.ListFormat, with collator sorting and overflow.",
  keywords: [
    "list",
    "listformat",
    "join",
    "collator",
    "sort",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anymany — localized list formatting for any locale",
    description:
      "Sort and join string arrays the way each locale expects. One call over Intl.ListFormat.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anymany — localized list formatting for any locale",
    description:
      "Sort and join string arrays per locale, over Intl.ListFormat. Try it live.",
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

export default function AnymanyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-36 opacity-90">
        <AnymanyDemo />
      </DemoShell>
    </>
  );
}
