import type { StaticImageData } from "next/image";

import { STORY_SNIPPETS } from "../landing/story-snippets";
import { ALUMNI, type Alumnus } from "./alumni";
import { GALLERY_PEOPLE, type GalleryPerson } from "./gallery-people";

import bilalDesktop from "../../../design-assets/figma/stories/story-page/photos/bilal-s-desktop.jpg";
import bilalMobile from "../../../design-assets/figma/stories/story-page/photos/bilal-s-mobile.jpg";
import bilalTablet from "../../../design-assets/figma/stories/story-page/photos/bilal-s-tablet.jpg";
import c08a9bDesktop from "../../../design-assets/figma/stories/story-page/photos/community-08a9b-desktop.jpg";
import c08a9bMobile from "../../../design-assets/figma/stories/story-page/photos/community-08a9b-mobile.jpg";
import c08a9bTablet from "../../../design-assets/figma/stories/story-page/photos/community-08a9b-tablet.jpg";
import c093fbDesktop from "../../../design-assets/figma/stories/story-page/photos/community-093fb-desktop.jpg";
import c093fbMobile from "../../../design-assets/figma/stories/story-page/photos/community-093fb-mobile.jpg";
import c093fbTablet from "../../../design-assets/figma/stories/story-page/photos/community-093fb-tablet.jpg";
import c1d75bDesktop from "../../../design-assets/figma/stories/story-page/photos/community-1d75b-desktop.jpg";
import c1d75bMobile from "../../../design-assets/figma/stories/story-page/photos/community-1d75b-mobile.jpg";
import c1d75bTablet from "../../../design-assets/figma/stories/story-page/photos/community-1d75b-tablet.jpg";
import c2e353Desktop from "../../../design-assets/figma/stories/story-page/photos/community-2e353-desktop.jpg";
import c2e353Mobile from "../../../design-assets/figma/stories/story-page/photos/community-2e353-mobile.jpg";
import c2e353Tablet from "../../../design-assets/figma/stories/story-page/photos/community-2e353-tablet.jpg";
import c41fcaDesktop from "../../../design-assets/figma/stories/story-page/photos/community-41fca-desktop.jpg";
import c41fcaMobile from "../../../design-assets/figma/stories/story-page/photos/community-41fca-mobile.jpg";
import c41fcaTablet from "../../../design-assets/figma/stories/story-page/photos/community-41fca-tablet.jpg";
import c4b24aDesktop from "../../../design-assets/figma/stories/story-page/photos/community-4b24a-desktop.jpg";
import c4b24aMobile from "../../../design-assets/figma/stories/story-page/photos/community-4b24a-mobile.jpg";
import c4b24aTablet from "../../../design-assets/figma/stories/story-page/photos/community-4b24a-tablet.jpg";
import c4ca3dDesktop from "../../../design-assets/figma/stories/story-page/photos/community-4ca3d-desktop.jpg";
import c4ca3dMobile from "../../../design-assets/figma/stories/story-page/photos/community-4ca3d-mobile.jpg";
import c4ca3dTablet from "../../../design-assets/figma/stories/story-page/photos/community-4ca3d-tablet.jpg";
import c8245bDesktop from "../../../design-assets/figma/stories/story-page/photos/community-8245b-desktop.jpg";
import c8245bMobile from "../../../design-assets/figma/stories/story-page/photos/community-8245b-mobile.jpg";
import c8245bTablet from "../../../design-assets/figma/stories/story-page/photos/community-8245b-tablet.jpg";
import c86dfeDesktop from "../../../design-assets/figma/stories/story-page/photos/community-86dfe-desktop.jpg";
import c86dfeMobile from "../../../design-assets/figma/stories/story-page/photos/community-86dfe-mobile.jpg";
import c86dfeTablet from "../../../design-assets/figma/stories/story-page/photos/community-86dfe-tablet.jpg";
import c995d1Desktop from "../../../design-assets/figma/stories/story-page/photos/community-995d1-desktop.jpg";
import c995d1Mobile from "../../../design-assets/figma/stories/story-page/photos/community-995d1-mobile.jpg";
import c995d1Tablet from "../../../design-assets/figma/stories/story-page/photos/community-995d1-tablet.jpg";
import ca4cd2Desktop from "../../../design-assets/figma/stories/story-page/photos/community-a4cd2-desktop.jpg";
import ca4cd2Mobile from "../../../design-assets/figma/stories/story-page/photos/community-a4cd2-mobile.jpg";
import ca4cd2Tablet from "../../../design-assets/figma/stories/story-page/photos/community-a4cd2-tablet.jpg";
import cab441Desktop from "../../../design-assets/figma/stories/story-page/photos/community-ab441-desktop.jpg";
import cab441Mobile from "../../../design-assets/figma/stories/story-page/photos/community-ab441-mobile.jpg";
import cab441Tablet from "../../../design-assets/figma/stories/story-page/photos/community-ab441-tablet.jpg";
import cb4dd1Desktop from "../../../design-assets/figma/stories/story-page/photos/community-b4dd1-desktop.jpg";
import cb4dd1Mobile from "../../../design-assets/figma/stories/story-page/photos/community-b4dd1-mobile.jpg";
import cb4dd1Tablet from "../../../design-assets/figma/stories/story-page/photos/community-b4dd1-tablet.jpg";
import cb649dDesktop from "../../../design-assets/figma/stories/story-page/photos/community-b649d-desktop.jpg";
import cb649dMobile from "../../../design-assets/figma/stories/story-page/photos/community-b649d-mobile.jpg";
import cb649dTablet from "../../../design-assets/figma/stories/story-page/photos/community-b649d-tablet.jpg";
import cbfb31Desktop from "../../../design-assets/figma/stories/story-page/photos/community-bfb31-desktop.jpg";
import cbfb31Mobile from "../../../design-assets/figma/stories/story-page/photos/community-bfb31-mobile.jpg";
import cbfb31Tablet from "../../../design-assets/figma/stories/story-page/photos/community-bfb31-tablet.jpg";
import cc2981Desktop from "../../../design-assets/figma/stories/story-page/photos/community-c2981-desktop.jpg";
import cc2981Mobile from "../../../design-assets/figma/stories/story-page/photos/community-c2981-mobile.jpg";
import cc2981Tablet from "../../../design-assets/figma/stories/story-page/photos/community-c2981-tablet.jpg";
import ce10abDesktop from "../../../design-assets/figma/stories/story-page/photos/community-e10ab-desktop.jpg";
import ce10abMobile from "../../../design-assets/figma/stories/story-page/photos/community-e10ab-mobile.jpg";
import ce10abTablet from "../../../design-assets/figma/stories/story-page/photos/community-e10ab-tablet.jpg";
import laylaDesktop from "../../../design-assets/figma/stories/story-page/photos/layla-h-desktop.jpg";
import laylaMobile from "../../../design-assets/figma/stories/story-page/photos/layla-h-mobile.jpg";
import laylaTablet from "../../../design-assets/figma/stories/story-page/photos/layla-h-tablet.jpg";
import maryamDesktop from "../../../design-assets/figma/stories/story-page/photos/maryam-t-desktop.jpg";
import maryamMobile from "../../../design-assets/figma/stories/story-page/photos/maryam-t-mobile.jpg";
import maryamTablet from "../../../design-assets/figma/stories/story-page/photos/maryam-t-tablet.jpg";
import mustafaDesktop from "../../../design-assets/figma/stories/story-page/photos/mustafa-r-desktop.jpg";
import mustafaMobile from "../../../design-assets/figma/stories/story-page/photos/mustafa-r-mobile.jpg";
import mustafaTablet from "../../../design-assets/figma/stories/story-page/photos/mustafa-r-tablet.jpg";
import rahmahDesktop from "../../../design-assets/figma/stories/story-page/photos/rahmah-k-desktop.jpg";
import rahmahMobile from "../../../design-assets/figma/stories/story-page/photos/rahmah-k-mobile.jpg";
import rahmahTablet from "../../../design-assets/figma/stories/story-page/photos/rahmah-k-tablet.jpg";
import yusufDesktop from "../../../design-assets/figma/stories/story-page/photos/yusuf-a-desktop.jpg";
import yusufMobile from "../../../design-assets/figma/stories/story-page/photos/yusuf-a-mobile.jpg";
import yusufTablet from "../../../design-assets/figma/stories/story-page/photos/yusuf-a-tablet.jpg";

