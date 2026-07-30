import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anywhen`;

export const metadata: Metadata = {
  title: "anywhen docs — API reference",
  description:
    "API reference for anywhen, a tiny Intl date formatter. Smart, absolute and relative modes, thresholds, parts, time zones, input types, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anywhen docs — API reference",
    description:
      "API reference for anywhen: smart, absolute and relative date formatting over native Intl.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anywhen docs — API reference",
    description:
      "Smart, absolute and relative date formatting over native Intl.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anywhen API reference",
  description:
    "API reference for anywhen: modes, options, thresholds, parts, time zones, input types, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anywhen",
    url: `${BASE_URL}/anywhen`,
  },
};

export default function AnywhenDocsPage() {
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
