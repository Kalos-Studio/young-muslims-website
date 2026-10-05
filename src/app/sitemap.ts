import type { MetadataRoute } from "next";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return isSiteIndexable
    ? indexablePaths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
