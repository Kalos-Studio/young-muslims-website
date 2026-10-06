import type { MetadataRoute } from "next";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";
import { STORIES } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...indexablePaths,
    ...STORIES.map((story) => `/stories/${story.slug}`),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
