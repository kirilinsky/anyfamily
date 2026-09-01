import type { MetadataRoute } from "next";

import { BASE_URL, PACKAGES } from "@/lib/packages";

/**
 * The landing, plus one entry per package demo that lives here and its docs.
 * Packages still on a standalone site are skipped — their canonical URL is not
 * on this origin yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hosted = PACKAGES.filter((p) => !p.legacySite);

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...hosted.map((p) => ({
      url: `${BASE_URL}/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...hosted
      .filter((p) => p.hasDocs)
      .map((p) => ({
        url: `${BASE_URL}/docs/${p.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    // The metas are not in PACKAGES — they have no demo route, only a landing
    // section — so their docs are listed by hand.
    {
      url: `${BASE_URL}/docs/anyfamily`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/docs/anyfamily-react`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
