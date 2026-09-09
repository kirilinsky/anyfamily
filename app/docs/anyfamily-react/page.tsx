import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";
import { LIMITATIONS } from "./limitations";
import { lastModified } from "@/lib/site-content";

const url = `${BASE_URL}/docs/anyfamily-react`;

export const metadata: Metadata = {
  title: "anyfamily-react docs — API reference",
  description:
    "API reference for anyfamily-react, the any* family as React hooks. AnyfamilyProvider, one shared locale, self-ticking relative time, memoized results, support flags, SSR and Next.js.",
  openGraph: {
    type: "article",
    url,
    title: "anyfamily-react docs — API reference",
    description:
      "API reference for anyfamily-react: every any* formatter as a hook, sharing one locale provider.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyfamily-react docs — API reference",
    description:
      "Every any* formatter as a React hook, sharing one locale provider.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  dateModified: lastModified().toISOString(),
  headline: "anyfamily-react API reference",
  description:
    "API reference for anyfamily-react: the provider, every hook, locale resolution, ticking, memoization, support flags, types and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyfamily-react",
    url: `${BASE_URL}/#anyfamily-react`,
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

export default function AnyfamilyReactDocsPage() {
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
