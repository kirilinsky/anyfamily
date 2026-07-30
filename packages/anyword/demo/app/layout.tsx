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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareSourceCode",
      "@id": `${baseUrl}#package`,
      name: "anyword",
      description:
        "Micro text segmenter built on native Intl.Segmenter. Split, count and truncate text by word, grapheme or sentence in any locale. Zero dependencies, under 1kb gzip.",
      url: baseUrl,
      codeRepository: "https://github.com/kirilinsky/anyword",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: ["Node.js", "Deno", "Browser"],
      license: "https://opensource.org/licenses/MIT",
      author: {
        "@type": "Person",
        name: "kirilinsky",
        url: "https://github.com/kirilinsky",
      },
      keywords:
        "text segmentation, word count, grapheme, emoji, truncate, Intl.Segmenter, i18n, unicode, CJK, zero dependency",
      isPartOf: {
        "@type": "CreativeWork",
        name: "any family",
        url: "https://anyfamily.site/",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}#app`,
      name: "anyword",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: baseUrl,
      downloadUrl: "https://www.npmjs.com/package/anyword",
      softwareVersion: "1.0.0",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "TechArticle",
      "@id": `${baseUrl}/docs#reference`,
      headline: "anyword API reference",
      description:
        "API reference for anyword: word, grapheme and sentence granularity, segment offsets, emoji-safe counting and truncation, locales and SSR.",
      url: `${baseUrl}/docs`,
      about: { "@id": `${baseUrl}#package` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
