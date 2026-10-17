import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { Storefronts } from "./storefronts";
import merchFooter from "../../../design-assets/figma/merch footer.png";
import styles from "./store-footer.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/store" },
  title: "Store",
  description: "Explore the Young Muslims brothers’ and sisters’ stores.",
};

export default function StorePage() {
  return (
    <main data-store-page>
      <h1 className="sr-only">Young Muslims Store</h1>
      <Storefronts />

      <section
        data-header-theme="dark"
        aria-labelledby="store-community-title"
        className="relative isolate flex min-h-220 items-start overflow-hidden px-8 pt-36 pb-60 text-primary-foreground md:-mt-40 md:min-h-160 md:items-center md:px-20 md:py-40"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 bottom-0 -z-20 bg-primary md:top-40"
        />
        <div
          className={`${styles.photo} absolute -top-28 left-1/2 -z-10 h-232 w-708 max-w-none -translate-x-1/2 rotate-4 md:top-8 md:h-180 md:w-3/2`}
        >
          <div className="absolute inset-y-0 left-1/2 w-240 -translate-x-1/2 md:w-2/3">
            <Image
              src={merchFooter}
              alt="Young Muslim sisters gathered outdoors"
              fill
              sizes="(max-width: 767px) 960px, 100vw"
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-primary/40" />
        </div>
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
