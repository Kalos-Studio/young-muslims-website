import type { Metadata } from "next";
import { Suspense } from "react";

import { StoriesExperience } from "./stories-experience";

import { getStoryBySlug } from "@/lib/stories";

export const metadata: Metadata = {
  alternates: { canonical: "/stories" },
  title: "Stories",
  description: "The impact YM has had on people, in their words.",
};

type StoriesPageProps = {
  searchParams: Promise<{
    story?: string | string[];
    from?: string | string[];
  }>;
};

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const query = await searchParams;
  const requestedSlug = Array.isArray(query.story)
    ? query.story[0]
    : query.story;
  const source = Array.isArray(query.from) ? query.from[0] : query.from;
  const initialStory = getStoryBySlug(requestedSlug);

  return (
    <main className="w-full bg-brand-warm-snow">
      <Suspense>
        <StoriesExperience
          initialSlug={initialStory?.slug ?? null}
          fromLanding={source === "landing"}
        />
      </Suspense>
    </main>
  );
}
