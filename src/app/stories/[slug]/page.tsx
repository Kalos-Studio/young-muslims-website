import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoryBySlug } from "@/lib/stories";
import { RahmahStory } from "../rahmah-story";
import { PlaceholderStory } from "../placeholder-story";
import {
  PORTRAIT_SLOTS,
  getPortraitBySlug,
  portraitSlug,
} from "../portrait-slots";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PORTRAIT_SLOTS.map((slot) => ({ slug: portraitSlug(slot) }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!getPortraitBySlug(slug)) return { title: "Story not found" };
  const story = getStoryBySlug(slug);
  return {
    title:
      slug === "rahmah-k"
        ? "Rahmah K.: Coming in unsure. Leaving with confidence."
        : `${story?.name ?? "Community story"}: Story coming soon`,
    description:
      slug === "rahmah-k"
        ? story?.summary
        : "This member’s Young Muslims story is coming soon.",
    alternates: { canonical: `/stories/${slug}` },
    ...(slug !== "rahmah-k" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const slot = getPortraitBySlug(slug);
  if (!slot) notFound();
  if (slug === "rahmah-k") return <RahmahStory />;
  return <PlaceholderStory slot={slot} />;
}
