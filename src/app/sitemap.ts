import type { MetadataRoute } from "next";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";

import { STORY_PAGES } from "./stories/story-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  // The six full stories; the placeholder pages are not indexed.
  const paths = [
    ...indexablePaths,
    ...STORY_PAGES.filter((story) => !story.placeholder).map(
      (story) => `/stories/${story.slug}`,
    ),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
