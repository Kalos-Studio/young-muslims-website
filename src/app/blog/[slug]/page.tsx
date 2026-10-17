import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog";

type BlogArticleProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.id}` },
  };
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const content = post.content ?? [
    { type: "paragraph" as const, text: post.excerpt },
  ];
  const otherPosts = blogPosts
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <main data-blog-page className="bg-background text-foreground">
      <article>
        <div
          data-header-theme="dark"
          className="relative h-96 overflow-hidden bg-foreground md:h-128"
        >
          <Image
            src={post.heroImage ?? post.image}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-foreground/60 to-transparent"
          />
        </div>
        <div data-header-theme="light" className="px-6 py-12 md:px-20 md:py-20">
          <div className="mx-auto max-w-3xl">
            <header className="border-b border-border pb-8">
              <Link
                href="/blog"
                className="inline-flex text-nav font-semibold text-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                ← All blog posts
              </Link>
              <p className="mt-8 text-nav font-semibold text-accent">
                {post.category}
              </p>
              <h1 className="mt-4 text-section font-extrabold text-balance">
                {post.title}
              </h1>
              {(post.author || post.date || post.read) && (
                <ul
                  aria-label="Article information"
                  className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-nav text-muted-foreground"
                >
                  {post.author && <li>By {post.author}</li>}
                  {post.date && <li>{post.date}</li>}
                  {post.read && <li>{post.read}</li>}
                </ul>
              )}
            </header>
            <div className="space-y-6 pt-8 text-body leading-relaxed">
              {content.map((block, index) => {
                if (block.type === "heading")
                  return (
                    <h2
                      key={index}
                      className="pt-6 text-card-title font-semibold"
                    >
                      {block.text}
                    </h2>
                  );
                if (block.type === "list")
                  return (
                    <ul key={index} className="list-disc space-y-3 pl-6">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  );
                return <p key={index}>{block.text}</p>;
              })}
            </div>
          </div>
        </div>
      </article>
      <section
        aria-labelledby="more-blog-posts"
        data-header-theme="light"
        className="px-6 pb-20 md:px-20"
      >
        <div className="mx-auto max-w-7xl border-t border-border pt-12">
          <h2 id="more-blog-posts" className="text-section font-extrabold">
            More from the blog
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {otherPosts.map((otherPost) => (
              <Link
                key={otherPost.id}
                href={`/blog/${otherPost.id}`}
                className="group block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={otherPost.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </div>
                <p className="mt-5 text-nav font-semibold text-accent">
                  {otherPost.category}
                </p>
                <h3 className="mt-2 text-card-title font-semibold transition-colors group-hover:text-secondary group-focus-visible:text-secondary motion-reduce:transition-none">
                  {otherPost.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
