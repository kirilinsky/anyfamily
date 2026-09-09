import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";
import { LIMITATIONS } from "./limitations";
import { lastModified } from "@/lib/site-content";

const url = `${BASE_URL}/docs/anylong`;

export const metadata: Metadata = {
  title: "anylong docs — API reference",
  description:
    "API reference for anylong, a micro Intl duration formatter. Milliseconds, Dates, ISO 8601, shorthand and duration records, styles, unit clamping, parts, locales and the support flag.",
  openGraph: {
    type: "article",
    url,
    title: "anylong docs — API reference",
    description:
      "API reference for anylong: any duration in, a localized string out, over Intl.DurationFormat.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anylong docs — API reference",
    description:
      "Any duration in, a localized string out, over Intl.DurationFormat.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  dateModified: lastModified().toISOString(),
  headline: "anylong API reference",
  description:
    "API reference for anylong: input kinds, styles, unit clamping, parts, locales, the support flag and compatibility.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anylong",
    url: `${BASE_URL}/anylong`,
  },
};

/** The limitations, as the questions they answer — the part of a reference a search result can quote. */
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LIMITATIONS.map(({ title, body }) => ({
    "@type": "Question",
    name: title,
    acceptedAnswer: { "@type": "Answer", text: body },
  })),
};

export default function AnylongDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <DocsClient />
    </>
  );
}
