import Image from "next/image";
import Link from "next/link";

import ctaArrowDark from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-dark.svg";
import ctaArrowLight from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-light.svg";
import ctaCommunityMobile from "../../design-assets/figma/landing-2026/new-sections/cta-community-mobile.png";
import ctaCommunity from "../../design-assets/figma/landing-2026/new-sections/cta-community-ribbon-design.png";
import footerFacebook from "../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import footerInstagram from "../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import footerLogo from "../../design-assets/figma/landing-2026/new-sections/footer-logo.svg";
import footerTagline from "../../design-assets/figma/landing-2026/new-sections/footer-tagline.svg";
import footerX from "../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import footerYoutube from "../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";

export function LandingCtaSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[894px] w-full overflow-hidden bg-brand-warm-snow md:h-[723px]"
    >
      <div className="absolute top-[567px] left-0 h-[371px] w-full bg-brand-obsidian md:top-[352px]" />
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
        <div className="absolute top-[-96.05px] left-1/2 flex h-[1107.17px] w-[2884.5px] -translate-x-1/2 items-center justify-center md:hidden">
          <div className="rotate-[3.7deg]">
            <Image
              src={ctaCommunityMobile}
              alt="Young Muslims volunteers standing together"
              sizes="2831px"
              width={2831}
              height={926}
              className="block h-[926.3px] w-[2830.59px] max-w-none"
            />
          </div>
        </div>
        <div className="absolute top-[-79px] left-[-500px] hidden h-[904px] w-[2355px] items-center justify-center md:flex">
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
        <h2 className="absolute top-[155px] left-8 w-[296px] text-center text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-warm-snow md:top-[314px] md:left-[129px] md:w-[692px] md:text-left md:text-landing-section">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>
        <div className="absolute top-[490px] left-8 flex w-[296px] flex-col gap-8 md:top-[285px] md:left-[902px] md:w-[312px]">
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
    <footer className="relative h-[794px] w-full overflow-hidden bg-brand-obsidian text-brand-warm-snow md:h-[525px]">
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
        <div className="absolute top-0 left-8 flex w-[296px] flex-col items-stretch md:top-[60px] md:left-[80px] md:w-[1280px] md:flex-row md:items-start md:justify-between">
          <Image
            src={footerLogo}
            alt="Young Muslims"
            className="mx-auto mt-0 w-[278px] md:mx-0 md:mt-0 md:w-auto"
          />

          <nav
            aria-label="Footer navigation"
            className="mt-[64px] flex gap-14 text-nav font-semibold md:mt-0"
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

          <div className="mt-[64px] w-[296px] md:mt-0 md:w-[373px]">
            <p className="text-nav font-semibold">
              Want to learn more about Young Muslims, what we do, or how to
              join/create a NeighborNet? Reach out to us via email.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex w-full justify-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:w-auto"
            >
              Contact us
            </Link>
          </div>
        </div>

        <Image
          src={footerTagline}
          alt=""
          className="absolute top-[514px] left-[-191px] block h-auto w-[741px] max-w-none opacity-100 md:top-[334px] md:left-0 md:w-auto"
        />

        <div className="absolute top-[610px] left-8 flex h-[120px] w-[296px] flex-col items-center justify-between text-[10px] font-bold tracking-[-0.02em] md:top-[453px] md:left-[80px] md:h-auto md:w-[1280px] md:flex-row">
          <div className="flex w-full justify-between gap-6 md:w-auto md:justify-start">
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
