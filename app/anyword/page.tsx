import type { Metadata } from "next";

import { DemoShell } from "@/components/demo-shell";
import { BASE_URL, getPackage } from "@/lib/packages";
import { AnywordDemo } from "./anyword-demo";

const pkg = getPackage("anyword");
const url = `${BASE_URL}/${pkg.id}`;

export const metadata: Metadata = {
  title: "anyword — text segmentation for any locale",
  description:
    "Interactive demo: split, count and truncate text by word, grapheme or sentence with native Intl.Segmenter. Emoji-safe, no data files, zero dependencies.",
  keywords: [
    "text segmentation",
    "word count",
    "grapheme",
    "truncate",
    "intl segmenter",
    "i18n",
    "emoji",
    "unicode",
    "cjk",
  ],
  openGraph: {
    type: "website",
    url,
    title: "anyword — text segmentation for any locale",
    description:
      "Words, graphemes and sentences, emoji-safe counting and truncation, any locale via native Intl.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyword — text segmentation for any locale",
    description:
      "Emoji-safe counting and truncation via native Intl.Segmenter. Try it live.",
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

export default function AnywordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DemoShell pkg={pkg} logoClassName="h-auto w-36 opacity-90">
        <AnywordDemo />
      </DemoShell>
    </>
  );
}
