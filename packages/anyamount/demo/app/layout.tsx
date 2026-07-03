import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anyamount.vercel.app"),

  title: {
    default: "anyamount | Tiny Intl number formatter",
    template: "%s | anyamount",
  },

  description:
    "Tiny zero-dependency number formatter for JavaScript and TypeScript. Format compact, currency, and unit amounts in any locale with native Intl.",

  keywords: [
    "number formatting",
    "compact notation",
    "currency",
    "units",
    "filesize",
    "intl",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "localization",
    "number library",
    "ssr",
    "nextjs",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anyamount",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: "https://anyamount.vercel.app",
    title: "anyamount — number formatting for any locale",
    description:
      "Tiny zero-dependency number formatter. Smart compact notation, currency, and units with 200+ locales via native Intl.",
    siteName: "anyamount",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "anyamount — number formatting for any locale",
    description:
      "Tiny zero-dependency number formatter. Compact, currency, and units via native Intl.",
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://anyamount.vercel.app",
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
