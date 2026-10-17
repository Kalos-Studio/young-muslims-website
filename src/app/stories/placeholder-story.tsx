import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getStoryBySlug } from "@/lib/stories";
import type { PortraitSlot } from "./portrait-slots";
import { StoriesCta } from "./stories-sections";
import back from "../../../design-assets/figma/story-detail/back.svg";
import chevron from "../../../design-assets/figma/story-detail/chevron.svg";
import mark from "../../../design-assets/figma/story-detail/ym-mark.svg";
import mobileMark from "../../../design-assets/figma/story-detail/mobile-ym-mark.svg";
import mobileCta from "../../../design-assets/figma/story-detail/mobile-cta.png";
import styles from "./story-detail.module.css";
import placeholder from "./placeholder-story.module.css";

const CHAPTERS = [
  [
    "How it started",
    "Placeholder: the invitation, first visit, or moment that began this story.",
  ],
  [
    "The turning point",
    "Placeholder: an experience or connection that made a difference.",
  ],
  [
    "Where things are now",
    "Placeholder: what comes next and what this community means to this member today.",
  ],
];

export function PlaceholderStory({ slot }: { slot: PortraitSlot }) {
  const story = getStoryBySlug(slot.slug ?? null);
  return (
    <main data-stories-page className={styles.page}>
      <article>
        <header className={placeholder.hero} data-header-theme="light">
          <div className={styles.headingRow}>
            <Link href="/stories#stories-heading" className={styles.back}>
              <Image src={back} alt="" />
              All Stories
            </Link>
            <h1 className="font-display text-landing-section">
              EVERY PERSON.
              <br />A STORY TO TELL.
            </h1>
          </div>
          <div className={placeholder.feature}>
            <div className={placeholder.portrait}>
              <Image
                src={story?.portrait ?? slot.image}
                alt={
                  story
                    ? `Portrait of ${story.name}`
                    : "Selected community portrait"
                }
                fill
                priority
                sizes="(max-width: 767px) 70vw, 360px"
                className="object-contain"
                style={{ rotate: `${story?.rotation ?? 0}deg` }}
              />
            </div>
            <div className={placeholder.intro}>
              <p className={placeholder.label}>Story coming soon</p>
              <h2 className="text-h2">
                {story?.name ?? "A voice from our community"}
              </h2>
              <p>
                This space is reserved for this member’s story. The full story
                and personal reflections will be added here.
              </p>
              <p className={placeholder.note}>Placeholder content</p>
            </div>
          </div>
          <svg
            className={placeholder.curve}
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 65C240 -40 360 5 600 62S1000 100 1200 45S1380 30 1440 65V100H0Z"
              fill="currentColor"
            />
          </svg>
        </header>
        <section
          className={`${styles.body} ${placeholder.body}`}
          aria-label="Story preview"
          data-header-theme="light"
        >
          <div
            aria-hidden="true"
            className={styles.watermark}
            style={
              {
                "--desktop-art": `url(${mark.src})`,
                "--mobile-art": `url(${mobileMark.src})`,
              } as CSSProperties
            }
          />
          <div className={styles.copy}>
            <div className={styles.narrative}>
              <p className={placeholder.label}>The story is on its way</p>
              <p>
                Every journey is different. This page will share one member’s
                experience of finding community, building friendships, and
                growing with Young Muslims.
              </p>
              <p>
                The sections below show where their story will unfold. These are
                placeholders, not a personal account or quotation.
              </p>
            </div>
            <div className={styles.chapters}>
              {CHAPTERS.map(([title, text]) => (
                <details key={title} open className={styles.chapter}>
                  <summary>
                    {title}
                    <Image src={chevron} alt="" />
                  </summary>
                  <p>{text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </article>
      <StoriesCta mobilePhoto={mobileCta} />
    </main>
  );
}
