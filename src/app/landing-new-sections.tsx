import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import closing01 from "../../design-assets/figma/landing-2026/closing-01.png";
import closing02 from "../../design-assets/figma/landing-2026/closing-02.png";
import closing03 from "../../design-assets/figma/landing-2026/closing-03.png";
import closing04 from "../../design-assets/figma/landing-2026/closing-04.png";
import closing05 from "../../design-assets/figma/landing-2026/closing-05.png";
import closing06 from "../../design-assets/figma/landing-2026/closing-06.png";
import chapterCardTexture from "../../design-assets/figma/landing-2026/new-sections/chapter-card-blob.svg";
import chapterCardShape from "../../design-assets/figma/landing-2026/new-sections/chapter-wave-bottom.svg";
import chapterPhoto from "../../design-assets/figma/landing-2026/new-sections/255-102-source-01.jpeg";
import chapterWave from "../../design-assets/figma/landing-2026/new-sections/chapter-wave-top.svg";
import ctaArrowDark from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-dark.svg";
import ctaArrowLight from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-light.svg";
import ctaCommunity from "../../design-assets/figma/landing-2026/new-sections/cta-community-ribbon-design.png";
import footerFacebook from "../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import footerInstagram from "../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import footerLogo from "../../design-assets/figma/landing-2026/new-sections/footer-logo.svg";
import footerTagline from "../../design-assets/figma/landing-2026/new-sections/footer-tagline.svg";
import footerX from "../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import footerYoutube from "../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";

const CITIES = [
  "HOUSTON",
  "STAMFORD",
  "SUWANEE",
  "TAMPA",
  "BROOKLYN",
  "NEWARK",
  "FRISCO",
] as const;

function ClosingPortrait({
  image,
  className,
}: {
  image: StaticImageData;
  className: string;
}) {
  return (
    <div className={`absolute ${className}`} aria-hidden="true">
      <Image src={image} alt="" fill sizes="250px" className="object-contain" />
    </div>
  );
}

export function PeopleStoriesSection() {
  return (
    <section
      data-header-theme="light"
      className="relative h-[1327px] w-full overflow-hidden bg-brand-warm-snow text-center"
    >
      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <ClosingPortrait
          image={closing01}
          className="top-[317px] left-[1096px] h-[189px] w-[197px]"
        />
        <ClosingPortrait
          image={closing02}
          className="top-[792px] left-[57px] h-[218px] w-[220px]"
        />
        <ClosingPortrait
          image={closing03}
          className="top-[989px] left-[578px] h-[215px] w-[226px]"
        />
        <ClosingPortrait
          image={closing04}
          className="top-[317px] left-[68px] h-[214px] w-[240px]"
        />
        <ClosingPortrait
          image={closing05}
          className="top-[225px] left-[600px] h-[219px] w-[204px]"
        />
        <ClosingPortrait
          image={closing06}
          className="top-[716px] left-[1088px] h-[218px] w-[246px] rotate-[165deg]"
        />

        <div className="absolute top-[599px] left-1/2 flex w-[590px] -translate-x-1/2 flex-col items-center gap-8">
          <h2 className="text-landing-section font-extrabold text-brand-obsidian">
            But a number can&apos;t show you what it actually feels like.
            <br />
            <span className="text-landing-cyan">The people can</span>.
          </h2>
          <Link
            href="/stories"
            className="inline-flex bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none"
          >
            View Stories
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ChapterFinderSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[2198px] w-full overflow-hidden bg-brand-warm-snow"
    >
      <div className="absolute top-[-554px] left-1/2 flex h-[3418px] w-[3453px] -translate-x-[61%] items-center justify-center">
        <div className="rotate-[56.37deg]">
          <Image src={chapterWave} alt="" className="block max-w-none" />
        </div>
      </div>

      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <div className="absolute top-[468px] left-[90px] w-[538px] text-brand-warm-snow">
          <h2 className="text-landing-section font-extrabold">
            Let&apos;s find your story.
          </h2>
          <p className="mt-4 text-landing-copy font-medium">
            There&apos;s a NeighborNet near you. Find it, and just show up —
            someone&apos;s saving you a seat.
          </p>
        </div>

        <div className="absolute top-[205px] left-[517px] flex h-[1084px] w-[1069px] items-center justify-center">
          <div className="rotate-[-29.9deg]">
            <Image src={chapterCardShape} alt="" className="block max-w-none" />
          </div>
        </div>

        <div className="absolute top-[468px] left-[816px] h-[548px] w-[484px] overflow-hidden">
          <Image
            src={chapterPhoto}
            alt="Young Muslims gathered at the Houston NeighborNet"
            fill
            sizes="484px"
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(191,206,219,0)_9.5%,rgba(23,23,37,0.48)_109.91%)]" />
          <Image
            src={chapterCardTexture}
            alt=""
            className="absolute inset-0 block max-w-none opacity-20 mix-blend-soft-light"
          />
          <div className="absolute top-[217px] left-0 w-full text-center text-brand-pure-white">
            <p className="font-display text-[54px] tracking-[-0.02em]">
              HOUSTON
            </p>
            <p className="mt-[-2px] text-landing-copy font-bold">TEXAS</p>
            <Link
              href="/neighbornets"
              className="mt-6 inline-flex rounded-pill border border-brand-warm-snow px-6 py-4 text-nav font-bold transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
            >
              Visit
            </Link>
          </div>
        </div>

        <div className="absolute top-[688px] left-[97px] flex flex-col gap-[23px]">
          {CITIES.map((city, index) => (
            <p
              key={city}
              className={`font-display text-[54px] tracking-[-0.02em] ${index === 0 ? "text-sisters-brass" : "text-brand-pure-white"}`}
            >
              {city}
            </p>
          ))}
        </div>

        <Link
          href="/neighbornets"
          className="absolute top-[1591px] left-[97px] bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
        >
          View all
        </Link>
      </div>
    </section>
  );
}