/** The hero photo, cropped to each frame (scripts/story-page-assets.mjs). */
type HeroPhoto = {
  desktop: StaticImageData;
  tablet: StaticImageData;
  mobile: StaticImageData;
};

/** What every story page has, story or alumni. */
type StoryPageBase = {
  slug: string;
  /** "Rahmah K." */
  name: string;
  /** Sister or brother: the watermark monogram and the pronouns. */
  gender: "sister" | "brother";
  /**
   * The headline's lines (Boldonse, upper case). The last word is set in
   * Landing Cyan (its closing punctuation stays Obsidian).
   */
  headline: [string, string];
  quote: string;
  /** Under the pull-quote, after an em dash: "Rahmah K., YM Chicago". */
  attribution: string;
  /** The narrative's paragraphs. */
  narrative: string[];
  photo: HeroPhoto;
  photoAlt: string;
  /**
   * The hero band's shape (band-*-{0,1,2,3}.svg): 0 Figma's tilted blobs
   * (Rahmah's), 1 the landing hero's wave, 2 the closing CTA's window, 3
   * the Stories and NeighborNets hero waves.
   */
  band: 0 | 1 | 2 | 3;
  /**
   * PLACEHOLDER: true for the people whose story YM has not provided yet:
   * every word on their page is a stand-in, to swap for theirs. (Not
   * indexed.)
   */
  placeholder: boolean;
};

