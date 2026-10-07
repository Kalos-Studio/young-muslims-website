import type { StaticImageData } from "next/image";

import rahmahOverview from "../../design-assets/figma/stories/rahmah-overview.jpeg";
import rahmahPhoto from "../../design-assets/figma/stories/rahmah-photo.jpeg";
import mustafaPhoto from "../../design-assets/figma/stories/mustafa-photo.jpeg";
import portraitOne from "../../design-assets/figma/landing-2026/closing-01.png";
import portraitTwo from "../../design-assets/figma/landing-2026/closing-02.png";
import portraitThree from "../../design-assets/figma/landing-2026/closing-03.png";
import portraitFour from "../../design-assets/figma/landing-2026/closing-04.png";
import portraitFive from "../../design-assets/figma/landing-2026/closing-05.png";
import portraitSix from "../../design-assets/figma/landing-2026/closing-06.png";

export type StoryTheme = "brothers" | "sisters";

export type Story = {
  slug: string;
  name: string;
  chapter: string;
  title: string;
  quote: string;
  summary: string;
  fullStory: readonly string[];
  context: string;
  portrait: StaticImageData;
  heroImage: StaticImageData;
  overviewImage?: StaticImageData;
  heroAlt: string;
  theme: StoryTheme;
  rotation?: number;
  editorialDraft?: boolean;
};

