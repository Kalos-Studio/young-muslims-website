"use client";

import Image from "next/image";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import brothersMerch from "../../../design-assets/figma/brothers merch.png";
import sistersMerch from "../../../design-assets/figma/sisters merch.png";
import styles from "./storefronts.module.css";

const storefronts = [
  { name: "Brothers", image: brothersMerch, href: "https://www.ymsite.com/" },
  { name: "Sisters", image: sistersMerch, href: null },
] as const;

export function Storefronts() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section
      data-header-theme="dark"
      aria-label="Our stores"
      className="grid grid-cols-1 bg-primary text-primary-foreground md:grid-cols-2"
    >
      {storefronts.map((store) => (
        <div
          key={store.name}
          data-selected={selected === store.name}
          className={`${styles.panel} relative isolate flex min-h-120 flex-col items-center justify-center gap-8 overflow-hidden px-6 first:pt-12 last:pt-4 md:min-h-280 md:gap-12 md:pb-20 md:first:pt-0 md:last:pt-0`}
        >
          <div className={styles.media}>
            <Image
              src={store.image}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              preload
              className="origin-top scale-110 object-cover object-top md:scale-100 md:object-center"
            />
          </div>
          <button
            type="button"
            aria-label={`Preview ${store.name.toLowerCase()} merch in color`}
            aria-pressed={selected === store.name}
            onClick={() =>
              setSelected(selected === store.name ? null : store.name)
            }
            className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-background"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-primary/20 to-primary/50"
          />
          <h2 className="pointer-events-none relative z-10 max-w-full text-center font-display text-mobile-display font-normal uppercase lg:text-display">
            {store.name}
          </h2>
          {store.href ? (
            <a
              href={store.href}
              aria-label={`Enter the ${store.name.toLowerCase()} store`}
              className="relative z-10 flex items-center gap-4 border border-background px-6 py-4 text-nav font-bold transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
            >
              Enter <MaterialIcon name="arrow_forward" size={20} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-label="Sisters store link coming soon"
              className="relative z-10 flex items-center gap-4 border border-background px-6 py-4 text-nav font-bold disabled:cursor-not-allowed"
            >
              Enter <MaterialIcon name="arrow_forward" size={20} />
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
