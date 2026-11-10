import type { StaticImageData } from "next/image";

import mustafaPhoto from "../../../design-assets/figma/landing-2026/stories/photo-mustafa-r.jpg";
import photoMaryam from "../../../design-assets/figma/landing-2026/stories/photo-maryam-t.jpg";
import photoLayla from "../../../design-assets/figma/landing-2026/stories/photo-layla-h.jpg";
import photoBilal from "../../../design-assets/figma/landing-2026/stories/photo-bilal-s.jpg";
import photoYusuf from "../../../design-assets/figma/landing-2026/stories/photo-yusuf-a.jpg";
import photoMaryamDesktop from "../../../design-assets/figma/landing-2026/stories/photo-maryam-t-desktop.jpg";
import photoLaylaDesktop from "../../../design-assets/figma/landing-2026/stories/photo-layla-h-desktop.jpg";
import photoBilalDesktop from "../../../design-assets/figma/landing-2026/stories/photo-bilal-s-desktop.jpg";
import photoYusufDesktop from "../../../design-assets/figma/landing-2026/stories/photo-yusuf-a-desktop.jpg";
import rahmahPhoto from "../../../design-assets/figma/landing-2026/stories/photo-rahmah-k.jpg";
import headshotBilal from "../../../design-assets/figma/landing-2026/stories/headshot-bilal-s.png";
import headshotLayla from "../../../design-assets/figma/landing-2026/stories/headshot-layla-h.png";
import headshotMaryam from "../../../design-assets/figma/landing-2026/stories/headshot-maryam-t.png";
import headshotMustafa from "../../../design-assets/figma/landing-2026/stories/headshot-mustafa-r.png";
import headshotRahmah from "../../../design-assets/figma/landing-2026/stories/headshot-rahmah-k.png";
import headshotYusuf from "../../../design-assets/figma/landing-2026/stories/headshot-yusuf-a.png";

/*
 * PLACEHOLDER CONTENT, pending Young Muslims' real stories. Swap freely:
 * the landing stories snippet (people-stories-section.tsx) reads only this
 * array, in this order.
 *
 * - `placeholderStory`: true for the four invented stories (Yusuf, Layla,
 *   Bilal, Maryam). Mustafa's and Rahmah's quote and narrative are
 *   transcribed from the Figma story views (249:18 and 246:85).
 * - The portraits are real: the six Figma headshot shapes (84:219) and the
 *   story-view photos (Mustafa's and Rahmah's from the Figma story views,
 *   the other four from Figma 575:506, 575:523, 575:540 and 575:571).
 * - `slug` is the full story at /stories/[slug]. Only mustafa-r and rahmah-k
 *   exist yet; the others 404 until the Stories pages are built.
 */
export type StorySnippet = {
  slug: string;
  name: string;
  /** Shown as "YM {city}". */
  city: string;
  theme: "brothers" | "sisters";
  quote: string;
  narrative: string;
  /** The organic headshot shape on the landing page (pre-masked PNG). */
  headshot: StaticImageData;
  /** The story view's full-bleed photo. */
  photo: StaticImageData;
  /**
   * A wider crop for the desktop band (wide and short), with the face 30%
   * down; when absent, `photo` serves every size.
   */
  photoDesktop?: StaticImageData;
  placeholderStory: boolean;
};

