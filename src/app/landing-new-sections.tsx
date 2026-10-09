import Image from "next/image";
import Link from "next/link";

import ctaArrowDark from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-dark.svg";
import ctaArrowLight from "../../design-assets/figma/landing-2026/new-sections/cta-arrow-light.svg";
import ctaCommunityMobile from "../../design-assets/figma/landing-2026/new-sections/cta-community-mobile.png";
import ctaCommunity from "../../design-assets/figma/landing-2026/new-sections/cta-community-ribbon-design.png";

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
