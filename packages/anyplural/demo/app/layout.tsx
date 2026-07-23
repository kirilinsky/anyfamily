import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anyplural.vercel.app"),

  title: {
    default: "anyplural | Micro Intl plural formatter",
    template: "%s | anyplural",
  },

  description:
    "Micro zero-dependency plural formatter for JavaScript and TypeScript. Turn a count into the right plural form in any locale with native Intl.PluralRules.",

  keywords: [
    "pluralization",
    "plural rules",
    "intl",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "localization",
    "cldr",
    "ssr",
    "nextjs",
    "ordinal",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anyplural",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: "https://anyplural.vercel.app",
    title: "anyplural — plural formatting for any locale",
    description:
      "Micro zero-dependency plural formatter. Correct plurals with SSR-safe output and 200+ locales via native Intl.PluralRules.",
    siteName: "anyplural",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "anyplural — plural formatting for any locale",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "anyplural — plural formatting for any locale",
    description:
      "Micro zero-dependency plural formatter. SSR-safe output and 200+ locales via native Intl.PluralRules.",
    images: ["/og.jpg"],
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://anyplural.vercel.app",
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
