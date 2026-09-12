import type { Metadata } from "next";

// WIREFRAME: route stub. Replace this body when the Support page gets built.
import { PageStub } from "@/components/wireframe/page-stub";

export const metadata: Metadata = {
  title: "Support · Young Muslims",
  description: "Give to the work, and see where it goes.",
};

export default function SupportPage() {
  return (
    <PageStub
      label="Support"
      summary="Hero with tagline, then the YM mission, then a full-bleed image next to the donation widget, a story block, and the recent supporters list."
      note="include something about advocacy, and anonymize supporter names to 'anonymous person from X state'"
    />
  );
}