/**
 * A story page (/stories/[slug]; DESIGN-SYSTEM.md, "Story pages"): a
 * gallery face's story (`variant: "story"`, joined to the face by slug,
 * with the three accordions), or a team member's from the alumni row
 * (`variant: "alumni"`, alumni.ts; the same template without the
 * accordions).
 */
export type StoryPage = StoryPageBase &
  (
    | {
        variant: "story";
        /** The YM city, shown as "YM {city}". */
        city: string;
        /** The accordions: how they started, the turning point, where they are. */
        started: string;
        turningPoint: string;
        now: string;
      }
    | { variant: "alumni" }
  );

const PHOTOS: Record<string, HeroPhoto> = {
  "rahmah-k": {
    desktop: rahmahDesktop,
    tablet: rahmahTablet,
    mobile: rahmahMobile,
  },
  "mustafa-r": {
    desktop: mustafaDesktop,
    tablet: mustafaTablet,
    mobile: mustafaMobile,
  },
  "maryam-t": {
    desktop: maryamDesktop,
    tablet: maryamTablet,
    mobile: maryamMobile,
  },
  "layla-h": {
    desktop: laylaDesktop,
    tablet: laylaTablet,
    mobile: laylaMobile,
  },
  "bilal-s": {
    desktop: bilalDesktop,
    tablet: bilalTablet,
    mobile: bilalMobile,
  },
  "yusuf-a": {
    desktop: yusufDesktop,
    tablet: yusufTablet,
    mobile: yusufMobile,
  },
  "community-ab441": {
    desktop: cab441Desktop,
    tablet: cab441Tablet,
    mobile: cab441Mobile,
  },
  "community-08a9b": {
    desktop: c08a9bDesktop,
    tablet: c08a9bTablet,
    mobile: c08a9bMobile,
  },
  "community-2e353": {
    desktop: c2e353Desktop,
    tablet: c2e353Tablet,
    mobile: c2e353Mobile,
  },
  "community-c2981": {
    desktop: cc2981Desktop,
    tablet: cc2981Tablet,
    mobile: cc2981Mobile,
  },
  "community-86dfe": {
    desktop: c86dfeDesktop,
    tablet: c86dfeTablet,
    mobile: c86dfeMobile,
  },
  "community-1d75b": {
    desktop: c1d75bDesktop,
    tablet: c1d75bTablet,
    mobile: c1d75bMobile,
  },
  "community-093fb": {
    desktop: c093fbDesktop,
    tablet: c093fbTablet,
    mobile: c093fbMobile,
  },
  "community-b649d": {
    desktop: cb649dDesktop,
    tablet: cb649dTablet,
    mobile: cb649dMobile,
  },
  "community-995d1": {
    desktop: c995d1Desktop,
    tablet: c995d1Tablet,
    mobile: c995d1Mobile,
  },
  "community-8245b": {
    desktop: c8245bDesktop,
    tablet: c8245bTablet,
    mobile: c8245bMobile,
  },
  "community-bfb31": {
    desktop: cbfb31Desktop,
    tablet: cbfb31Tablet,
    mobile: cbfb31Mobile,
  },
  "community-4b24a": {
    desktop: c4b24aDesktop,
    tablet: c4b24aTablet,
    mobile: c4b24aMobile,
  },
  "community-4ca3d": {
    desktop: c4ca3dDesktop,
    tablet: c4ca3dTablet,
    mobile: c4ca3dMobile,
  },
  "community-41fca": {
    desktop: c41fcaDesktop,
    tablet: c41fcaTablet,
    mobile: c41fcaMobile,
  },
  "community-a4cd2": {
    desktop: ca4cd2Desktop,
    tablet: ca4cd2Tablet,
    mobile: ca4cd2Mobile,
  },
  "community-b4dd1": {
    desktop: cb4dd1Desktop,
    tablet: cb4dd1Tablet,
    mobile: cb4dd1Mobile,
  },
  "community-e10ab": {
    desktop: ce10abDesktop,
    tablet: ce10abTablet,
    mobile: ce10abMobile,
  },
};

