import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GALLERY_PEOPLE, getGalleryPerson } from "../gallery-people";
import { PlaceholderStory } from "../placeholder-story";
import { RahmahStory } from "../rahmah-story";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

// Every face in the gallery has a page: Rahmah's story, and a placeholder
// for the rest until their stories are built.
export function generateStaticParams() {
  return GALLERY_PEOPLE.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getGalleryPerson(slug);
  if (!person) return { title: "Story not found" };
  if (slug === "rahmah-k")
    return {
      title: "Rahmah K.: Coming in unsure. Leaving with confidence.",
      description:
        "Rahmah almost didn’t walk into her first NeighborNet. Three years later, she’s the one leading halaqas.",
      alternates: { canonical: `/stories/${slug}` },
    };
  return {
    title: `${person.hasStory ? person.name : "Community story"}: Story coming soon`,
    description: "This member’s Young Muslims story is coming soon.",
    alternates: { canonical: `/stories/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const person = getGalleryPerson(slug);
  if (!person) notFound();
  if (slug === "rahmah-k") return <RahmahStory />;
  return <PlaceholderStory person={person} />;
}
