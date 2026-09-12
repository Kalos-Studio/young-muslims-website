import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Blog · Young Muslims",
  description: "Writing from across the network.",
};

/**
 * WIREFRAME: one card in the post grid. Six of these sit below the featured
 * carousel, so the shape is defined once rather than repeated inline.
 */
function PostCard() {
  return (
    <div className="flex flex-col gap-3">
      <Frame variant="muted" label="Post image" className="aspect-[3/2]" />
      <p className="text-sm text-muted-foreground">Date · read time</p>
      <Frame label="Post title" className="px-4 py-5" />
      <Frame label="Excerpt" className="min-h-[5rem] px-4 py-4" />
      <p className="text-sm text-muted-foreground">Author avatar · name</p>
    </div>
  );
}

export default function BlogPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate>
        <div className="flex flex-col gap-3">
          <Frame label="Blog" className="px-8 py-8" />
          <Frame
            label="Standfirst"
            detail="One line on what gets written about here"
            className="px-8 py-6"
          />
        </div>
      </Annotate>

      <Annotate className="mt-10">
        <Frame
          variant="fill"
          label="Featured post carousel"
          detail="Full-width image with the title, excerpt, author, date and read time laid over it; carousel dots bottom-left"
          className="aspect-[21/9]"
        />
      </Annotate>

      <Annotate className="mt-12">
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, index) => (
            <PostCard key={index} />
          ))}
        </div>
      </Annotate>
    </PageFrame>
  );
}
