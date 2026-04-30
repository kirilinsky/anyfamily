import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://anywhen-kappa.vercel.app"),

  title: {
    default: "Anywhen | Any locale date formatting",
    template: "%s | anywhen",
  },

  description:
    "~1.3kb gzip. Zero dependencies. anydate(), anywhen(), anyago() — relative, absolute, SSR-safe date formatting powered by native Intl.",

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

  openGraph: {
    type: "website",
    url: "https://anywhen-kappa.vercel.app",
    title: "anywhen — date formatting for any locale",
    description:
      "~1.3kb gzip. Zero deps. Smart date & time, SSR-safe now, time zones, 200+ locales via native Intl.",
    siteName: "anywhen",
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
      "~1.3kb gzip. Zero deps. SSR-safe now, time zones, 200+ locales via native Intl.",
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
