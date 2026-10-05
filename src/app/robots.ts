import type { MetadataRoute } from "next";
import { isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawlers must be able to fetch pages to see their noindex directives.
    rules: { userAgent: "*", allow: "/" },
    ...(isSiteIndexable ? { sitemap: `${SITE_ORIGIN}/sitemap.xml` } : {}),
  };
}
