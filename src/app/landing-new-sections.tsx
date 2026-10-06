import Image from "next/image";
import Link from "next/link";

import ctaArrowDark from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-dark.svg";
import ctaArrowLight from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-light.svg";
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
