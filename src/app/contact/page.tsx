import type { Metadata } from "next";
import { ContactHero } from "./contact-hero";
import Link from "next/link";
import { EditorialLink, EditorialPhoto } from "@/components/site/editorial";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import people from "../../../design-assets/figma/landing-2026/card-people.jpeg";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with Young Muslims. Find your local chapter, start a NeighborNet, or learn more about getting involved.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main data-photo-hero-page className="bg-background text-foreground">
      <ContactHero />

      <section
        data-header-theme="light"
        id="connect"
        aria-labelledby="connect-heading"
        className="scroll-mt-40 bg-muted py-20"
      >
        <div className="mx-auto max-w-7xl px-8 lg:px-20">
          <div className="grid gap-8 md:grid-cols-2">
            <h2
              id="connect-heading"
              className="text-mobile-section font-extrabold md:text-section"
            >
              Find your
              <br />
              <span className="text-accent">way in.</span>
            </h2>
            <p className="max-w-lg self-end text-lead font-medium">
              You don&apos;t need to have it all figured out. Start with what
              brings you here.
            </p>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <article className="flex flex-col rounded-card bg-background p-8">
              <p className="text-nav font-bold text-secondary">
                Join the community
              </p>
              <h3 className="mt-6 text-card-title font-semibold">
                Meet your local chapter.
              </h3>
              <p className="mt-4 flex-1 text-body">
                Find a brothers or sisters NeighborNet near you. Explore local
                gatherings and connect with the people who make them happen.
              </p>
              <div className="mt-8">
                <EditorialLink href="/neighbornets">
                  Find a chapter
                </EditorialLink>
              </div>
            </article>
            <article className="flex flex-col rounded-card bg-primary p-8 text-primary-foreground">
              <p className="text-nav font-bold">Bring YM to your community</p>
              <h3 className="mt-6 text-card-title font-semibold">
                Start something meaningful.
              </h3>
              <p className="mt-4 flex-1 text-body">
                No chapter nearby? Our expansion team can connect you with
                leadership and resources to help you start a NeighborNet.
              </p>
              <a
                href="mailto:expansion@ymsite.com"
                className="ym-cta-trigger mt-8 inline-flex flex-wrap items-center gap-4 self-start py-4 text-body font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                <AnimatedCtaLabel label="expansion@ymsite.com" />
              </a>
            </article>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-card-title font-semibold">
                Still getting to know us?
              </h3>
              <p className="mt-4 text-body text-muted-foreground">
                Find answers about joining, age groups, membership, and more.
              </p>
            </div>
            <div>
              <EditorialLink href="/about#faq" secondary>
                Explore the FAQs
              </EditorialLink>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl items-center gap-8 px-8 py-20 lg:grid-cols-2 lg:gap-20 lg:px-20"
        data-header-theme="light"
      >
        <EditorialPhoto
          src={people}
          alt="A Young Muslims chapter spending time together by the water"
          className="aspect-square"
        />
        <div>
          <p className="text-nav font-bold text-secondary">Come as you are</p>
          <h2 className="mt-6 text-mobile-section font-extrabold text-accent md:text-section">
            New faces.
            <br />
            Real friends.
          </h2>
          <p className="mt-6 text-lead font-medium">
            Every friendship here started somewhere. Yours could start with the
            next weekly gathering.
          </p>
          <Link
            href="/about"
            className="ym-cta-trigger mt-8 inline-flex items-center gap-4 py-4 text-nav font-bold text-secondary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <AnimatedCtaLabel label="Get to know Young Muslims" />
          </Link>
        </div>
      </section>
    </main>
  );
}
