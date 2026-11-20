import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PhotoTopCurve } from "@/components/site/photo-top-curve";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import { HighlightReelMarquee } from "../landing/highlight-reel-section";

import { SupportHero } from "./support-hero";
import { WhyItMatters } from "./why-it-matters";

export const metadata: Metadata = {
  alternates: { canonical: "/support" },
  title: "Support",
  description: "Give to the work, and see where it goes.",
};

const assets = "/images/support/";
const supportAreas = [
  {
    title: "NeighborNets",
    image: "neighbornets.png",
    mobileImage: "neighbornets-mobile.png",
    shape: "net-shape.svg",
    mobileShape: "net-shape-mobile.svg",
    width: 1066,
    height: 1058,
    description:
      "Keeping 200+ weekly gatherings running across the country, the heart of everything YM does.",
  },
  {
    title: "Retreats & Conferences",
    image: "retreats.png",
    mobileImage: "retreats-mobile.png",
    shape: "retreat-shape.svg",
    mobileShape: "retreat-shape-mobile.svg",
    width: 1066,
    height: 1000,
    description:
      "The getaways and weekend gatherings where friendships deepen and young Muslims grow.",
  },
  {
    title: "Leadership & Mentorship",
    image: "leadership.png",
    mobileImage: "leadership-mobile.png",
    shape: "leadership-shape.svg",
    mobileShape: "leadership-shape-mobile.svg",
    width: 1066,
    height: 1154,
    description:
      "Training the next generation of peer leaders, the brothers and sisters who run it all.",
  },
  {
    title: "Advocacy & Service",
    image: "service.png",
    mobileImage: "service-mobile.png",
    shape: "service-shape.svg",
    mobileShape: "service-shape-mobile.svg",
    width: 1066,
    height: 1074,
    description:
      "Mobilizing young Muslims to show up for their communities and speak up on the issues that matter.",
  },
];

