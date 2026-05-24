import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anywhen-kappa.vercel.app"),

  title: {
    default: "anywhen | Tiny Intl date formatter",
    template: "%s | anywhen",
  },

  description:
    "Tiny zero-dependency date formatter for JavaScript and TypeScript. Format smart, absolute, and relative dates in any locale with native Intl.",

  keywords: [
    "date formatting",
    "relative time",
    "intl",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "localization",
    "date library",
    "ssr",
    "nextjs",
    "fuzzy",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anywhen",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: "https://anywhen-kappa.vercel.app",
    title: "anywhen — date formatting for any locale",
    description:
      "Tiny zero-dependency date formatter. Smart, absolute, and relative dates with SSR-safe now, time zones, and 200+ locales via native Intl.",
    siteName: "anywhen",
    locale: "en_US",
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
    title: "anywhen — date formatting for any locale",
    description:
      "Tiny zero-dependency date formatter. SSR-safe now, time zones, and 200+ locales via native Intl.",
    images: ["/og.jpg"],
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://anywhen-kappa.vercel.app",
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
