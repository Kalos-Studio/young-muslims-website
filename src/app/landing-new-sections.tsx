import Image from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import landingPageFooter from "../../landing page footer.png";

export function LandingCtaSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[894px] w-full overflow-hidden bg-brand-obsidian xl:h-[723px]"
    >
      <Image
        src={landingPageFooter}
        alt="Young Muslims volunteers standing together"
        fill
        sizes="100vw"
        className="object-cover object-center xl:object-[center_70%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(23,23,37,0.7),rgba(23,23,37,0.22)_60%,rgba(23,23,37,0.45))] xl:bg-brand-obsidian/30" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-0 h-24 w-full text-brand-warm-snow"
      >
        <path d="M0 0H1440V72C1100 -18 340 -18 0 72Z" fill="currentColor" />
      </svg>
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 xl:w-[1440px] 2xl:left-0 2xl:w-full 2xl:translate-x-0">
        <h2 className="absolute top-[155px] left-8 w-[296px] text-center text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-warm-snow md:text-landing-section md:leading-[1.2] xl:top-[314px] xl:left-[129px] xl:w-[692px] xl:text-left 2xl:left-20">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>
        <div className="absolute top-[490px] left-8 flex w-[296px] flex-col gap-8 xl:top-[285px] xl:left-[902px] xl:w-[312px] 2xl:right-20 2xl:left-auto">
          <Link
            href="/neighbornets"
            className="ym-cta-trigger flex h-[61px] items-center gap-3 bg-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-obsidian transition-colors hover:bg-brand-pure-white focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <AnimatedCtaLabel label="Get involved" textClassName="flex-1" />
          </Link>
          <Link
            href="/support"
            className="ym-cta-trigger flex h-[61px] items-center gap-3 border border-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <AnimatedCtaLabel label="Support us" textClassName="flex-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
