import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { MaterialIcon } from "@/components/ui/material-icon";

export const metadata: Metadata = {
  alternates: { canonical: "/store" },
  title: "Store",
  description: "Explore the Young Muslims brothers’ and sisters’ stores.",
};

// Replace these Figma preview images with the final supplied PNGs.
const storefronts = [
  {
    name: "Brothers",
    image: "/images/store/brothers.png",
    mobileImage: "/images/store/brothers.png",
    href: "https://www.ymsite.com/",
  },
  {
    name: "Sisters",
    image: "/images/store/sisters.png",
    mobileImage: "/images/store/sisters-mobile.png",
    href: null,
  },
] as const;

export default function StorePage() {
  return (
    <main data-store-page>
      <h1 className="sr-only">Young Muslims Store</h1>
      <section
        data-header-theme="dark"
        aria-label="Our stores"
        className="grid grid-cols-1 bg-primary text-primary-foreground md:grid-cols-2"
      >
        {storefronts.map((store) => (
          <div
            key={store.name}
            className="relative isolate flex min-h-120 flex-col items-center justify-center gap-8 overflow-hidden px-6 first:pt-12 last:pt-4 md:min-h-280 md:gap-12 md:pb-20 md:first:pt-0 md:last:pt-0"
          >
            <picture className="contents">
              <source media="(max-width: 767px)" srcSet={store.mobileImage} />
              <Image
                src={store.image}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                preload
                className="-z-20 origin-top scale-110 object-cover object-top grayscale md:scale-100 md:object-center"
              />
            </picture>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-b from-primary/20 to-primary/50"
            />
            <h2 className="max-w-full text-center font-display text-mobile-display font-normal uppercase lg:text-display">
              {store.name}
            </h2>
            {store.href ? (
              <a
                href={store.href}
                aria-label={`Enter the ${store.name.toLowerCase()} store`}
                className="flex items-center gap-4 border border-background px-6 py-4 text-nav font-bold transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
              >
                Enter <MaterialIcon name="arrow_forward" size={20} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-label="Sisters store link coming soon"
                className="flex items-center gap-4 border border-background px-6 py-4 text-nav font-bold disabled:cursor-not-allowed"
              >
                Enter <MaterialIcon name="arrow_forward" size={20} />
              </button>
            )}
          </div>
        ))}
      </section>

      <section
        data-header-theme="dark"
        aria-labelledby="store-community-title"
        className="relative isolate flex min-h-220 items-start overflow-hidden px-8 pt-36 pb-60 text-primary-foreground md:-mt-40 md:min-h-160 md:items-center md:px-20 md:py-40"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 bottom-0 -z-20 bg-primary md:top-40"
        />
        <picture className="contents">
          <source
            media="(max-width: 767px)"
            srcSet="/images/store/community-mobile.png"
          />
          <Image
            src="/images/store/community.png"
            alt="Young Muslim sisters gathered outdoors"
            width={4622}
            height={1513}
            sizes="(max-width: 767px) 2832px, 150vw"
            className="absolute -top-28 left-1/2 -z-10 h-auto w-708 max-w-none -translate-x-1/2 rotate-4 md:top-8 md:w-3/2"
          />
        </picture>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-48 md:gap-20 lg:grid-cols-3">
          <h2
            id="store-community-title"
            className="text-center text-mobile-section font-extrabold md:text-left lg:col-span-2 lg:text-section"
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
            <Link
              href="/support"
              className="ym-cta-trigger flex items-center justify-between gap-4 border border-background px-6 py-4 text-nav font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
            >
              <AnimatedCtaLabel label="Support us" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
