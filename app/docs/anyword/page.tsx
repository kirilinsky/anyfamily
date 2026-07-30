import type { Metadata } from "next";

import { BASE_URL } from "@/lib/packages";
import { DocsClient } from "./docs-client";

const url = `${BASE_URL}/docs/anyword`;

export const metadata: Metadata = {
  title: "anyword docs — API reference",
  description:
    "API reference for anyword, a micro Intl text segmenter. Word, grapheme and sentence granularity, parts with offsets, emoji-safe counting and truncation, locales and SSR.",
  openGraph: {
    type: "article",
    url,
    title: "anyword docs — API reference",
    description:
      "API reference for anyword: split, count and truncate text by word, grapheme or sentence with native Intl.Segmenter.",
    siteName: "anyfamily",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyword docs — API reference",
    description:
      "Split, count and truncate text by word, grapheme or sentence with native Intl.Segmenter.",
  },
  alternates: { canonical: url },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "anyword API reference",
  description:
    "API reference for anyword: word, grapheme and sentence granularity, segment offsets, emoji-safe counting and truncation, locales and SSR.",
  url,
  author: { "@type": "Person", name: "kirilinsky" },
  about: {
    "@type": "SoftwareApplication",
    name: "anyword",
    url: `${BASE_URL}/anyword`,
  },
};

export default function AnywordDocsPage() {
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
