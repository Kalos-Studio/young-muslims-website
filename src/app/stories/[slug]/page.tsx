import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { STORIES, getStoryBySlug } from "@/lib/stories";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

const THEME = {
  brothers: {
    background: "bg-brand-royal",
    ink: "text-brand-royal",
    surface: "bg-brothers-slate",
  },
  sisters: {
    background: "bg-brand-jade",
    ink: "text-brand-jade",
    surface: "bg-sisters-buttercup",
  },
} as const;

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story not found" };

  return {
    title: `${story.name}: ${story.title}`,
    description: story.summary,
    alternates: { canonical: `/stories/${story.slug}` },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const theme = THEME[story.theme];

  return (
    <main className="bg-brand-warm-snow text-brand-obsidian">
      <article>
        <header className={`relative overflow-hidden ${theme.background}`}>
          <div className="relative mx-auto grid min-h-[720px] max-w-[1440px] items-end md:min-h-[780px] md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative h-[430px] md:h-full">
              <Image
                src={story.heroImage}
                alt={story.heroAlt}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
                className={`object-cover ${story.theme === "sisters" ? "object-[50%_68%]" : "object-center"}`}
              />
            </div>

            <div className="relative z-10 px-8 py-14 text-brand-pure-white md:px-14 md:py-20 xl:px-20">
              <Link
                href={`/stories?story=${story.slug}`}
                className="mb-12 inline-flex items-center gap-2 rounded-pill border border-brand-pure-white px-5 py-3 text-nav font-bold outline-none hover:bg-brand-pure-white hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Stories
              </Link>
              {story.editorialDraft ? (
                <p className="mb-4 text-nav font-bold">Editorial draft</p>
              ) : null}
              <p className="text-nav font-bold">
                {story.name}, {story.chapter}
              </p>
              <h1 className="mt-5 text-[40px] leading-normal font-extrabold tracking-[-0.02em] md:text-section">
                {story.title}
              </h1>
              <blockquote className="mt-8 text-lead font-semibold">
                “{story.quote}”
              </blockquote>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1120px] gap-14 px-6 py-20 md:grid-cols-[minmax(0,1fr)_320px] md:px-12 md:py-28">
          <div>
            <p className={`text-nav font-bold ${theme.ink}`}>Member story</p>
            <div className="mt-6 space-y-7 text-[20px] leading-relaxed font-medium text-brand-obsidian/85">
              {story.fullStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside aria-labelledby="story-context-heading">
            <div
              className={`relative aspect-square overflow-hidden rounded-[58%_42%_55%_45%/47%_58%_42%_53%] ${theme.surface}`}
            >
              <Image
                src={story.portrait}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 320px"
                className="object-contain"
                style={{ transform: `rotate(${story.rotation ?? 0}deg)` }}
              />
            </div>
            <h2
              id="story-context-heading"
              className="mt-8 text-card-title font-semibold"
            >
              The bigger picture
            </h2>
            <p className="mt-4 text-body leading-relaxed text-brand-obsidian/75">
              {story.context}
            </p>
            <Link
              href="/neighbornets"
              className={`mt-7 inline-flex rounded-pill border border-current px-6 py-4 text-nav font-bold outline-none hover:bg-brand-obsidian hover:text-brand-warm-snow focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 ${theme.ink}`}
            >
              Find a NeighborNet
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
