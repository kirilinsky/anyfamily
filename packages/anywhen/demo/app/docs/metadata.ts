import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Full API reference for anywhen — anywhen(). Input types, compatibility table, limitations.",
  openGraph: {
    url: "https://anywhen-kappa.vercel.app/docs",
    title: "anywhen docs",
    description:
      "API reference — anywhen(). Compatibility, limitations, input types.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://anywhen-kappa.vercel.app/docs",
  },
};
