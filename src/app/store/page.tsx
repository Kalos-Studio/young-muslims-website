import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { cn } from "@/lib/utils";
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Store · Young Muslims",
  description: "The brothers' and sisters' stores.",
};

/**
 * WIREFRAME: the store is a split screen and nothing else — a fork out to two
 * stores that live on other sites. Full-bleed, so it uses the overlay note
 * layout rather than the rail.
 */
export default function StorePage() {
  return (
    <PageFrame>
      <Annotate
        overlay
        note="brothers and sisters cover images; clicking either side navigates you out to that store"
      >
        <section className="grid min-h-[calc(100dvh-6rem)] grid-cols-2">
          {["Brothers", "Sisters"].map((side, index) => (
            <div
              key={side}
              className={cn(
                "flex flex-col items-center justify-center gap-6 bg-wf-fill px-10 text-center",
                index === 1 && "border-l border-background/25",
              )}
            >
              <p className="text-6xl font-semibold text-background">{side}</p>
              <p className="max-w-xs text-sm text-background/60">
                {side.toLowerCase()} cover image fills this half; the whole half
                is the link out
              </p>
            </div>
          ))}
        </section>
      </Annotate>
    </PageFrame>
  );
}
