import type { MetadataRoute } from "next";

const baseUrl = "https://anyfamily.site";

/**
 * Everything is public. The AI crawlers are named on purpose: `*` already
 * admits them, but an explicit allow survives a future default flip and says
 * out loud that the docs are meant to be read by them — that is what
 * `/llms.txt` is for.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
