import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anyaround`;

export const metadata: Metadata = {
  title: "anyaround docs — API reference",
  description:
    "API reference for anyaround, a micro Intl locale display. Smart mode detection, region/language/script/currency/calendar names, emoji flags, structured info, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anyaround docs — API reference",
    description:
      "API reference for anyaround: codes to localized names with country flags, over Intl.DisplayNames.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyaround docs — API reference",
    description:
      "Codes to localized names with country flags, over Intl.DisplayNames.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anyaround API reference",
  description:
    "API reference for anyaround: modes, display shapes, flags, fallback behaviour, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyaround",
    url: `${BASE_URL}/anyaround`,
  },
};

export default function AnyaroundDocsPage() {
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
