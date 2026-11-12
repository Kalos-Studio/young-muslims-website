import type { StaticImageData } from "next/image";

import muneebCard from "../../../design-assets/figma/stories/alumni/muneeb-syed.jpg";
import muneebDesktop from "../../../design-assets/figma/stories/story-page/photos/muneeb-syed-desktop.jpg";
import muneebMobile from "../../../design-assets/figma/stories/story-page/photos/muneeb-syed-mobile.jpg";
import muneebTablet from "../../../design-assets/figma/stories/story-page/photos/muneeb-syed-tablet.jpg";

/**
 * Someone on the Young Muslims team, in the Stories page's "Or hear from the
 * Young Muslims team" row (Figma 587:1538; DESIGN-SYSTEM.md, "Stories
 * alumni"), and their story page (/stories/[slug], the alumni variant of
 * the story template: no accordions).
 */
export type Alumnus = {
  slug: string;
  name: string;
  /** Their role on the team, under their name. */
  role: string;
  /** Their NeighborNet, on the card's Royal tag ("YM Locks, Connecticut"). */
  tag: string;
  /** Sister or brother: their page's watermark monogram. */
  gender: "sister" | "brother";
  /** The card's photo (285 x 282; scripts/alumni-assets.mjs). */
  card: StaticImageData;
  /** Their page's hero photo, per frame (scripts/story-page-assets.mjs). */
  photo: {
    desktop: StaticImageData;
    tablet: StaticImageData;
    mobile: StaticImageData;
  };
  photoAlt: string;
  /** As a story's: two lines, the last word in Landing Cyan. */
  headline: [string, string];
  quote: string;
  narrative: string[];
  /**
   * PLACEHOLDER: true for a stand-in (every word and photo to swap; not
   * indexed, not in the sitemap). Muneeb is real.
   */
  placeholder: boolean;
};

/**
 * The team, in the row's order: Muneeb (verbatim as YM provided it). More
 * are coming from YM; add an entry for each (the row takes any number).
 */
export const ALUMNI: Alumnus[] = [
  {
    slug: "muneeb-syed",
    name: "Muneeb Syed",
    role: "Chief Operational Officer",
    tag: "YM Locks, Connecticut",
    gender: "brother",
    card: muneebCard,
    photo: {
      desktop: muneebDesktop,
      tablet: muneebTablet,
      mobile: muneebMobile,
    },
    photoAlt: "Muneeb Syed speaking into a microphone",
    headline: ["LOST MY CONNECTION.", "FOUND A COMMUNITY."],
    quote:
      "I began to remember the beauty of Islam. Listening to these passionate halaqas given by my peers made me reassess my connection with Allah (SWT).",
    // YM's text verbatim, set in three paragraphs at its natural turns.
    narrative: [
      "For a long time, I struggled with my identity and my faith. I found myself not really knowing why I was a Muslim, or even why I prayed, and the whispers of shaytaan were making me careless with my deen.",
      "When YM Worcester in Massachusetts started and two of my friends pushed me to come to halaqas, I began to remember the beauty of Islam. Listening to these passionate halaqas given by my peers made me reassess my life and my connection with Allah (SWT).",
      "Then I had to move an hour away to Connecticut, and I lost touch with almost all the friends I had. But with YM Locks in Connecticut, I was able to join a whole new community and make connections in a way I never thought I could. I’ll be forever grateful to these two NeighborNets, Worcester and Locks, for the immeasurable impact they made on my life and my deen.",
    ],
    placeholder: false,
  },
];
