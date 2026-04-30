import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Full API reference for anywhen — anydate(), anywhen(), anyago(), anywhere(). SSR-safe now, time zones, input types, compatibility, limitations.",
  openGraph: {
    url: "https://anywhen-kappa.vercel.app/docs",
    title: "anywhen docs",
    description:
      "API reference — anydate(), anywhen(), anyago(), anywhere(). SSR-safe now, time zones, compatibility, input types.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://anywhen-kappa.vercel.app/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
