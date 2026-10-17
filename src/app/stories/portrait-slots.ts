import type { StaticImageData } from "next/image";
import type { StorySlug } from "@/lib/stories";
import imageab441 from "../../../design-assets/figma/stories-redesign/ab441.png";
import imageb91c1 from "../../../design-assets/figma/stories-redesign/b91c1.png";
import image08a9b from "../../../design-assets/figma/stories-redesign/08a9b.png";
import image2e353 from "../../../design-assets/figma/stories-redesign/2e353.png";
import imagec2981 from "../../../design-assets/figma/stories-redesign/c2981.png";
import image86dfe from "../../../design-assets/figma/stories-redesign/86dfe.png";
import image79cf9 from "../../../design-assets/figma/stories-redesign/79cf9.png";
import imagea7a53 from "../../../design-assets/figma/stories-redesign/a7a53.png";
import image1d75b from "../../../design-assets/figma/stories-redesign/1d75b.png";
import image093fb from "../../../design-assets/figma/stories-redesign/093fb.png";
import imaged893b from "../../../design-assets/figma/stories-redesign/d893b.png";
import imageb649d from "../../../design-assets/figma/stories-redesign/b649d.png";
import image995d1 from "../../../design-assets/figma/stories-redesign/995d1.png";
import image8245b from "../../../design-assets/figma/stories-redesign/8245b.png";
import imagebfb31 from "../../../design-assets/figma/stories-redesign/bfb31.png";
import image4b24a from "../../../design-assets/figma/stories-redesign/4b24a.png";
import image4ca3d from "../../../design-assets/figma/stories-redesign/4ca3d.png";
import image41fca from "../../../design-assets/figma/stories-redesign/41fca.png";
import imagea4cd2 from "../../../design-assets/figma/stories-redesign/a4cd2.png";
import imageb4dd1 from "../../../design-assets/figma/stories-redesign/b4dd1.png";
import imagee10ab from "../../../design-assets/figma/stories-redesign/e10ab.png";
import image57a72 from "../../../design-assets/figma/stories-redesign/57a72.png";
import image2b3b4 from "../../../design-assets/figma/stories-redesign/2b3b4.png";

// Figma 401:3786 positions. Existing story identities stay attached to their portraits.
export const PORTRAIT_SLOTS: {
  id: string;
  image: StaticImageData;
  x: number;
  y: number;
  width: number;
  height: number;
  slug?: StorySlug;
}[] = [
  { id: "ab441", image: imageab441, x: 0, y: 637, width: 39, height: 41 },
  {
    id: "b91c1",
    image: imageb91c1,
    x: -3,
    y: 852,
    width: 42,
    height: 44,
    slug: "brotherhood-in-the-everyday",
  },
  { id: "08a9b", image: image08a9b, x: -3, y: 1096, width: 46, height: 47 },
  { id: "2e353", image: image2e353, x: 90, y: 718, width: 80, height: 80 },
  { id: "c2981", image: imagec2981, x: 90, y: 962, width: 101, height: 80 },
  { id: "86dfe", image: image86dfe, x: 221, y: 604, width: 122, height: 108 },
  {
    id: "79cf9",
    image: image79cf9,
    x: 221,
    y: 820,
    width: 101,
    height: 108,
    slug: "mustafa-r",
  },
  { id: "a7a53", image: imagea7a53, x: 209, y: 1066, width: 145, height: 108 },
  { id: "1d75b", image: image1d75b, x: 413, y: 683, width: 139, height: 143 },
  { id: "093fb", image: image093fb, x: 411, y: 954, width: 141, height: 136 },
  {
    id: "d893b",
    image: imaged893b,
    x: 635,
    y: 556,
    width: 170,
    height: 175,
    slug: "rahmah-k",
  },
  { id: "b649d", image: imageb649d, x: 635, y: 798, width: 170, height: 177 },
  { id: "995d1", image: image995d1, x: 635, y: 1055, width: 170, height: 162 },
  { id: "8245b", image: image8245b, x: 896, y: 683, width: 143, height: 143 },
  { id: "bfb31", image: imagebfb31, x: 898, y: 942, width: 153, height: 143 },
  { id: "4b24a", image: image4b24a, x: 1112, y: 604, width: 119, height: 108 },
  {
    id: "4ca3d",
    image: image4ca3d,
    x: 1130,
    y: 820,
    width: 87,
    height: 108,
    slug: "growing-by-serving",
  },
  {
    id: "41fca",
    image: image41fca,
    x: 1130,
    y: 1066,
    width: 107,
    height: 108,
    slug: "the-seat-they-saved",
  },
  { id: "a4cd2", image: imagea4cd2, x: 1288, y: 718, width: 85, height: 80 },
  { id: "b4dd1", image: imageb4dd1, x: 1288, y: 962, width: 102, height: 80 },
  { id: "e10ab", image: imagee10ab, x: 1420, y: 637, width: 40, height: 41 },
  {
    id: "57a72",
    image: image57a72,
    x: 1420,
    y: 853,
    width: 45,
    height: 41,
    slug: "a-place-to-be-known",
  },
  { id: "2b3b4", image: image2b3b4, x: 1420, y: 1099, width: 47, height: 41 },
];

export type PortraitSlot = (typeof PORTRAIT_SLOTS)[number];

export function portraitSlug(slot: PortraitSlot) {
  return slot.slug ?? `community-${slot.id}`;
}

export function getPortraitBySlug(slug: string) {
  return PORTRAIT_SLOTS.find((slot) => portraitSlug(slot) === slug);
}
