import { Fragment, type ReactNode } from "react";

import { Accordion } from "@/components/site/accordion";
import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";

/*
 * The pale background shape (Figma 608:3874, mirrored; vendored as
 * design-assets/figma/about/faq/shape.svg). Figma fills it #F9F3ED, which
 * has no token; like the youth section's shape it uses Landing Pale.
 */
const SHAPE =
  "M390.472 1151.6C472.77 1146.76 555.31 1163.47 629.137 1200.19C818.423 1294.39 1044.42 1255 1186.43 1057.89C1238.39 985.813 1308.74 930.523 1390.88 896.784C1750.33 749.074 1654.8 102.055 1056.36 117.391C975.517 119.49 896.688 101.006 825.04 63.5539C81.1263 -324.851 -363.931 1195.76 390.472 1151.6Z";

/* The questions and answers, verbatim from Figma (608:3798). */
const QUESTIONS: { question: string; answer: ReactNode }[] = [
  {
    question: "What is Young Muslims?",
    answer: (
      <>
        <p>
          Young Muslims (YM) is a pioneering national youth organization that
          has been on the youth scene since the early 90’s. We have established
          a well organized network of local youth groups that we call
          NeighborNets (which means the network of neighbors) across the United
          States.
        </p>
        <p>
          Each NeighborNet is a dynamic youth group which attempts to build a
          solid understanding of the principles of Islam amongst its members by
          helping them put these principles into practice. By providing the
          youth with an Islamic atmosphere where they can form bonds of
          brotherhood with their peers, they become comfortable with Islam and
          its teachings. We stress the importance of knowing, understanding, and
          fulfilling our individual and collective obligations as Muslims.
        </p>
        <p>
          The most fundamental aspect of YM is the Neighbornet. This is a weekly
          gathering of brothers who come together to discuss relevant issues in
          society, generally, learn about Islam, and just enjoy a Muslim
          atmosphere. Within each Neighbornet, we have a halaqa led by a YM
          member about different important topics. This is where YM members get
          the basic knowledge they need. We try to supplement these halaqas with
          activities and dinner to promote the safe space and brotherhood
          atmosphere that today’s youth are desperately seeking.
        </p>
      </>
    ),
  },
  {
    question: "How old do I have to be to join Young Muslims?",
    answer: <p>Our age range is between 13 to 25 years old.</p>,
  },
  {
    question: "How do I start a Young Muslims Neighbornet?",
    answer: (
      <p>
        If you are interested in starting a Neighbornet, please send an email to
        our expansion team at{" "}
        <a
          href="mailto:expansion@ymsite.com"
          className="font-extrabold underline outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow"
        >
          expansion@ymsite.com
        </a>
        . From there, we will connect you with any local leadership that is
        close by and other resources you may need.
      </p>
    ),
  },
  {
    question:
      "Does a Young Muslims Group have to be affiliated with a specific Masjid?",
    answer: (
      <p>
        No it is not necessary. There are YM Neighbornets which are the official
        youth groups of their local masajid but this is not a requirement to
        join. Meetings do not even have to necessarily take place in a Masjid.
        Whatever location best suits the growth and development of the
        Neighbornet should be chosen.
      </p>
    ),
  },
  {
    question: "Where is Young Muslims?",
    answer: (
      <p>
        Currently, we have official Sub-Regions in New Jersey, New York, Dallas,
        Houston, Florida, and Chicago, but we also have Expansion Units
        throughout the country and are actively seeking to expand further.
      </p>
    ),
  },
  {
    question: "How long does it take to get started?",
    answer: (
      <p>
        It does not take long at all. We just ask that the founders of a
        NeighborNet take the responsibility of maintaining the NeighborNet very
        seriously.
      </p>
    ),
  },
  {
    question: "Are there any membership fees?",
    answer: <p>No, there are no fees to join Young Muslims.</p>,
  },
];

/**
 * The About page's FAQ, after the partners (Figma 608:3743;
 * DESIGN-SYSTEM.md, "About FAQ"), `#faq` (the Contact page links here).
 *
 * Two columns from tablet: on the left the heading, a line and a "Contact
 * us" button (TextReveal); on the right seven
 * accordions, all closed at first, with dividers between. The left column
 * is `position: sticky` (never fixed: the footer's Easter egg transforms
 * the page) below the header, so it stays beside the questions as the
 * reader scrolls through the open ones, released as the list ends. Phones
 * stack the two, with nothing pinned.
 *
 * Behind the left column, a pale organic shape belongs to the section, not
 * the pinned copy: it starts at Figma's place (149 below the heading's top)
 * and drifts with the section's scroll (ScrollDrift,
 * `--about-faq-shape-drift`), lagging it slightly, so the copy pins over a
 * background that keeps moving. Static under reduced motion.
 */
export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative scroll-mt-20 overflow-clip bg-brand-warm-snow text-brand-obsidian md:scroll-mt-24.25"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto max-w-360"
      >
        <ScrollDrift
          token="--about-faq-shape-drift"
          fallback={96}
          className="absolute top-51.25 -left-177.75 h-312.25 w-400.25 will-change-transform md:top-57.25 md:-left-169.75 xl:-left-165.75"
        >
          <svg
            viewBox="0 0 1601 1249"
            className="size-full -scale-x-100 fill-landing-pale"
          >
            <path d={SHAPE} />
          </svg>
        </ScrollDrift>
      </div>
      <div className="relative mx-auto flex max-w-360 flex-col gap-12 px-8 pt-14 pb-20 md:grid md:grid-cols-2 md:items-start md:gap-8 md:px-16 md:pt-20 xl:px-20">
        <div className="relative md:sticky md:top-36">
          <TextReveal className="relative">
            <h2
              id="faq-heading"
              className="text-mobile-section font-extrabold md:text-landing-section"
            >
              Frequently asked questions.
            </h2>
            <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
              Have a question about a topic not listed here?
            </p>
            <StandardButton
              href="/contact"
              label="Contact us"
              {...textRevealUnit}
              className="mt-8"
            />
          </TextReveal>
        </div>
        <div className="relative flex flex-col gap-10 text-body md:text-article-title xl:text-landing-copy">
          {QUESTIONS.map(({ question, answer }, index) => (
            <Fragment key={question}>
              {index > 0 && <div aria-hidden className="h-px bg-border" />}
              <Accordion title={question} defaultOpen={false}>
                <div className="flex flex-col gap-5 md:gap-5.5 xl:gap-6">
                  {answer}
                </div>
              </Accordion>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