export const STORY_SNIPPETS: StorySnippet[] = [
  {
    slug: "rahmah-k",
    name: "Rahmah K.",
    city: "Chicago",
    theme: "sisters",
    quote:
      "I didn’t think I was religious enough to belong there. Nobody made me feel that way — they just made room for me.",
    narrative:
      "Rahmah almost didn’t walk into her first NeighborNet. A friend had to drag her along, and she spent that first night sitting quietly in the back, sure she didn’t fit in. She kept coming anyway. Three years later, she’s the one leading halaqas — and the sisters she met have become the people she calls first, good news or bad. For Rahmah, Young Muslims wasn’t just where she found her people. It’s where she found herself.",
    headshot: headshotRahmah,
    photo: rahmahPhoto,
    placeholderStory: false,
  },
  {
    slug: "mustafa-r",
    name: "Mustafa R.",
    city: "New Jersey",
    theme: "brothers",
    quote:
      "I came for the pizza, honestly. I stayed because these guys became my brothers.",
    narrative:
      "Mustafa showed up to his first YM night for the free food and a break from a rough week — he wasn’t looking for anything more. But the guys kept texting, kept saving him a seat, kept pulling him back. What started as somewhere to be on a Saturday turned into the people he leaned on through his hardest stretch. Now he’s the one messaging the new kid who came once and hasn’t been back. For Mustafa, Young Muslims is proof that showing up for someone is sometimes all it takes.",
    headshot: headshotMustafa,
    photo: mustafaPhoto,
    placeholderStory: false,
  },
  {
    slug: "maryam-t",
    name: "Maryam T.",
    city: "Atlanta",
    theme: "sisters",
    quote:
      "I came in the quietest person in the room. YM is where I found my voice — and the people who wanted to hear it.",
    narrative:
      "Maryam joined her NeighborNet convinced she’d stay in the background forever. The sisters kept gently pulling her forward — asking her to share, to help plan, eventually to lead. Somewhere along the way the girl who dreaded speaking up was running halaqas and mentoring the newer members. The sisters she met became her closest friends and her biggest push. For Maryam, Young Muslims didn’t just give her a community — it gave her the confidence to lead it.",
    headshot: headshotMaryam,
    photo: photoMaryam,
    photoDesktop: photoMaryamDesktop,
    placeholderStory: true,
  },
  {
    slug: "layla-h",
    name: "Layla H.",
    city: "Houston",
    theme: "sisters",
    quote:
      "I used to think faith was something you did alone. These girls showed me it’s something you carry together.",
    narrative:
      "Layla came to her first halaqa guarded, half-expecting to be judged for how much she didn’t know. Instead the sisters met her exactly where she was — no lecture, no side-eye, just space to ask the questions she’d been sitting on for years. She kept showing up, first to listen, then to help run the night. The friendships became the ones she turns to for everything now. For Layla, Young Muslims is where faith stopped feeling like a solo thing.",
    headshot: headshotLayla,
    photo: photoLayla,
    photoDesktop: photoLaylaDesktop,
    placeholderStory: true,
  },
  {
    slug: "bilal-s",
    name: "Bilal S.",
    city: "Minneapolis",
    theme: "brothers",
    quote:
      "I showed up once as a favor to a friend. I kept showing up because for the first time it felt like I didn’t have to explain myself.",
    narrative:
      "Bilal went to his first YM event to get a friend off his back, fully planning to leave early. But something about being in a room where he didn’t have to translate half of who he was made him stay till the lights went off. The brothers became the people he called when things got heavy and the ones he celebrated with when they didn’t. Now he’s usually the one setting up the chairs before everyone arrives. For Bilal, Young Muslims is the first place that felt like it was already his.",
    headshot: headshotBilal,
    photo: photoBilal,
    photoDesktop: photoBilalDesktop,
    placeholderStory: true,
  },
  {
    slug: "yusuf-a",
    name: "Yusuf A.",
    city: "Dallas",
    theme: "brothers",
    quote:
      "I moved cities not knowing a single person. Two weeks later I had a group chat that wouldn’t stop going off.",
    narrative:
      "Yusuf transferred for school and figured he’d spend the year keeping to himself. A guy from his MSA mentioned a NeighborNet a few blocks from his apartment, and he went mostly to have something to do on a weeknight. The brothers folded him in like they’d known him for years — rides to Jummah, late-night food runs, someone always checking if he was coming. The city stopped feeling like a place he was stuck in. For Yusuf, Young Muslims turned a hard year into the one he’d go back to.",
    headshot: headshotYusuf,
    photo: photoYusuf,
    photoDesktop: photoYusufDesktop,
    placeholderStory: true,
  },
];
