import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnyaroundDemo } from "./anyaround-demo";

const pkg = getPackage("anyaround");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anyaround — region & language names with flags, any locale",
  description:
    "Interactive demo: region, language, script, currency and calendar codes into their localized names, decorated with country flags. One function over Intl.DisplayNames.",
  keywords: [
    "displaynames",
    "country flags",
    "region names",
    "language names",
    "script",
    "currency names",
    "intl",
    "i18n",
    "localization",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anyaround — region & language names with flags, any locale",
    description:
      "Any region, language, script, currency or calendar code to its localized name, with flags. One call over Intl.DisplayNames.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyaround — region & language names with flags, any locale",
    description:
      "Codes to localized names, with country flags, over Intl.DisplayNames. Try it live.",
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

export default function AnyaroundPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-44 opacity-90">
        <AnyaroundDemo />
      </DemoShell>
    </>
  );
}
