import type { MetadataRoute } from "next";

const baseUrl = "https://anyfamily.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
