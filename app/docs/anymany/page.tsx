import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anymany`;

export const metadata: Metadata = {
  title: "anymany docs — API reference",
  description:
    "API reference for anymany, a micro Intl list formatter. Conjunction, disjunction and unit lists, collator sorting, max with overflow, parts, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anymany docs — API reference",
    description:
      "API reference for anymany: sort and join string arrays the way each locale expects, over Intl.ListFormat.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anymany docs — API reference",
    description:
      "Sort and join string arrays the way each locale expects, over Intl.ListFormat.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anymany API reference",
  description:
    "API reference for anymany: list types and styles, collator sorting, max with overflow, parts, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anymany",
    url: `${BASE_URL}/anymany`,
  },
};

export default function AnymanyDocsPage() {
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