export function LandingCtaSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[723px] w-full overflow-hidden bg-brand-warm-snow"
    >
      <div className="absolute top-[352px] left-0 h-[371px] w-full bg-brand-obsidian" />
      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <div className="absolute top-[-79px] left-[-500px] flex h-[904px] w-[2355px] items-center justify-center">
          <div className="rotate-[3.7deg]">
            <Image
              src={ctaCommunity}
              alt="Young Muslims volunteers standing together"
              sizes="2311px"
              width={2311}
              height={756}
              className="block h-[756px] w-[2311px] max-w-none"
            />
          </div>
        </div>
        <h2 className="absolute top-[314px] left-[129px] w-[692px] text-landing-section font-extrabold text-brand-warm-snow">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>
        <div className="absolute top-[285px] left-[902px] flex w-[312px] flex-col gap-8">
          <Link
            href="/neighbornets"
            className="flex h-[61px] items-center gap-3 bg-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-obsidian transition-colors hover:bg-brand-pure-white focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <span className="flex-1">Get involved</span>
            <Image src={ctaArrowDark} alt="" />
          </Link>
          <Link
            href="/support"
            className="flex h-[61px] items-center gap-3 border border-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <span className="flex-1">Support us</span>
            <Image src={ctaArrowLight} alt="" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  [
    ["Find a Chapter", "/neighbornets"],
    ["Who We Are", "/about"],
    ["Stories", "/stories"],
    ["Support", "/support"],
  ],
  [
    ["Blog", "/blog"],
    ["Store", "/store"],
  ],
] as const;

export function LandingFooter() {
  return (
    <footer className="relative h-[525px] w-full overflow-hidden bg-brand-obsidian text-brand-warm-snow">
      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <div className="absolute top-[60px] left-[80px] flex w-[1280px] items-start justify-between">
          <Image src={footerLogo} alt="Young Muslims" />

          <nav
            aria-label="Footer navigation"
            className="flex gap-14 text-nav font-semibold"
          >
            {FOOTER_LINKS.map((column, index) => (
              <div key={index} className="flex flex-col gap-6">
                {column.map(([label, href]) => (
                  <Link key={href} href={href} className="hover:underline">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="w-[373px]">
            <p className="text-nav font-semibold">
              Want to learn more about Young Muslims, what we do, or how to
              join/create a NeighborNet? Reach out to us via email.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
            >
              Contact us
            </Link>
          </div>
        </div>

        <Image
          src={footerTagline}
          alt=""
          className="absolute top-[334px] left-0 block max-w-none opacity-100"
        />

        <div className="absolute top-[453px] left-[80px] flex w-[1280px] items-center justify-between text-[10px] font-bold tracking-[-0.02em]">
          <div className="flex gap-6">
            <span>© Young Muslims 2026</span>
            <span className="text-brothers-slate underline">
              Made by Kalos Studio
            </span>
          </div>
          <div className="flex gap-4" aria-label="Social media">
            <Image src={footerFacebook} alt="Facebook" />
            <Image src={footerX} alt="X" />
            <Image src={footerYoutube} alt="YouTube" />
            <Image src={footerInstagram} alt="Instagram" />
          </div>
          <div className="flex gap-2">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Donor Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
