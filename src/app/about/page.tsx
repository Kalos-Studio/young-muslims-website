import type { Metadata } from "next";
import { PhotoPageHero } from "@/components/site/photo-page-hero";
import aboutHero from "../../../design-assets/photos/10-24 photo 2026 Qiyam Night.jpg";
import { EditorialLink, EditorialPhoto } from "@/components/site/editorial";
import service from "../../../design-assets/figma/landing-2026/card-impact-source.jpeg";
import { FaqSection } from "./faq-section";
import { VisionMissionHistory } from "./vision-mission-history";
import { LocalToNational } from "./local-to-national";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "Who We Are",
  description:
    "From local NeighborNets to national advocacy: how Young Muslims develops faith, builds leaders, and contributes to the Islamic movement.",
};

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <PhotoPageHero
        image={aboutHero}
        imageAlt="Young Muslim sisters gathered together at a qiyam night"
        nextSurface="primary"
        title={
          <>
            Rooted locally.
            <br />
            Growing together.
          </>
        }
        description="YM begins with a local circle of friends and grows into a national network of young Muslims learning their Deen, serving their communities, and taking part in the broader Islamic movement."
        href="/neighbornets"
        cta="Find your people"
      />

      <VisionMissionHistory />

      <LocalToNational />

      <section
        className="mx-auto max-w-7xl px-8 py-20 lg:px-20"
        data-header-theme="light"
        aria-labelledby="movement-heading"
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-nav font-bold text-secondary">Faith in action</p>
            <h2
              id="movement-heading"
              className="mt-6 text-mobile-section font-extrabold text-accent md:text-section"
            >
              Part of a<br />
              bigger movement.
            </h2>
            <p className="mt-6 text-lead font-medium">
              Our growth carries a responsibility: to serve, speak up, and
              contribute to the world around us as Muslims.
            </p>
            <p className="mt-6 text-body">
              YM is part of a broader Islamic movement in North America.
              Developing young Muslims means helping them live their faith
              individually and carry its responsibilities collectively, in their
              neighborhoods and beyond.
            </p>
          </div>
          <EditorialPhoto
            src={service}
            alt="Young Muslims participating in community service"
            className="aspect-square"
          />
        </div>
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          <article className="border-t border-border pt-8">
            <h3 className="text-card-title font-semibold">
              Service close to home
            </h3>
            <p className="mt-4 text-body">
              Local chapters work with charities on food distribution, food
              pantries, and neighborhood cleanups. Partnerships with relief
              organizations connect members to wider humanitarian efforts.
            </p>
          </article>
          <article className="border-t border-border pt-8">
            <h3 className="text-card-title font-semibold">
              Advocacy with a wider voice
            </h3>
            <p className="mt-4 text-body">
              Learning to care about an issue locally can lead to speaking up
              together nationally. YM&apos;s 2025 annual report records 70
              members joining Palestine Advocacy Day and training in Washington,
              D.C., through its work with American Muslims for Palestine.
            </p>
            <a
              href="https://ymsite.com/wp-content/uploads/2026/02/YM-Annual-Report-2025-FINAL.pdf"
              className="mt-6 inline-block text-nav font-bold text-secondary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Read the 2025 annual report (PDF)
            </a>
          </article>
          <article className="border-t border-border pt-8">
            <h3 className="text-card-title font-semibold">
              Islamic work that continues
            </h3>
            <p className="mt-4 text-body">
              The aim reaches beyond a member&apos;s time in YM: young Muslims
              prepared to carry their faith into community life through personal
              practice and collective contribution to society.
            </p>
          </article>
        </div>
        <div className="mt-8">
          <EditorialLink href="/support">Support the work</EditorialLink>
        </div>
      </section>

      <section className="bg-muted py-20" aria-labelledby="leadership-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-8 lg:grid-cols-2 lg:px-20">
          <div>
            <p className="text-nav font-bold text-secondary">Our leadership</p>
            <h2
              id="leadership-heading"
              className="mt-6 text-mobile-section font-extrabold md:text-section"
            >
              Led by youth.
              <br />
              Built on care.
            </h2>
          </div>
          <div>
            <p className="text-lead font-medium">
              Leadership connects the weekly gathering to the wider work, with
              responsibility rooted in the communities it serves.
            </p>
            <p className="mt-6 text-body">
              Our brothers and sisters wings operate independently, with local
              gatherings and leadership that support their communities.
              Together, they share a commitment to companionship, mentorship,
              education, and service.
            </p>
            <div className="mt-8">
              <EditorialLink href="/contact">Get in touch</EditorialLink>
            </div>
          </div>
        </div>
      </section>
      <div
        id="faq"
        className="mx-auto max-w-7xl scroll-mt-40 px-8 py-20 lg:px-20"
      >
        <FaqSection />
      </div>
      <section
        className="bg-accent py-20 text-accent-foreground"
        data-header-theme="dark"
      >
        <div className="mx-auto max-w-7xl px-8 lg:px-20">
          <p className="text-nav font-bold">
            A national effort starts with people like you.
          </p>
          <h2 className="mt-6 max-w-3xl text-mobile-section font-extrabold md:text-section">
            Start locally. Be part of something bigger.
          </h2>
          <div className="mt-8">
            <EditorialLink href="/neighbornets">
              Find a chapter near you
            </EditorialLink>
          </div>
        </div>
      </section>
    </main>
  );
}
