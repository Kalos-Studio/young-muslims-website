import type { Metadata } from "next";

// WIREFRAME: route stub. Replace this body when the Store page gets built.
import { PageStub } from "@/components/wireframe/page-stub";

export const metadata: Metadata = {
  title: "Store · Young Muslims",
  description: "The brothers' and sisters' stores.",
};

export default function StorePage() {
  return (
    <PageStub
      summary="A split screen and nothing else: brothers on one side, sisters on the other."
      note="brothers and sisters cover images; clicking one navigates you out to that store"
    />
  );
}
