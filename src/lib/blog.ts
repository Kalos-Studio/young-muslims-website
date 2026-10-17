export type ArticleBlock =
  | { type: "paragraph" | "heading"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date?: string;
  read?: string;
  author?: string;
  category: "Resource" | "Article" | "Toolkit";
  image: string;
  heroImage?: string;
  content?: ArticleBlock[];
};

const listedPosts: BlogPost[] = [
  {
    id: "muslim-youth-issues-mental-health",
    title: "Muslim Youth Issues: Addressing Mental Health",
    excerpt:
      "We aim to address the current state of mental health among American Muslim youth and assist with mental health struggles of any kind. This report also helps guide community leaders by providing a toolkit to directly support them wherever they may be.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/mental-health.png",
  },
  {
    id: "muslim-youth-issues-judgement-stigma",
    title: "Muslim Youth Issues: Judgement Stigma",
    excerpt:
      "The goal of the YM Presents Muslim Youth Issues: Judgment Stigma campaign is to seek the pleasure of Allah (swt) by raising awareness of judgment and shame within the American Muslim community, providing constructive criticism through education about Islam’s stance on this issue, and presenting practical solutions and strategies to counteract judgment stigma within our communities.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/judgement-stigma.png",
  },
  {
    id: "ramadan-survival-guide",
    title: "Ramadan Survival Guide",
    excerpt:
      "Young Muslims would like to present it’s first-ever Ramadan Survival Guide! We pray this guide brings benefits and helps you optimize how to spend your time this Ramadan! In it you can find a daily to-do checklist, dua’s, exciting challenges and much more. Share with your friends, family, organizations, and the local community to reap the reward from it.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/ramadan-survival-guide.png",
    heroImage: "/images/blog/featured-ramadan.png",
  },
  {
    id: "how-to-give-a-khutbah",
    title: "How to Give a Khutbah",
    excerpt:
      "This short guide has been prepared to help young muslims, as well as anyone in the position of being a Khateeb. This guide is meant as an aide and as a starting point, it is strongly encouraged to go over the Khutba structure with a local Imam, chaplain, or student of knowledge.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/khutbah.png",
    heroImage: "/images/blog/featured.png",
  },
  {
    id: "supporting-the-black-community",
    title: "Supporting the Black Community",
    excerpt:
      "To properly raise awareness and educate ourselves about the systemic injustices towards the Black community in America, we have compiled a handbook that includes some civic engagement tools and action items to ensure that we are coming up with both short-term and long-term, sustainable strategies to support the Black community.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/black-community.png",
  },
  {
    id: "through-the-eyes-of-american-muslims",
    title: "Through the Eyes of American Muslims",
    excerpt:
      "In response to the ongoing genocide in Gaza and the West Bank, Khalil Center and Young Muslims surveyed and collected data from a poll of 213 American Muslims. This survey aims to understand the current state of American Muslims amid the genocide. It explores various aspects of their experiences, thoughts, and feelings during this challenging period.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/american-muslims.png",
  },
  {
    id: "palestine-resources",
    title: "Palestine Resources",
    excerpt:
      "Resources to aid in how to engage and support conversations, movements and protests for the people of Palestine.",
    date: "October 1, 2026",
    read: "5 min read",
    author: "Muneeb Syed",
    category: "Resource",
    image: "/images/blog/palestine-resources.png",
  },
];

const hijabPost: BlogPost = {
  id: "world-hijab-day-handbook",
  title: "World Hijab Day Handbook",
  excerpt:
    "The goal of our campaign is to educate others about the hijab, allow them to gain a comprehensive understanding of it, and show various ways in which Muslim women around the world celebrate and champion the hijab.",
  category: "Toolkit",
  image: "/images/blog/featured-hijab.png",
};

// Add full article blocks to `content` when editorial copy is available.
// Until then, the supplied Figma excerpt is the only article body.
export const blogPosts: BlogPost[] = [...listedPosts, hijabPost];
export const featuredPosts = [
  "how-to-give-a-khutbah",
  "world-hijab-day-handbook",
  "ramadan-survival-guide",
].map((id) => blogPosts.find((post) => post.id === id)!);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.id === slug);
}