export const STORIES = [
  {
    slug: "rahmah-k",
    name: "Rahmah K.",
    chapter: "YM Chicago",
    title: "They just made room for me",
    quote:
      "I didn't think I was religious enough to belong there. Nobody made me feel that way, they just made room for me.",
    summary:
      "Rahmah almost didn't walk into her first NeighborNet. A friend had to drag her along, and she spent that first night sitting quietly in the back, sure she didn't fit in. She kept coming anyway. Three years later, she's the one leading halaqas, and the sisters she met have become the people she calls first, good news or bad. For Rahmah, Young Muslims wasn't just where she found her people. It's where she found herself.",
    fullStory: [
      "Rahmah almost did not walk into her first NeighborNet. A friend had to drag her along, and she spent that first night sitting quietly in the back, sure she did not fit in. Nobody asked her to prove that she belonged. They saved her a place, brought her into the conversation, and made it easy to return the next week.",
      "She kept coming. The room that first felt unfamiliar became the place where friendships deepened and faith became part of ordinary life. Three years later, Rahmah is the one leading halaqas and noticing the sister who is hanging back at the edge of the room.",
      "The sisters she met have become the people she calls first, whether the news is good or difficult. For Rahmah, Young Muslims was not just where she found her people. It is where she found herself, and where she learned how powerful it can be to make room for somebody else.",
    ],
    context:
      "Rahmah's story reflects the weekly, peer-led community at the heart of a Young Muslims NeighborNet: a consistent place to grow in faith, friendship, and leadership.",
    portrait: portraitFour,
    heroImage: rahmahPhoto,
    overviewImage: rahmahOverview,
    heroAlt:
      "Rahmah and a friend seated together in front of a Young Muslims floral backdrop.",
    theme: "sisters",
    rotation: 0,
    editorialDraft: false,
  },
  {
    slug: "mustafa-r",
    name: "Mustafa R.",
    chapter: "YM New Jersey",
    title: "I stayed because these guys became my brothers",
    quote:
      "I came for the pizza, honestly. I stayed because these guys became my brothers.",
    summary:
      "Mustafa showed up to his first YM night for the free food and a break from a rough week. He wasn't looking for anything more. But the guys kept texting, kept saving him a seat, kept pulling him back. What started as somewhere to be on a Saturday turned into the people he leaned on through his hardest stretch. Now he's the one messaging the new kid who came once and hasn't been back. For Mustafa, Young Muslims is proof that showing up for someone is sometimes all it takes.",
    fullStory: [
      "Mustafa showed up to his first YM night for the free food and a break from a rough week. He was not looking for a program or a big turning point. He only needed somewhere to be on a Saturday, and somebody had told him there would be pizza.",
      "Then the guys kept texting. They saved him a seat, checked in when he was quiet, and kept pulling him back into the room. What began as a casual hangout became the group he leaned on through his hardest stretch. Faith, friendship, and the habit of showing up grew together.",
      "Now Mustafa is the person messaging the new kid who came once and has not been back. His story is a reminder that belonging is often built through ordinary acts repeated with care. Sometimes showing up for someone is all it takes.",
    ],
    context:
      "Mustafa's story shows how a NeighborNet turns a weekly hangout into dependable brotherhood, mentorship, and a place to keep growing.",
    portrait: portraitFive,
    heroImage: mustafaPhoto,
    heroAlt: "Mustafa surrounded by friends at a Young Muslims gathering.",
    theme: "brothers",
    rotation: 0,
    editorialDraft: false,
  },
  {
    slug: "a-place-to-be-known",
    name: "A YM sister",
    chapter: "Young Muslims community",
    title: "A place to be known",
    quote: "The small check-ins are what made this feel like my community.",
    summary:
      "A weekly gathering became a dependable circle of sisters who noticed when someone was missing, celebrated the good weeks, and stayed close through the difficult ones.",
    fullStory: [
      "This editorial story slot is reserved for a future member interview. It is structured to show how a first visit can grow into consistent friendship and a deeper sense of belonging.",
      "The final story will be written with the member in her own words and reviewed with her before publication.",
    ],
    context:
      "This is an editorial draft entry included to complete the interaction while additional member interviews are gathered.",
    portrait: portraitOne,
    heroImage: portraitOne,
    heroAlt: "A Young Muslims community member smiling at an event.",
    theme: "sisters",
    rotation: 0,
    editorialDraft: true,
  },
  {
    slug: "the-seat-they-saved",
    name: "A YM sister",
    chapter: "Young Muslims community",
    title: "The seat they saved",
    quote: "Coming back got easier when I knew somebody was expecting me.",
    summary:
      "What began as an unfamiliar room became a weekly rhythm of faith, laughter, and friends who made returning feel natural.",
    fullStory: [
      "This editorial story slot is reserved for a future member interview about the quiet gestures that make a new person feel expected and welcome.",
      "The final story will be written with the member in her own words and reviewed with her before publication.",
    ],
    context:
      "This is an editorial draft entry included to complete the interaction while additional member interviews are gathered.",
    portrait: portraitTwo,
    heroImage: portraitTwo,
    heroAlt: "A Young Muslims community member at a gathering.",
    theme: "sisters",
    rotation: 0,
    editorialDraft: true,
  },
  {
    slug: "growing-by-serving",
    name: "A YM brother",
    chapter: "Young Muslims community",
    title: "Growing by serving",
    quote:
      "They trusted me with responsibility before I saw myself as a leader.",
    summary:
      "Small responsibilities at weekly programs became a path toward service, confidence, and leadership rooted in community.",
    fullStory: [
      "This editorial story slot is reserved for a future member interview about learning to lead through service and consistent responsibility.",
      "The final story will be written with the member in his own words and reviewed with him before publication.",
    ],
    context:
      "This is an editorial draft entry included to complete the interaction while additional member interviews are gathered.",
    portrait: portraitThree,
    heroImage: portraitThree,
    heroAlt: "A Young Muslims community member at an event.",
    theme: "brothers",
    rotation: 0,
    editorialDraft: true,
  },
  {
    slug: "brotherhood-in-the-everyday",
    name: "A YM brother",
    chapter: "Young Muslims community",
    title: "Brotherhood in the everyday",
    quote:
      "The ordinary weeks are the ones that built the strongest friendships.",
    summary:
      "Pickup games, late conversations, and regular halaqas became the everyday foundation for friendships that lasted beyond the program calendar.",
    fullStory: [
      "This editorial story slot is reserved for a future member interview about the ordinary weekly moments that develop into lasting brotherhood.",
      "The final story will be written with the member in his own words and reviewed with him before publication.",
    ],
    context:
      "This is an editorial draft entry included to complete the interaction while additional member interviews are gathered.",
    portrait: portraitSix,
    heroImage: portraitSix,
    heroAlt: "A Young Muslims community member outdoors with friends.",
    theme: "brothers",
    rotation: 165,
    editorialDraft: true,
  },
] as const satisfies readonly Story[];

export type StorySlug = (typeof STORIES)[number]["slug"];

export function getStoryBySlug(slug: string | null | undefined): Story | null {
  if (!slug) return null;
  return STORIES.find((story) => story.slug === slug) ?? null;
}
