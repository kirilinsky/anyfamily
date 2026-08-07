import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anylocale`;

export const metadata: Metadata = {
  title: "anylocale docs — API reference",
  description:
    "API reference for anylocale, a micro Intl locale-info reader. Text direction, first day of the week, weekend days, calendars, time zones, hour cycles, numbering systems, fallback chains and the support flag.",
  openGraph: {
    type: "article",
    url,
    title: "anylocale docs — API reference",
    description:
      "API reference for anylocale: ask a locale how it behaves, over native Intl.Locale info.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anylocale docs — API reference",
    description: "Ask a locale how it behaves, over native Intl.Locale info.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anylocale API reference",
  description:
    "API reference for anylocale: fields, ISO week numbering, fallback chains, the support flag and compatibility.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anylocale",
    url: `${BASE_URL}/anylocale`,
  },
};

export default function AnylocaleDocsPage() {
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
