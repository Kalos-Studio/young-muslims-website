import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";

import photo from "../../../design-assets/figma/story-detail/rahmah.png";
import curve from "../../../design-assets/figma/story-detail/curve.svg";
import mobileQuote from "../../../design-assets/figma/story-detail/mobile-quote.svg";
import mobileMark from "../../../design-assets/figma/story-detail/mobile-ym-mark.svg";
import mobileCta from "../../../design-assets/figma/story-detail/mobile-cta.png";
import quote from "../../../design-assets/figma/story-detail/quote.svg";
import mark from "../../../design-assets/figma/story-detail/ym-mark.svg";
import back from "../../../design-assets/figma/story-detail/back.svg";
import chevron from "../../../design-assets/figma/story-detail/chevron.svg";
import { StoriesCta } from "./stories-sections";
import styles from "./story-detail.module.css";

// Figma 413:69. Keep this page's editorial content separate from the landing dialog.
const PARAGRAPHS = [
  "Rahmah almost didn’t walk into her first NeighborNet. A friend had to drag her along, and she spent that first night sitting quietly in the back, certain she didn’t fit in. She wasn’t the most practicing, didn’t know the other girls, and figured she’d be out of place.",
  "Nobody made her feel that way. The sisters just made room, asked about her week, remembered her name, invited her back. She kept coming, and somewhere along the way the girls she met became the people she calls first, good news or bad.",
  "Three years later, Rahmah is the one leading halaqas, standing in front of the room she once sat at the back of. It’s something she never would have imagined doing, and she’s quick to say YM is where she found the confidence to do it. For Rahmah, it was never about being the most religious person in the room. It was about being in the room at all.",
];
const CHAPTERS = [
  {
    title: "How she started",
    text: "A classmate invited her, promising they’d grab food after. Rahmah came for the hangout and almost didn’t return, until a sister from the NeighborNet followed up and made her feel genuinely wanted.",
  },
  {
    title: "The turning point",
    text: "The first time Rahmah was asked to prepare a short halaqa, she was terrified. “I was sure I’d mess it up.” She did fine, and more importantly, the sisters talked it through with her afterward instead of judging her. That’s when she realized YM was a place she could grow, not just belong.",
  },
  {
    title: "Where she is now",
    text: "Rahmah leads her NeighborNet’s halaqas and mentors younger sisters, especially the ones who, like her, don’t think they’re “enough” to be there yet.",
  },
];

export function RahmahStory() {
  return (
    <main data-stories-page className={styles.page}>
      <article>
        <header className={styles.hero} data-header-theme="light">
          <div className={styles.heroPhoto}>
            <Image
              src={photo}
              alt="Rahmah and a friend seated together in front of a floral backdrop."
              fill
              priority
              sizes="(max-width: 767px) 728px, 114vw"
              className="object-cover"
            />
          </div>
          <div className={styles.shade} />
          <div
            aria-hidden="true"
            className={styles.topCurve}
            style={{ backgroundImage: `url(${curve.src})` }}
          />
          <div
            aria-hidden="true"
            className={styles.bottomCurve}
            style={{ backgroundImage: `url(${curve.src})` }}
          />
          <div className={styles.headingRow}>
            <Link href="/stories#stories-heading" className={styles.back}>
              <Image src={back} alt="" />
              All Stories
            </Link>
            <h1 className="font-display text-landing-section">
              COMING IN UNSURE.
              <br />
              LEAVING WITH CONFIDENCE.
            </h1>
          </div>
          <div
            aria-hidden="true"
            className={styles.quoteMark}
            style={
              {
                "--desktop-art": `url(${quote.src})`,
                "--mobile-art": `url(${mobileQuote.src})`,
              } as CSSProperties
            }
          />
          <figure className={styles.quote}>
            <blockquote>
              I didn&apos;t think I was religious enough to belong there. Nobody
              made me feel that way, they just made room for me.
            </blockquote>
            <figcaption>Rahmah K., YM Chicago</figcaption>
          </figure>
        </header>
        <section
          className={styles.body}
          data-header-theme="light"
          aria-label="Rahmah’s story"
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
              {PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.chapters}>
              {CHAPTERS.map((chapter) => (
                <details key={chapter.title} open className={styles.chapter}>
                  <summary>
                    {chapter.title}
                    <Image src={chevron} alt="" />
                  </summary>
                  <p>{chapter.text}</p>
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
