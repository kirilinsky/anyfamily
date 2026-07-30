import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";
import { baseUrl, ogImage } from "../site";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for anyword, a micro Intl text segmenter. Word, grapheme and sentence granularity, parts with offsets, emoji-safe counting and truncation, locales and SSR.",
  openGraph: {
    type: "article",
    url: `${baseUrl}/docs`,
    title: "anyword docs — API reference",
    description:
      "API reference for anyword: split, count and truncate text by word, grapheme or sentence with native Intl.Segmenter.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "anyword docs — API reference",
    description:
      "Split, count and truncate text by word, grapheme or sentence with native Intl.Segmenter.",
    images: [ogImage.url],
  },
  alternates: {
    canonical: `${baseUrl}/docs`,
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