type StoryContent = Pick<
  Extract<StoryPage, { variant: "story" }>,
  "headline" | "narrative" | "started" | "turningPoint" | "now"
>;

/*
 * The six stories, verbatim: Rahmah's from Figma 413:69, the other five as
 * YM provided them. Name, city, sister/brother and the pull-quote come from
 * STORY_SNIPPETS (shared with the landing's story overlay, so the two
 * agree).
 */
const STORIES: Record<string, StoryContent> = {
  "rahmah-k": {
    headline: ["COMING IN UNSURE.", "LEAVING WITH CONFIDENCE."],
    narrative: [
      "Rahmah almost didn’t walk into her first NeighborNet. A friend had to drag her along, and she spent that first night sitting quietly in the back, certain she didn’t fit in. She wasn’t the most practicing, didn’t know the other girls, and figured she’d be out of place.",
      "Nobody made her feel that way. The sisters just made room — asked about her week, remembered her name, invited her back. She kept coming, and somewhere along the way the girls she met became the people she calls first, good news or bad.",
      "Three years later, Rahmah is the one leading halaqas — standing in front of the room she once sat at the back of. It’s something she never would have imagined doing, and she’s quick to say YM is where she found the confidence to do it. For Rahmah, it was never about being the most religious person in the room. It was about being in the room at all.",
    ],
    started:
      "A classmate invited her, promising they’d grab food after. Rahmah came for the hangout and almost didn’t return — until a sister from the NeighborNet followed up and made her feel genuinely wanted.",
    turningPoint:
      "The first time Rahmah was asked to prepare a short halaqa, she was terrified. “I was sure I’d mess it up.” She did fine — and more importantly, the sisters talked it through with her afterward instead of judging her. That’s when she realized YM was a place she could grow, not just belong.",
    now: "Rahmah leads her NeighborNet’s halaqas and mentors younger sisters — especially the ones who, like her, don’t think they’re “enough” to be there yet.",
  },
  "mustafa-r": {
    headline: ["CAME FOR THE FOOD.", "STAYED FOR THE BROTHERS."],
    narrative: [
      "Mustafa showed up to his first YM night for the free food and a break from a rough week. He wasn’t looking for anything more. He figured he’d eat, keep to himself, and leave.",
      "But the guys kept texting. They saved him a seat the next week, then the week after, pulling him into group chats and late-night drives like he’d always been there. The friendships snuck up on him.",
      "Now Mustafa is one of the brothers doing the pulling-in, the one making sure the new guy in the back has someone to sit with. For Mustafa, YM wasn’t a program he joined. It was a group of brothers who decided he belonged before he did.",
    ],
    started:
      "A friend dragged him to a NeighborNet night promising pizza. He came for the food, sat quietly, and almost didn’t come back, until the group chat wouldn’t let him disappear.",
    turningPoint:
      "A rough stretch hit, and the brothers showed up for him without being asked. Rides, check-ins, a seat always saved. That’s when “some guys from YM” became “my brothers.”",
    now: "Mustafa helps run his NeighborNet and makes it his job to fold in whoever’s new, because someone did that for him.",
  },
  "yusuf-a": {
    headline: ["A NEW CITY.", "AN INSTANT FAMILY."],
    narrative: [
      "Yusuf transferred for school and figured he’d spend the year keeping to himself in a city where he knew no one. A guy from his MSA mentioned a NeighborNet a few blocks away, and he went mostly to have something to do on a weeknight.",
      "The brothers folded him in like they’d known him for years. Rides to Jummah, late-night food runs, someone always checking if he was coming. The city stopped feeling like a place he was stuck in.",
      "For Yusuf, Young Muslims turned a hard year into the one he’d go back to. He walked in a stranger and left with the kind of friends who help you move apartments.",
    ],
    started:
      "New to the city and knowing no one, Yusuf went to a nearby NeighborNet just to fill a weeknight. He didn’t expect to stay past the first hour.",
    turningPoint:
      "When the brothers started showing up for the small stuff, a ride here, a text there, Yusuf realized this wasn’t a one-off event. It was becoming home.",
    now: "Yusuf is a regular, and he’s usually the one texting the newcomer the address and offering a ride.",
  },
  "layla-h": {
    headline: ["FAITH WAS SOLO.", "UNTIL IT WASN’T."],
    narrative: [
      "Layla came to her first halaqa guarded, half-expecting to be judged for how much she didn’t know. She’d always treated faith as a private, solo thing, something to figure out on her own.",
      "Instead the sisters met her exactly where she was. No lecture, no side-eye, just space to ask the questions she’d been sitting on for years. She kept showing up, first to listen, then to help run the night.",
      "The friendships became the ones she turns to for everything now. For Layla, Young Muslims is where faith stopped feeling like something she carried alone and became something she carries with people who get it.",
    ],
    started:
      "Layla went to a halaqa expecting to feel out of place. Instead, the first question she asked was met with warmth, not judgment, so she came back.",
    turningPoint:
      "The night she realized she could say “I don’t know” out loud and still belong. That’s when faith stopped being a solo project.",
    now: "Layla helps lead her NeighborNet’s sisters’ nights and is the first to reassure a newcomer that they don’t need to have it all figured out.",
  },
  "bilal-s": {
    headline: ["SHOWED UP ONCE.", "NEVER LEFT."],
    narrative: [
      "Bilal went to his first YM event to get a friend off his back, fully planning to leave early. But something about being in a room where he didn’t have to translate half of who he was made him stay until the lights went off.",
      "The brothers became the people he called when things got heavy and the ones he celebrated with when they didn’t. Nobody needed the backstory. They just got it.",
      "Now he’s usually the one setting up the chairs before everyone arrives. For Bilal, Young Muslims is the first place that felt like it was already his.",
    ],
    started:
      "He came once as a favor, planning an early exit. The ease of being in that room, no explaining, no code-switching, kept him in his seat.",
    turningPoint:
      "When the brothers became the people he called first, good news or bad, Bilal knew this was more than a weekly hangout.",
    now: "Bilal’s the early one, chairs set up and door open, making the room he found easy to walk into for the next person.",
  },
  "maryam-t": {
    headline: ["THE QUIETEST IN THE ROOM.", "NOT ANYMORE."],
    narrative: [
      "Maryam joined her NeighborNet convinced she’d stay in the background forever. She was the quiet one, content to listen and never speak up.",
      "The sisters kept gently pulling her forward, asking her to share, to help plan, eventually to lead. Somewhere along the way the girl who dreaded speaking up was running halaqas and mentoring the newer members.",
      "The sisters she met became her closest friends and her biggest push. For Maryam, Young Muslims didn’t just give her a community. It gave her the confidence to lead it, and people who genuinely wanted to hear what she had to say.",
    ],
    started:
      "Maryam came in as the quiet one, planning to blend into the background. The sisters had other ideas.",
    turningPoint:
      "The first time she was asked to lead, and did it, nervous but supported. The room she’d hidden in became the room she stood in front of.",
    now: "Maryam runs halaqas and mentors newer sisters, especially the quiet ones, because she knows exactly what that first push can do.",
  },
};

