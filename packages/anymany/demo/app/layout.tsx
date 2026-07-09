import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anymany.vercel.app"),

  title: {
    default: "anymany | Smart Intl list formatter",
    template: "%s | anymany",
  },

  description:
    "Zero-dependency list formatter for JavaScript and TypeScript. Sort and join arrays of strings in any locale with native Intl.",

  keywords: [
    "list formatting",
    "list format",
    "intl",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "localization",
    "collator",
    "sort",
    "join",
    "ssr",
    "nextjs",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anymany",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: "https://anymany.vercel.app",
    title: "anymany — list formatting for any locale",
    description:
      "Zero-dependency list formatter. Sort and join arrays of strings — conjunction, disjunction, collation, overflow counters — in 200+ locales via native Intl.",
    siteName: "anymany",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "anymany — list formatting for any locale",
    description:
      "Zero-dependency list formatter. Sorted right, joined right, in any locale via native Intl.",
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://anymany.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
