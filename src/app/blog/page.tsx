import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing from across the network.",
};

/**
 * WIREFRAME: sample posts.
 *
 * These are real titles from the existing youngmuslims.com resources and
 * articles, used so the client can judge the grid against the length of
 * headlines they actually publish — several run to two lines, which a row of
 * invented three-word titles would have hidden. The dates, read times and
 * authors are made up.
 */
const posts = [
  {
    title: "Muslim Youth Issues: Addressing Mental Health",
    excerpt:
      "The current state of mental health among American Muslim youth, and a toolkit for community leaders supporting them.",
    date: "30 Jan 2025",
    read: "10 min read",
    author: "YM Muslim Youth Issues Team",
  },
  {
    title: "How to Give a Khutbah",
    excerpt:
      "A starting point for anyone stepping into the position of khateeb, meant to be gone over with a local imam.",
    date: "22 Jan 2025",
    read: "6 min read",
    author: "YM Brothers",
  },
  {
    title: "Ramadan Survival Guide",
    excerpt:
      "A daily checklist, du'as and challenges to help you get the most out of the month.",
    date: "14 Jan 2025",
    read: "8 min read",
    author: "Young Muslims",
  },
  {
    title: "Muslim Youth Issues: Judgement Stigma",
    excerpt:
      "Raising awareness of judgement and shame in the American Muslim community, and practical ways to counter it.",
    date: "3 Jan 2025",
    read: "12 min read",
    author: "YM Presents",
  },
  {
    title: "Supporting the Black Community",
    excerpt:
      "A handbook of civic engagement tools and action items, built around sustainable long-term strategies.",
    date: "19 Dec 2024",
    read: "15 min read",
    author: "Young Muslims",
  },
  {
    title: "Through the Eyes of American Muslims",
    excerpt:
      "Survey data from 213 American Muslims on their experiences amid the genocide in Gaza and the West Bank.",
    date: "2 Dec 2024",
    read: "9 min read",
    author: "Khalil Center & YM",
  },
];

const [featured, ...rest] = posts;

function PostCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex aspect-[3/2] items-center justify-center bg-wf-fill-muted text-sm text-background">
        Post image
      </div>
      <p className="flex gap-4 text-sm text-muted-foreground">
        <span>{post.date}</span>
        <span>{post.read}</span>
      </p>
      <h3 className="text-h4 font-semibold">{post.title}</h3>
      <p className="text-sm leading-relaxed font-medium text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <span className="size-6 shrink-0 rounded-full bg-muted" />
        <span className="text-sm text-muted-foreground">{post.author}</span>
      </div>
    </article>
  );
}

export default function BlogPage() {
  return (
    <PageFrame className="pt-16">
      {/* No visible page title: the grid of posts says what this is without
          one. Screen readers still need an h1, so it is sr-only rather than
          absent. */}
      <h1 className="sr-only">Blog</h1>

      <Annotate>
        <div className="relative flex aspect-[21/9] flex-col justify-end bg-wf-fill-muted p-12">
          <p className="absolute top-12 left-12 text-sm text-background/80">
            Featured post image, full bleed, carousel of three
          </p>

          <h2 className="max-w-2xl text-h2 font-bold text-background">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-xl text-base font-medium text-background/80">
            {featured.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="size-8 shrink-0 rounded-full bg-background/30" />
            <span className="flex gap-4 text-sm text-background">
              <span>{featured.author}</span>
              <span>{featured.date}</span>
              <span>{featured.read}</span>
            </span>
          </div>

          <div className="mt-8 flex gap-2">
            <span className="size-2.5 rounded-full bg-background" />
            <span className="size-2.5 rounded-full bg-background/40" />
            <span className="size-2.5 rounded-full bg-background/40" />
          </div>
        </div>
      </Annotate>

      <Annotate className="mt-14">
        <div className="grid grid-cols-3 gap-x-8 gap-y-14">
          {rest.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
      </Annotate>
    </PageFrame>
  );
}
