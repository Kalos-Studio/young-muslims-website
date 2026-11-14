import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { StickyHero } from "@/components/site/sticky-hero";
import {
  StandardButton,
  StandardButtonStatic,
} from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import brothersPhoto from "../../../design-assets/figma/store/brothers.jpg";
import sistersPhoto from "../../../design-assets/figma/store/sisters.jpg";
import styles from "./store-split.module.css";

/**
 * One half: its photo (covering the half, centred), the Obsidian shade
 * rising from its foot (40% up to 44% of the way, then clearing; Figma's),
 * the name in Boldonse and its button, centred.
 */
function Half({
  name,
  photo,
  alt,
  sizes,
  children,
}: {
  name: string;
  photo: StaticImageData;
  alt: string;
  sizes: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-5 overflow-clip xl:gap-4",
        styles.half,
      )}
    >
      <div className={cn("absolute inset-0", styles.media)}>
        <Image
          src={photo}
          alt={alt}
          fill
          sizes={sizes}
          preload
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-brand-obsidian/40 from-44% to-transparent"
      />
      <h2 className="relative font-display text-mobile-display text-brand-pure-white uppercase md:text-tablet-display xl:text-display">
        {name}
      </h2>
      {children}
    </div>
  );
}

/**
 * The Store page's hero (Figma 456:3296, tablet 456:3556, mobile 456:3698;
 * hover 456:3515 / 456:3807 / 456:3876; DESIGN-SYSTEM.md, "Store split"):
 * the brothers' store and the sisters', in the site's sticky hero
 * (StickyHero), exactly the viewport's height on every device under the
 * overlaid site header. Side by side from tablet; stacked on phones,
 * Brothers above. The rest of the page (children: the closing CTA, whose
 * own wavy top is the hand-off, so the hero has no wave) scrolls up over
 * it, and it stays pinned while the footer follows.
 *
 * Each half's photo is black and white at rest on a fine pointer; hovering
 * anywhere on the half fades it to colour and grows it a little within the
 * half (CSS only, store-split.module.css). Touch screens show the photos in
 * colour. "Enter" (the dark standard button) opens the brothers' store
 * (ymsite.com) in a new tab; the sisters' store isn't open yet, so theirs
 * is the same button's look as text, "Coming soon", not a control.
 */
export function StoreSplit({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="Our stores"
      wave="none"
      holdThroughFooter
      media={
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <Half
            name="Brothers"
            photo={brothersPhoto}
            alt="A brother in a Young Muslims track jacket leaning against a car"
            /* Drawn as tall as the half, 1.5x as wide (or the half's width). */
            sizes="(width >= 48rem) max(50vw, 150vh), max(100vw, 75vh)"
          >
            <StandardButton
              href="https://www.ymsite.com/"
              label="Enter"
              tone="dark"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enter the brothers’ store (opens in a new tab)"
              className="relative w-auto"
            />
          </Half>
          <Half
            name="Sisters"
            photo={sistersPhoto}
            alt="A sister seen from behind in a Young Muslims hoodie at a gathering"
            /* Portrait: drawn as wide as the half (or two thirds its height). */
            sizes="(width >= 48rem) max(50vw, 67vh), max(100vw, 34vh)"
          >
            <StandardButtonStatic
              label="Coming soon"
              srLabel="The sisters’ store is coming soon"
              tone="dark"
              className="relative w-auto"
            />
          </Half>
        </div>
      }
    >
      {children}
    </StickyHero>
  );
}
