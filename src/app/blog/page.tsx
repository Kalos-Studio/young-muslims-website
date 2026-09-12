import type { Metadata } from "next";

// WIREFRAME: route stub. Replace this body when the Blog page gets built.
import { PageStub } from "@/components/wireframe/page-stub";

export const metadata: Metadata = {
  title: "Blog · Young Muslims",
  description: "Writing from across the network.",
};

export default function BlogPage() {
  return (
    <PageStub
      label="Blog"
      summary="A featured post carousel across the top, then a grid of post cards: image, date, read time, title, excerpt, author."
    />
  );
}
