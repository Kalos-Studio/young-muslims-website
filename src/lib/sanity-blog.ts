import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { blogPosts, featuredPosts, type BlogPost } from "./blog";

export type CmsBlogPost = BlogPost & {
  featured?: boolean;
};

type SanityPost = {
  slug: string;
  title: string;
  excerpt: string;
  author?: string;
  publishedAt?: string;
  category: BlogPost["category"];
  image: string;
  imageAlt?: string;
  featured?: boolean;
  body: PortableTextBlock[];
};

// Only published documents are exposed. Drafts never reach the public website.
const query = `*[_type == "blogPost" && defined(slug.current) && defined(coverImage.asset)]
  | order(publishedAt desc, _id asc) {
    "slug": slug.current, title, excerpt, author, publishedAt, category,
    "image": coverImage.asset->url, "imageAlt": coverImage.alt, featured, body
  }`;

export const getBlogContent = cache(async () => {
  const url = new URL(
    "https://mygi3vn8.api.sanity.io/v2026-02-01/data/query/production",
  );
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  // Fetch on each visit so Publish/Unpublish takes effect without a rebuild.
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok)
    throw new Error(`Unable to load Sanity blog posts (${response.status})`);
  const { result } = (await response.json()) as { result: SanityPost[] };
  const cmsPosts: CmsBlogPost[] = result.map((post) => ({
    ...post,
    id: post.slug,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : undefined,
  }));
  const cmsSlugs = new Set(cmsPosts.map((post) => post.id));
  // Keep existing resource URLs working while editors move content into Sanity.
  // A CMS post with a matching slug overrides the existing resource.
  const posts: CmsBlogPost[] = [
    ...cmsPosts,
    ...blogPosts.filter((post) => !cmsSlugs.has(post.id)),
  ];
  const featured = cmsPosts.filter((post) => post.featured);
  return {
    posts,
    featured: featured.length
      ? featured
      : featuredPosts.map((post) => posts.find((item) => item.id === post.id)!),
  };
});
