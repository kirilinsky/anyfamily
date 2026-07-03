import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for anyamount, a tiny Intl number formatter. Learn smart, currency, and unit modes, compact notation, sanctioned units, and locales.",
  openGraph: {
    type: "article",
    url: "https://anyamount.vercel.app/docs",
    title: "anyamount docs — API reference",
    description:
      "API reference for anyamount: smart, currency, and unit number formatting with native Intl.",
  },
  twitter: {
    card: "summary",
    title: "anyamount docs — API reference",
    description:
      "Smart, currency, and unit number formatting with native Intl.",
  },
  alternates: {
    canonical: "https://anyamount.vercel.app/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
