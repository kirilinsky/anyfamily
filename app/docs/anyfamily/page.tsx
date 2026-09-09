import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";
import { LIMITATIONS } from "./limitations";
import { lastModified } from "@/lib/site-content";

const url = `${BASE_URL}/docs/anyfamily`;

export const metadata: Metadata = {
  title: "anyfamily docs — API reference",
  description:
    "API reference for anyfamily, the whole any* family in one install. The eight exports and where each one's reference lives, the shared shape, tree-shaking and bundle cost, versioning, support flags and types.",
  openGraph: {
    type: "article",
    url,
    title: "anyfamily docs — API reference",
    description:
      "API reference for anyfamily: eight micro Intl tools behind one import — what it exports, what it costs, how it is versioned.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyfamily docs — API reference",
    description: "Eight micro Intl tools behind one import.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  dateModified: lastModified().toISOString(),
  headline: "anyfamily API reference",
  description:
    "API reference for anyfamily: the eight exports, the shared shape, bundle cost and tree-shaking, versioning, support flags and re-exported types.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyfamily",
    url: `${BASE_URL}/#anyfamily`,
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

export default function AnyfamilyDocsPage() {
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