/*
 * PLACEHOLDER: each placeholder face's sister or brother, from their gallery
 * face (7 sisters, 10 brothers). Swap with the rest of their content.
 */
const PLACEHOLDER_GENDERS: Record<string, StoryPage["gender"]> = {
  ab441: "sister",
  "08a9b": "brother",
  "2e353": "sister",
  c2981: "brother",
  "86dfe": "sister",
  "1d75b": "brother",
  "093fb": "brother",
  b649d: "sister",
  "995d1": "brother",
  "8245b": "sister",
  bfb31: "brother",
  "4b24a": "brother",
  "4ca3d": "brother",
  "41fca": "sister",
  a4cd2: "brother",
  b4dd1: "sister",
  e10ab: "brother",
};

/** PLACEHOLDER copy for a story YM has not provided yet (clearly marked). */
function placeholderContent(
  name: string,
  gender: StoryPage["gender"],
): StoryContent & { quote: string } {
  const they = gender === "sister" ? "she" : "he";
  const their = gender === "sister" ? "her" : "his";
  return {
    headline: ["EVERY PERSON.", "A STORY TO TELL."],
    quote:
      "Placeholder: a line from this member, in their own words, will go here once their story is in.",
    narrative: [
      `Placeholder: how ${name} first found Young Muslims, and what ${they} expected walking into ${their} first NeighborNet.`,
      `Placeholder: the people and moments that made it feel like ${their} community, in ${their} own words.`,
      `Placeholder: where ${they} is now, and what Young Muslims means to ${their} today. This story is coming soon.`,
    ],
    started: `Placeholder: how ${they} started, the invitation or first visit that began ${their} story.`,
    turningPoint: `Placeholder: the turning point, the moment ${they} knew this was ${their} place.`,
    now: `Placeholder: where ${they} is now, and how ${they} makes room for the next person.`,
  };
}

