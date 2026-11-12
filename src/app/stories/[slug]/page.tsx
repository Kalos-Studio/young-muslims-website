import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoryPage } from "../story-page";
import { STORY_PAGES, getStoryPage } from "../story-pages";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

/** Sentence case for the headline in the page title. */
function sentence(text: string) {
  return text
    .toLowerCase()
    .replace(
      /(^|[.!?]\s+)(\p{L})/gu,
      (_, gap, letter) => gap + letter.toUpperCase(),
    );
}

// One page per gallery face, all generated at build.
export function generateStaticParams() {
  return STORY_PAGES.map((story) => ({ slug: story.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryPage(slug);
  if (!story) return { title: "Story not found" };
  if (story.placeholder)
    return {
      title: `${story.name}: Story coming soon`,
      description: "This member’s Young Muslims story is coming soon.",
      alternates: { canonical: `/stories/${slug}` },
      robots: { index: false, follow: true },
    };
  return {
    title: `${story.name}: ${sentence(story.headline.join(" "))}`,
    description: story.quote,
    alternates: { canonical: `/stories/${slug}` },
  };
}

export default async function Page({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryPage(slug);
  if (!story) notFound();
  return <StoryPage story={story} />;
}
