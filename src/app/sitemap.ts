import type { MetadataRoute } from "next";
import { blogPosts, isBlogPostIndexable } from "@/lib/blog";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";
import { INDEXABLE_STORY_SLUGS } from "@/lib/stories";

// List only pages that search engines may index. Placeholder stories and
// excerpt-only posts declare noindex, so listing them would send mixed signals.
// `bun run test:seo` fails if this list and the pages' own robots tags disagree.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...indexablePaths,
    ...INDEXABLE_STORY_SLUGS.map((slug) => `/stories/${slug}`),
    ...blogPosts.filter(isBlogPostIndexable).map((post) => `/blog/${post.id}`),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
