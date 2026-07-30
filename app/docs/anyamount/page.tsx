import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anyamount`;

export const metadata: Metadata = {
  title: "anyamount docs — API reference",
  description:
    "API reference for anyamount, a tiny Intl number formatter. Smart, currency and unit modes, currency symbols, sanctioned units, parts, digits, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anyamount docs — API reference",
    description:
      "API reference for anyamount: compact numbers, currency and units over Intl.NumberFormat.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyamount docs — API reference",
    description: "Compact numbers, currency and units over Intl.NumberFormat.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anyamount API reference",
  description:
    "API reference for anyamount: modes, options, currency symbols, sanctioned units, parts, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyamount",
    url: `${BASE_URL}/anyamount`,
  },
};

export default function AnyamountDocsPage() {
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
