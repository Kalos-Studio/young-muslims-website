import type { MetadataRoute } from "next";
import { indexablePaths, isSiteIndexable, SITE_ORIGIN } from "@/lib/seo";

import { GALLERY_PEOPLE } from "./stories/gallery-people";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only full stories: the placeholder pages (every other face's, until
  // their stories are built) are not indexed. Rahmah's is the one so far.
  const paths = [
    ...indexablePaths,
    ...GALLERY_PEOPLE.filter((person) => person.slug === "rahmah-k").map(
      (person) => `/stories/${person.slug}`,
    ),
  ];

  return isSiteIndexable
    ? paths.map((path) => ({ url: new URL(path, SITE_ORIGIN).href }))
    : [];
}