function storyFor(person: GalleryPerson, index: number): StoryPage {
  // Figma's shape for Rahmah (413:69); everyone else takes the other three
  // in turn, in gallery order.
  const band = (
    person.slug === "rahmah-k" ? 0 : (index % 3) + 1
  ) as StoryPage["band"];
  const snippet = STORY_SNIPPETS.find((story) => story.slug === person.slug);
  if (snippet && STORIES[person.slug]) {
    return {
      variant: "story",
      slug: person.slug,
      name: snippet.name,
      city: snippet.city,
      attribution: `${snippet.name}, YM ${snippet.city}`,
      gender: snippet.theme === "sisters" ? "sister" : "brother",
      quote: snippet.quote,
      ...STORIES[person.slug],
      photo: PHOTOS[person.slug],
      photoAlt: `${snippet.name} with Young Muslims`,
      band,
      placeholder: false,
    };
  }
  const gender = PLACEHOLDER_GENDERS[person.face] ?? "brother";
  return {
    variant: "story",
    slug: person.slug,
    name: person.name,
    // PLACEHOLDER: their chapter.
    city: "Community",
    attribution: `${person.name}, YM Community`,
    gender,
    ...placeholderContent(person.name, gender),
    photo: PHOTOS[person.slug],
    photoAlt: "Young Muslims members together",
    band,
    placeholder: true,
  };
}

/** A team member's page: the alumni variant (no accordions). */
function alumnusPage(alumnus: Alumnus, index: number): StoryPage {
  return {
    variant: "alumni",
    slug: alumnus.slug,
    name: alumnus.name,
    gender: alumnus.gender,
    headline: alumnus.headline,
    quote: alumnus.quote,
    attribution: `${alumnus.name}, ${alumnus.role}, ${alumnus.tag}`,
    narrative: alumnus.narrative,
    photo: alumnus.photo,
    photoAlt: alumnus.photoAlt,
    // The three site shapes in turn, in the row's order.
    band: ((index % 3) + 1) as StoryPage["band"],
    placeholder: alumnus.placeholder,
  };
}

/**
 * Every story page: the gallery's, in its order (one per face), then the
 * team's (alumni.ts).
 */
export const STORY_PAGES: StoryPage[] = [
  ...GALLERY_PEOPLE.map(storyFor),
  ...ALUMNI.map(alumnusPage),
];

export function getStoryPage(slug: string) {
  return STORY_PAGES.find((page) => page.slug === slug);
}
