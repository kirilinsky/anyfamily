import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anyplural`;

export const metadata: Metadata = {
  title: "anyplural docs — API reference",
  description:
    "API reference for anyplural, a micro Intl plural formatter. Cardinal and ordinal rules, CLDR categories, the zero form, number formatting, parts, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anyplural docs — API reference",
    description:
      "API reference for anyplural: correct plural forms in any locale over Intl.PluralRules.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyplural docs — API reference",
    description: "Correct plural forms in any locale over Intl.PluralRules.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anyplural API reference",
  description:
    "API reference for anyplural: cardinal and ordinal rules, CLDR categories, the zero form, number formatting, parts, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyplural",
    url: `${BASE_URL}/anyplural`,
  },
};

export default function AnypluralDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsClient />
    </>
  );
}
