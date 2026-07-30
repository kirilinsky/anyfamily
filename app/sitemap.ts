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
  ];
}
