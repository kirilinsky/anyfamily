import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for anywhen, a tiny Intl date formatter. Learn smart, absolute, and relative modes, SSR-safe now, time zones, and input types.",
  openGraph: {
    type: "article",
    url: "https://anywhen-kappa.vercel.app/docs",
    title: "anywhen docs — API reference",
    description:
      "API reference for anywhen: smart, absolute, and relative date formatting with native Intl.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "anywhen — date formatting for any locale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "anywhen docs — API reference",
    description:
      "Smart, absolute, and relative date formatting with native Intl.",
    images: ["/og.jpg"],
  },
  alternates: {
    canonical: "https://anywhen-kappa.vercel.app/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