const buttonClass =
  "ym-cta-trigger inline-flex items-center justify-center gap-4 bg-secondary px-6 py-4 text-nav font-bold text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export default function SupportPage() {
  return (
    <main
      data-support-page
      className="overflow-clip bg-background text-foreground"
    >
      <SupportHero>
        <WhyItMatters />

        <section
          aria-labelledby="legacy-title"
          className="relative isolate overflow-hidden pt-16 pb-80 lg:py-40"
        >
          <div className="mx-auto max-w-screen-2xl px-8 md:px-20">
            <h2
              id="legacy-title"
              className="max-w-5xl text-mobile-section font-extrabold lg:text-section"
            >
              Built over generations. Still growing.
            </h2>
            <a
              href="#donate"
              className={`${buttonClass} mt-8 w-full lg:w-auto`}
            >
              Support
            </a>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <picture>
              <source
                media="(max-width: 1023px)"
                srcSet={`${assets}ym-round-mobile.svg`}
              />{" "}
              <Image
                src={`${assets}ym-round.svg`}
                alt=""
                width={311}
                height={311}
                className="absolute top-24 -right-12 lg:top-80 lg:right-4"
              />
            </picture>
            <picture>
              <source
                media="(max-width: 1023px)"
                srcSet={`${assets}ym-mark-mobile.svg`}
              />{" "}
              <Image
                src={`${assets}ym-mark.svg`}
                alt=""
                width={311}
                height={311}
                className="absolute bottom-8 -left-4 lg:left-4"
              />
            </picture>
            <HighlightReelMarquee
              rows={[
                <picture key="top-words">
                  <source
                    media="(max-width: 1023px)"
                    srcSet={`${assets}words-top-mobile.svg`}
                  />{" "}
                  <Image
                    src={`${assets}words-top.svg`}
                    alt=""
                    width={1847}
                    height={60}
                    className="max-w-none"
                  />
                </picture>,
                <picture key="middle-words">
                  <source
                    media="(max-width: 1023px)"
                    srcSet={`${assets}words-middle-mobile.svg`}
                  />{" "}
                  <Image
                    src={`${assets}words-middle.svg`}
                    alt=""
                    width={2743}
                    height={65}
                    className="max-w-none -translate-x-1/4"
                  />
                </picture>,
                <picture key="bottom-words">
                  <source
                    media="(max-width: 1023px)"
                    srcSet={`${assets}words-bottom-mobile.svg`}
                  />{" "}
                  <Image
                    src={`${assets}words-bottom.svg`}
                    alt=""
                    width={1847}
                    height={60}
                    className="max-w-none"
                  />
                </picture>,
              ]}
            />
          </div>
          <figure className="relative mx-8 mt-20 overflow-hidden bg-primary md:mx-auto md:max-w-4xl lg:mt-32">
            <Image
              src={`${assets}legacy.png`}
              alt="A hall filled with young Muslims attending a conference"
              width={4096}
              height={2731}
              sizes="(max-width: 768px) 100vw, 896px"
              className="h-100 w-full object-cover opacity-60 lg:aspect-video lg:h-auto"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground lg:p-8">
              <p className="text-nav font-bold">Video coming soon</p>
              <p className="mt-4 text-lead font-semibold lg:text-card-title">
                This is Young Muslims: A Legacy for Generations
              </p>
            </figcaption>
          </figure>
        </section>

        <section
          aria-labelledby="impact-title"
          className="mx-auto max-w-screen-2xl px-8 pt-12 pb-20 md:px-20 lg:pt-20 lg:pb-40"
        >
          <h2
            id="impact-title"
            className="text-center text-mobile-section font-extrabold lg:text-section"
          >
            Where your support goes.
          </h2>
          <div className="mt-20 grid gap-x-32 gap-y-32 lg:grid-cols-2 lg:gap-y-20">
            {supportAreas.map((area, index) => (
              <article
                key={area.title}
                className={`relative isolate flex flex-col items-center gap-8 text-center ${index % 2 ? "lg:translate-y-40" : ""}`}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 -z-10"
                  aria-hidden="true"
                >
                  <picture>
                    <source
                      media="(max-width: 1023px)"
                      srcSet={`${assets}${area.mobileShape}`}
                    />
                    <Image
                      src={`${assets}${area.shape}`}
                      alt=""
                      width={791}
                      height={819}
                      className="h-auto w-full scale-125"
                    />
                  </picture>
                </div>
                <picture className="block w-full max-w-lg">
                  <source
                    media="(max-width: 1023px)"
                    srcSet={`${assets}${area.mobileImage}`}
                  />
                  <Image
                    src={`${assets}${area.image}`}
                    alt={
                      area.title === "NeighborNets"
                        ? "Young Muslim sisters gathered outdoors"
                        : area.title === "Retreats & Conferences"
                          ? "Friends spending time together at a retreat"
                          : area.title === "Leadership & Mentorship"
                            ? "A warm embrace between Muslim sisters"
                            : "Young Muslims gathering for community advocacy"
                    }
                    width={area.width}
                    height={area.height}
                    sizes="(max-width: 768px) 100vw, 533px"
                    className="h-auto w-full max-w-lg"
                  />
                </picture>
                <h3 className="text-mobile-section font-semibold lg:text-card-title">
                  {area.title}
                </h3>
                <p className="max-w-lg text-body font-medium lg:text-lead">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="support-cta-title"
          className="relative isolate mt-20 overflow-hidden bg-primary px-8 pt-40 pb-60 text-primary-foreground md:px-20 lg:mt-40 lg:py-60"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 bottom-0 -z-20 bg-primary"
          />
          <picture>
            <source
              media="(max-width: 1023px)"
              srcSet={`${assets}cta-mobile.png`}
            />
            <Image
              src={`${assets}cta.png`}
              alt="Young Muslims standing together in solidarity"
              width={4622}
              height={1513}
              sizes="(max-width: 1023px) 2880px, 160vw"
              className="absolute -top-24 left-1/2 -z-10 h-auto w-720 max-w-none -translate-x-1/2 rotate-4 lg:-top-20 lg:w-3/2"
            />
          </picture>
          <PhotoTopCurve />
          <div className="mx-auto grid max-w-6xl items-center gap-48 lg:grid-cols-3 lg:gap-20">
            <h2
              id="support-cta-title"
              className="text-center text-mobile-section font-extrabold lg:col-span-2 lg:text-left lg:text-section"
            >
              Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
            </h2>
            <div className="flex flex-col gap-8">
              <Link
                href="/neighbornets"
                className="ym-cta-trigger flex items-center justify-between gap-4 bg-background px-6 py-4 text-nav font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <AnimatedCtaLabel label="Get involved" />
              </Link>
              <a
                href="#donate"
                className="ym-cta-trigger flex items-center justify-between gap-4 border border-background px-6 py-4 text-nav font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <AnimatedCtaLabel label="Support us" />
              </a>
            </div>
          </div>
        </section>
      </SupportHero>
    </main>
  );
}
