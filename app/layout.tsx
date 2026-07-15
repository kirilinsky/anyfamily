import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anyfamily.site"),
  title: "anyfamily — micro Intl tools for any locale",
  description:
    "The any* family: five micro, zero-dependency JavaScript tools built on native Intl. Names & flags, money, dates, durations, and lists — in any locale.",
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
    url: "https://anyfamily.site",
    title: "anyfamily — micro Intl tools for any locale",
    description:
      "Five micro, zero-dependency tools on native Intl: names & flags, money, dates, durations, lists. Any locale.",
    siteName: "anyfamily",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "anyfamily — micro Intl tools for any locale",
    description: "Five micro Intl tools. Zero data. Any locale.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://anyfamily.site" },
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
