import type { StaticImageData } from "next/image";

import { STORY_SNIPPETS } from "../landing/story-snippets";

import face08a9b from "../../../design-assets/figma/stories/gallery/08a9b.png";
import face093fb from "../../../design-assets/figma/stories/gallery/093fb.png";
import face1d75b from "../../../design-assets/figma/stories/gallery/1d75b.png";
import face2b3b4 from "../../../design-assets/figma/stories/gallery/2b3b4.png";
import face2e353 from "../../../design-assets/figma/stories/gallery/2e353.png";
import face41fca from "../../../design-assets/figma/stories/gallery/41fca.png";
import face4b24a from "../../../design-assets/figma/stories/gallery/4b24a.png";
import face4ca3d from "../../../design-assets/figma/stories/gallery/4ca3d.png";
import face57a72 from "../../../design-assets/figma/stories/gallery/57a72.png";
import face79cf9 from "../../../design-assets/figma/stories/gallery/79cf9.png";
import face8245b from "../../../design-assets/figma/stories/gallery/8245b.png";
import face86dfe from "../../../design-assets/figma/stories/gallery/86dfe.png";
import face995d1 from "../../../design-assets/figma/stories/gallery/995d1.png";
import facea4cd2 from "../../../design-assets/figma/stories/gallery/a4cd2.png";
import facea7a53 from "../../../design-assets/figma/stories/gallery/a7a53.png";
import faceab441 from "../../../design-assets/figma/stories/gallery/ab441.png";
import faceb4dd1 from "../../../design-assets/figma/stories/gallery/b4dd1.png";
import faceb649d from "../../../design-assets/figma/stories/gallery/b649d.png";
import faceb91c1 from "../../../design-assets/figma/stories/gallery/b91c1.png";
import facebfb31 from "../../../design-assets/figma/stories/gallery/bfb31.png";
import facec2981 from "../../../design-assets/figma/stories/gallery/c2981.png";
import faced893b from "../../../design-assets/figma/stories/gallery/d893b.png";
import facee10ab from "../../../design-assets/figma/stories/gallery/e10ab.png";

/**
 * A face in the Stories gallery (Figma 401:3786) and the story it opens at
 * `/stories/[slug]`.
 */
export type GalleryPerson = {
  /** The face's id: its asset's name (design-assets/figma/stories/gallery). */
  face: string;
  slug: string;
  /** Who it is, as the gallery's link names them. */
  name: string;
  image: StaticImageData;
  /**
   * PLACEHOLDER: false for the 17 faces whose story is still to come (their
   * slug, name and page are stand-ins, swappable once YM provides the
   * stories); true for the six with a story (STORY_SNIPPETS, shared with the
   * landing's stories snippet).
   */
  hasStory: boolean;
};

/** The six faces with a story: each face's snippet slug (its Figma face). */
const STORY_FACES: Record<string, string> = {
  d893b: "rahmah-k",
  "79cf9": "mustafa-r",
  "57a72": "maryam-t",
  a7a53: "layla-h",
  "2b3b4": "bilal-s",
  b91c1: "yusuf-a",
};

/*
 * The 23 faces in Figma's order (by column, left to right, then top to
 * bottom). The 17 without a story are PLACEHOLDERS: a neutral slug
 * (`community-<face>`) and name ("Community member n"), to swap for the
 * real person's when their story arrives.
 */
const FACES: [string, StaticImageData][] = [
  ["ab441", faceab441],
  ["b91c1", faceb91c1],
  ["08a9b", face08a9b],
  ["2e353", face2e353],
  ["c2981", facec2981],
  ["86dfe", face86dfe],
  ["79cf9", face79cf9],
  ["a7a53", facea7a53],
  ["1d75b", face1d75b],
  ["093fb", face093fb],
  ["d893b", faced893b],
  ["b649d", faceb649d],
  ["995d1", face995d1],
  ["8245b", face8245b],
  ["bfb31", facebfb31],
  ["4b24a", face4b24a],
  ["4ca3d", face4ca3d],
  ["41fca", face41fca],
  ["a4cd2", facea4cd2],
  ["b4dd1", faceb4dd1],
  ["e10ab", facee10ab],
  ["57a72", face57a72],
  ["2b3b4", face2b3b4],
];

let placeholders = 0;
export const GALLERY_PEOPLE: GalleryPerson[] = FACES.map(([face, image]) => {
  const snippet = STORY_SNIPPETS.find(
    (story) => story.slug === STORY_FACES[face],
  );
  if (snippet)
    return {
      face,
      slug: snippet.slug,
      name: snippet.name,
      image,
      hasStory: true,
    };
  placeholders += 1;
  return {
    face,
    slug: `community-${face}`,
    name: `Community member ${placeholders}`,
    image,
    hasStory: false,
  };
});

export function getGalleryPerson(slug: string) {
  return GALLERY_PEOPLE.find((person) => person.slug === slug);
}

/*
 * The field's faces by lattice cell. The field is a honeycomb of columns
 * (odd columns half a row lower); cell (column i, row j) shows face
 * LATTICE_ORDER[(i + 10 r) mod 23], r being its axial row
 * (j - (i - (i & 1)) / 2). Steps of 1 and 10 spread the 23 faces as far
 * apart as the lattice allows: a face's nearest repeat is 4.6 columns
 * away, so on desktop only the band's smaller outer faces ever repeat. The order puts Figma's faces where Figma has them round the
 * centre face (b649d, cell 0, 0), the six with a story first; the four
 * edge cells that cannot keep Figma's face show another.
 */
export const LATTICE_ORDER = [
  "b649d",
  "bfb31",
  "41fca",
  "08a9b",
  "2e353",
  "4b24a",
  "a4cd2",
  "57a72",
  "79cf9",
  "093fb",
  "995d1",
  "c2981",
  "b4dd1",
  "d893b",
  "8245b",
  "4ca3d",
  "b91c1",
  "2b3b4",
  "a7a53",
  "ab441",
  "e10ab",
  "86dfe",
  "1d75b",
] as const;

/** The step along the axial row that spreads the faces (see above). */
export const LATTICE_ROW_STEP = 10;
