import type { Metadata } from "next";

import { LandingCtaSection } from "@/app/landing/landing-new-sections";
import { BlogInteractions } from "./blog-interactions";
import { blogPosts, featuredPosts } from "@/lib/blog";
import { FeaturedBlogCarousel } from "./featured-blog-carousel";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog",
  description:
    "Reflections, recaps, and what’s happening across the NeighborNets.",
};

export default function BlogPage() {
  return (
    <main data-blog-page className="w-full">
      <h1 className="sr-only">Young Muslims Blog</h1>

      <FeaturedBlogCarousel slides={featuredPosts} />

      <div
        data-header-theme="light"
        className="mx-auto w-full max-w-7xl px-8 pt-8 pb-20 md:px-20"
      >
        <BlogInteractions posts={blogPosts} />
      </div>

      <LandingCtaSection />
    </main>
  );
}
