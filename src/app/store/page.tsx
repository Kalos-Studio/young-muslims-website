import type { Metadata } from "next";
import Image from "next/image";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Store",
  description: "The brothers' and sisters' stores.",
};

/**
 * WIREFRAME: the store is a split screen and nothing else — a fork out to two
 * stores that live on other sites, so each half is one big link.
 *
 * The brothers' half has its real cover photo. It renders greyscale, which is a
 * deliberate call rather than an oversight: the rest of the prototype is black
 * and white, and one full-colour photograph would pull every eye straight to it
 * and start an art-direction conversation this round is not for. Dropping
 * `grayscale` from the className below shows it in colour.
 *
 * The sisters' half stays a placeholder until that cover image exists.
 */
export default function StorePage() {
  return (
    <PageFrame>
      {/* The two halves are the page. A screen reader still needs a heading to
          announce, so it is sr-only rather than absent. */}
      <h1 className="sr-only">Store</h1>

      <Annotate
        bleed
        note="brothers and sisters cover images; clicking either side navigates you out to that store"
      >
        <section className="grid h-[calc(100dvh-6rem)] grid-cols-2 overflow-hidden">
          <a
            href="https://www.ymsite.com/"
            className="group relative flex items-center justify-center overflow-hidden bg-wf-fill outline-none"
          >
            <Image
              src="/wireframe/brothers-merch.jpg"
              alt=""
              fill
              sizes="50vw"
              priority
              className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
            />
            {/* The photo is near-black at the top and busy with patches at the
                bottom, so the label needs its own scrim to stay legible over
                either. */}
            <span className="absolute inset-0 bg-wf-fill/45" />
            <span className="relative font-display text-display font-normal text-background underline-offset-8 group-hover:underline group-focus-visible:underline">
              Brothers&apos; Merch
            </span>
          </a>

          <div className="flex flex-col items-center justify-center gap-6 border-l border-background/25 bg-wf-fill px-10 text-center">
            <p className="font-display text-display font-normal text-background">
              Sisters&apos; Merch
            </p>
            <p className="max-w-xs text-sm font-medium text-background/60">
              Sisters&apos; cover image fills this half; the whole half is the
              link out
            </p>
          </div>
        </section>
      </Annotate>
    </PageFrame>
  );
}
