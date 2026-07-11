import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anyfamily.vercel.app"),
  title: "anyfamily — micro Intl tools for any locale",
  description:
    "The any* family: four micro, zero-dependency JavaScript tools built on native Intl. Names & flags, money, dates, and lists — in any locale.",
  keywords: [
    "intl",
    "i18n",
    "l10n",
    "localization",
    "javascript",
    "typescript",
    "zero dependencies",
    "displaynames",
    "numberformat",
    "datetimeformat",
    "listformat",
  ],
  authors: [{ name: "kirilinsky", url: "https://github.com/kirilinsky" }],
  creator: "kirilinsky",
  openGraph: {
    type: "website",
    url: "https://anyfamily.vercel.app",
    title: "anyfamily — micro Intl tools for any locale",
    description:
      "Four micro, zero-dependency tools on native Intl: names & flags, money, dates, lists. Any locale.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyfamily — micro Intl tools for any locale",
    description: "Four micro Intl tools. Zero data. Any locale.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://anyfamily.vercel.app" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
