import type { StaticImageData } from "next/image";

import shaheerIqbal from "../../../design-assets/figma/about/shura/shaheer-iqbal.jpg";
import muneebSyed from "../../../design-assets/figma/stories/alumni/muneeb-syed.jpg";
import zaidKhan from "../../../design-assets/figma/about/shura/zaid-khan.jpg";
import ibraheemMir from "../../../design-assets/figma/about/shura/ibraheem-mir.jpg";
import johaerJilani from "../../../design-assets/figma/about/shura/johaer-jilani.jpg";
import rayyanHasan from "../../../design-assets/figma/about/shura/rayyan-hasan.jpg";
import farhanAli from "../../../design-assets/figma/about/shura/farhan-ali.jpg";
import moazAteya from "../../../design-assets/figma/about/shura/moaz-ateya.jpg";
import tauseefSiddique from "../../../design-assets/figma/about/shura/tauseef-siddique.jpg";
import aishaAbouganba from "../../../design-assets/figma/about/shura/aisha-abouganba.jpg";
import aleezaBhatti from "../../../design-assets/figma/about/shura/aleeza-bhatti.jpg";
import ayraIslam from "../../../design-assets/figma/about/shura/ayra-islam.jpg";
import imanVirani from "../../../design-assets/figma/about/shura/iman-virani.jpg";
import sarahSiddiqui from "../../../design-assets/figma/about/shura/sarah-siddiqui.jpg";

/**
 * A member of the National Shura, on the About page's "The Young Muslims
 * team." cards (Figma 542:174; DESIGN-SYSTEM.md, "About Shura"). Real
 * content, verbatim from Figma.
 */
export type ShuraMember = {
  name: string;
  /** Their roles, under their name. */
  role: string;
  /** Their NeighborNet, on the card's tag; "-" (Figma's empty tag) shows none. */
  tag: string;
  /**
   * Their photo (scripts/about-shura-assets.mjs), or, until YM sends one,
   * Figma's branded block in Royal or Jade: SWAP for their photo.
   */
  photo: StaticImageData | { placeholder: "royal" | "jade" };
};

/** The Shura, in Figma's reading order (row by row, left to right). */
export const SHURA: ShuraMember[] = [
  {
    name: "Aqil Farooqui",
    role: "National Coordinator; leads the Shura",
    tag: "New Jersey (Northeast)",
    photo: { placeholder: "royal" },
  },
  {
    name: "Shaheer Iqbal",
    role: "Secretary - General and Finance Lead",
    tag: "New Jersey (Northeast)",
    photo: shaheerIqbal,
  },
  {
    name: "Muneeb Syed",
    role: "Chief of Operations",
    tag: "Connecticut (Northeast)",
    photo: muneebSyed,
  },
  {
    name: "Zaid Khan",
    role: "Fundraising Lead; Shura rep for Conferences, Safety & Compliance, and IT",
    tag: "New York (Northeast)",
    photo: zaidKhan,
  },
  {
    name: "Ibraheem Mir",
    role: "Civic Engagement Lead and Vision 2030 Societal Impact Lead",
    tag: "Georgia (Northeast)",
    photo: ibraheemMir,
  },
  {
    name: "Ammar Siddiqui",
    role: "Head of the Societal Impact Department; Alumni Relations representative",
    tag: "Chicago (Midwest)",
    photo: { placeholder: "royal" },
  },
  {
    name: "Johaer Jilani",
    role: "Expansion and Outreach Lead; Vision 2030 Diversity Lead",
    tag: "DMV (Northeast)",
    photo: johaerJilani,
  },
  {
    name: "Rayyan Hasan",
    role: "Tarbiyyah rep for programming, research and scholarships",
    tag: "Houston (South)",
    photo: rayyanHasan,
  },
  {
    name: "Farhan Ali",
    role: "Tarbiyyah rep for study circles and murabbi development; YMLC Lead; Marketing/Merch department representative",
    tag: "Dallas (South)",
    photo: farhanAli,
  },
  {
    name: "Moaz Ateya",
    role: "Tarbiyyah rep for leadership development; League Coordinator; Vision 2030 Tarbiyyah Lead",
    tag: "Houston (South)",
    photo: moazAteya,
  },
  {
    name: "Imaad Khan",
    role: "Safety & Compliance Lead; Finance department rep; on the Council; Midwest Liaison; Vision 2030 Sustainability Lead",
    tag: "Chicago (Midwest)",
    photo: { placeholder: "royal" },
  },
  {
    name: "Tauseef Siddique",
    role: "Council Coordinator, Cloud Lead, and Quality Control representative",
    tag: "New Jersey (Northeast)",
    photo: tauseefSiddique,
  },
  {
    name: "Aisha Abouganba",
    role: "National Coordinator",
    tag: "New Jersey",
    photo: aishaAbouganba,
  },
  {
    name: "Duaa Ali",
    role: "Secretary General",
    tag: "-",
    photo: { placeholder: "jade" },
  },
  {
    name: "Aleeza Bhatti",
    role: "IT, Safety & Compliance; National Shura",
    tag: "Washington",
    photo: aleezaBhatti,
  },
  {
    name: "Aminah Syed",
    role: "Marking, YMC;National Shura",
    tag: "New York",
    photo: { placeholder: "jade" },
  },
  {
    name: "Ayra Islam",
    role: "Professional Dev, Retreats; National Shura",
    tag: "Virginia",
    photo: ayraIslam,
  },
  {
    name: "Dania Ali",
    role: "Societal Impact; National Shura",
    tag: "New Jersey",
    photo: { placeholder: "jade" },
  },
  {
    name: "Iman Virani",
    role: "Fundraising; National Shura",
    tag: "New York",
    photo: imanVirani,
  },
  {
    name: "Mariam Mohtisham",
    role: "Tarbiyyah; National Shura",
    tag: "Florida",
    photo: { placeholder: "jade" },
  },
  {
    name: "Sarah Siddiqui",
    role: "Societal Impact; National Shura",
    tag: "Texas",
    photo: sarahSiddiqui,
  },
  {
    name: "Sunbul Shaikh",
    role: "Expansion; National Shura",
    tag: "New York",
    photo: { placeholder: "jade" },
  },
  {
    name: "Thameena Shaik",
    role: "Tarbiyyah; National Shura",
    tag: "Texas",
    photo: { placeholder: "jade" },
  },
];
