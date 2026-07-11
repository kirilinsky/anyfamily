import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anyaround.vercel.app"),

  title: {
    default: "anyaround | Micro Intl locale display",
    template: "%s | anyaround",
  },

  description:
    "Micro zero-dependency locale display for JavaScript and TypeScript. Turn any region, language, script, currency, or calendar code into its localized name — with country flags — via native Intl.",

  keywords: [
    "country flags",
    "flag emoji",
    "region names",
    "language names",
    "script names",
    "currency names",
    "displaynames",
    "intl",
    "i18n",
    "javascript",
    "typescript",
    "npm",
    "zero dependencies",
    "localization",
    "ssr",
    "nextjs",
  ],

  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],

  creator: "kirilinsky",
  publisher: "kirilinsky",
  applicationName: "anyaround",
  category: "Developer Tools",

  openGraph: {
    type: "website",
    url: "https://anyaround.vercel.app",
    title: "anyaround — localized names & flags for any locale",
    description:
      "Micro zero-dependency locale display. Region, language, script, and currency names with country flags, in 200+ locales via native Intl.",
    siteName: "anyaround",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "anyaround — localized names & flags for any locale",
    description:
      "Micro zero-dependency locale display. Names and country flags via native Intl.",
    creator: "@kirilinsky",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://anyaround.vercel.app",
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
