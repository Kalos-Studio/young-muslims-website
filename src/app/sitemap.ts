import type { MetadataRoute } from "next";
import { getBlogContent } from "@/lib/sanity-blog";
import { isBlogPostIndexable } from "@/lib/blog";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";
import { INDEXABLE_STORY_SLUGS } from "@/lib/stories";

// List only pages that search engines may index. Placeholder stories and
// excerpt-only posts declare noindex, so listing them would send mixed signals.
// `bun run test:seo` fails if this list and the pages' own robots tags disagree.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSiteIndexable) return [];
  const { posts } = await getBlogContent();
  const paths = [
    ...indexablePaths,
    ...INDEXABLE_STORY_SLUGS.map((slug) => `/stories/${slug}`),
    ...posts.filter(isBlogPostIndexable).map((post) => `/blog/${post.id}`),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
