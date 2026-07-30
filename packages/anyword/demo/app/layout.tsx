import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { baseUrl, ogImage } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "anyword | Micro Intl text segmenter",
    template: "%s | anyword",
  },

  description:
    "Tiny zero-dependency text segmenter for JavaScript and TypeScript. Split, count and truncate text by word, grapheme or sentence in any locale with native Intl.Segmenter.",

  keywords: [
    "text segmentation",
    "word count",
    "grapheme",
    "grapheme splitter",
    "truncate",
    "intl",
    "intl segmenter",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "emoji",
    "unicode",
    "cjk",
    "ssr",
    "nextjs",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anyword",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: baseUrl,
    title: "anyword — text segmentation for any locale",
    description:
      "Micro zero-dependency text segmenter. Words, graphemes and sentences, emoji-safe counting and truncation, 200+ locales via native Intl.",
    siteName: "anyword",
    locale: "en_US",
    images: [ogImage],
  },

  twitter: {
    card: "summary_large_image",
    title: "anyword — text segmentation for any locale",
    description:
      "Micro zero-dependency text segmenter. Emoji-safe counting and truncation via native Intl.Segmenter.",
    images: [ogImage.url],
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: baseUrl,
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
