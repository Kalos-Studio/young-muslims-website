import type { MetadataRoute } from "next";
import { blogPosts, isBlogPostIndexable } from "@/lib/blog";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";

import { STORY_PAGES } from "./stories/story-pages";

// List only pages that search engines may index. Placeholder stories and
// excerpt-only posts declare noindex, so listing them would send mixed signals.
// `bun run test:seo` fails if this list and the pages' own robots tags disagree.
export default function sitemap(): MetadataRoute.Sitemap {
  // The real stories and team pages; the placeholder pages are not indexed.
  const paths = [
    ...indexablePaths,
    ...STORY_PAGES.filter((story) => !story.placeholder).map(
      (story) => `/stories/${story.slug}`,
    ),
    ...blogPosts.filter(isBlogPostIndexable).map((post) => `/blog/${post.id}`),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
