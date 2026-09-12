import type { Metadata } from "next";

// WIREFRAME: route stub. Replace this body when the About page gets built.
import { PageStub } from "@/components/wireframe/page-stub";

export const metadata: Metadata = {
  title: "About · Young Muslims",
  description: "What Young Muslims is and who it's for.",
};

export default function AboutPage() {
  return (
    <PageStub
      summary="Rotating images of people beside the explanation of what YM is: a friend group you belong to, the weekly moves, and how those friendships turn into service, relief work and advocacy."
      note="summarize down with a good header"
    />
  );
}
