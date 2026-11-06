import type { MetadataRoute } from "next";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";
import { STORIES } from "@/lib/stories";
import { getBlogContent } from "@/lib/sanity-blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSiteIndexable) return [];
  const { posts } = await getBlogContent();
  const paths = [
    ...indexablePaths,
    ...STORIES.map((story) => `/stories/${story.slug}`),
    ...posts.map((post) => `/blog/${post.id}`),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
