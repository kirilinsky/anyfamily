import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for anymany, a tiny Intl list formatter. Learn conjunction, disjunction, and unit joins, Collator sorting, overflow counters, and locales.",
  openGraph: {
    type: "article",
    url: "https://anymany.vercel.app/docs",
    title: "anymany docs — API reference",
    description:
      "API reference for anymany: sort and join arrays of strings in any locale with native Intl.",
  },
  twitter: {
    card: "summary",
    title: "anymany docs — API reference",
    description:
      "Sort and join arrays of strings in any locale with native Intl.",
  },
  alternates: {
    canonical: "https://anymany.vercel.app/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
