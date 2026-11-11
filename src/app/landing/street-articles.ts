import type { StaticImageData } from "next/image";

import photoJudgement from "../../../design-assets/figma/landing-2026/street/photo-judgement-stigma.jpg";
import photoMentalHealth from "../../../design-assets/figma/landing-2026/street/photo-mental-health.jpg";
import photoRamadan from "../../../design-assets/figma/landing-2026/street/photo-ramadan-guide.jpg";

/*
 * The landing "Word on the street" articles (Figma 270:289), in order. Swap
 * freely: the section reads only this array.
 *
 * - EDITABLE, PLACEHOLDER: `date` and `author` are Figma's placeholder
 *   ("October 1, 2026", "Muneeb Syed") on all three; replace them with each
 *   report's real date and author.
 * - `href`: the report's PDF, opened in a new tab.
 * - `photo`: pre-cropped to the card's image box as Figma frames it
 *   (scripts/street-assets.mjs); `mask` names the card's blob silhouette
 *   (mask-{slug}.png, a class in the CSS module).
 */
export type StreetArticle = {
  slug: "mental-health" | "judgement-stigma" | "ramadan-guide";
  title: string;
  date: string;
  author: string;
  description: string;
  href: string;
  photo: StaticImageData;
  alt: string;
};

export const STREET_ARTICLES: StreetArticle[] = [
  {
    slug: "mental-health",
    title: "Muslim Youth Issues: Addressing Mental Health",
    date: "October 1, 2026",
    author: "Muneeb Syed",
    description:
      "We aim to address the current state of mental health among American Muslim youth and assist with mental health struggles of any kind. This report also helps guide community leaders by providing a toolkit to directly support them wherever they may be.",
    href: "https://ymsite.com/wp-content/uploads/2024/10/MYI_-Addressing-Mental-Health-Full-Report.pdf",
    photo: photoMentalHealth,
    alt: "Two hands passing a paper heart",
  },
  {
    slug: "judgement-stigma",
    title: "Muslim Youth Issues: Judgement Stigma",
    date: "October 1, 2026",
    author: "Muneeb Syed",
    description:
      "The goal of the YM Presents Muslim Youth Issues: Judgment Stigma campaign is to seek the pleasure of Allah (swt) by raising awareness of judgment and shame within the American Muslim community, providing constructive criticism through education about Islam’s stance on this issue, and presenting practical solutions and strategies to counteract judgment stigma within our communities.",
    href: "https://ymsite.com/wp-content/uploads/2023/10/Judgment-Stigma-Report-PDF-YM-Muslim-Youth-Issues.pdf",
    photo: photoJudgement,
    alt: "A judge’s gavel resting on a closed book",
  },
  {
    slug: "ramadan-guide",
    title: "Ramadan Survival Guide",
    date: "October 1, 2026",
    author: "Muneeb Syed",
    description:
      "Young Muslims would like to present its first-ever Ramadan Survival Guide! We pray this guide brings benefits and helps you optimize how to spend your time this Ramadan! In it you can find a daily to-do checklist, duas, exciting challenges and much more. Share with your friends, family, organizations, and the local community to reap the reward from it.",
    href: "https://ymsite.com/wp-content/uploads/2023/10/YM-Ramadan-Guide-2020.pdf",
    photo: photoRamadan,
    alt: "A crescent moon over mountains at dusk",
  },
];
