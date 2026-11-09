import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";

import ymatxRailing from "../../../design-assets/figma/landing-2026/cta/ymatx-railing.jpg";
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

      <div className="mx-auto w-full max-w-7xl px-8 pt-8 pb-20 md:px-20">
        <BlogInteractions posts={blogPosts} />
      </div>

      <ClosingCta
        image={ymatxRailing}
        alt="Young Muslims brothers in YMATX shirts at a railing, looking out over the city"
        imageFocus="low"
      />
    </main>
  );
}
