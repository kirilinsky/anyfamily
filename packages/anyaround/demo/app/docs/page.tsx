import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "API reference for anyaround, a micro Intl locale display. Learn smart detection, region, language, script, currency, and calendar modes, country flags, and locales.",
  openGraph: {
    type: "article",
    url: "https://anyaround.vercel.app/docs",
    title: "anyaround docs — API reference",
    description:
      "API reference for anyaround: localized region, language, script, and currency names with country flags via native Intl.",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyaround docs — API reference",
    description:
      "Localized names and country flags via native Intl.",
  },
  alternates: {
    canonical: "https://anyaround.vercel.app/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
