import Image from "next/image";
import Link from "next/link";

import hero from "../../../design-assets/figma/stories-redesign/hero.jpg";
import cta from "../../../design-assets/figma/stories-redesign/4e23d.webp";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import styles from "./stories.module.css";

export function StoriesHero() {
  return (
    <section
      data-header-theme="dark"
      className={styles.hero}
      aria-labelledby="stories-title"
    >
      <div className={styles.heroMedia}>
        <div className={styles.heroPhoto}>
          <Image
            src={hero}
            alt="Young Muslim sisters gathered at a community event"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_22%]"
          />
        </div>
      </div>
      <div className={styles.heroCopy}>
        <h1 id="stories-title" className="font-display text-landing-display">
          THIS IS YOUNG MUSLIMS
        </h1>
        <p className="mt-4 text-landing-hero-subtitle font-semibold">
          Real brothers and sisters, real stories.
        </p>
      </div>
    </section>
  );
}

export function StoriesCta() {
  return (
    <section data-header-theme="dark" className={styles.cta}>
      <div className={styles.ctaBackground} />
      <div className={styles.ctaPhoto}>
        <Image
          src={cta}
          alt="Young Muslims celebrating together"
          fill
          sizes="(max-width: 767px) 1720px, 165vw"
          className="object-contain"
        />
      </div>
      <div className={styles.ctaContent}>
        <h2 className="max-w-[692px] text-landing-section font-extrabold">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>
        <div className="flex w-full shrink-0 flex-col gap-8 md:w-[312px]">
          <Link
            href="/about"
            className="ym-cta-trigger flex min-h-[61px] items-center gap-3 bg-brand-warm-snow px-8 py-5 text-nav font-bold text-brand-obsidian focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <AnimatedCtaLabel label="Get involved" textClassName="flex-1" />
          </Link>
          <Link
            href="/support"
            className="ym-cta-trigger flex min-h-[61px] items-center gap-3 border border-brand-warm-snow px-8 py-5 text-nav font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <AnimatedCtaLabel label="Support us" textClassName="flex-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
