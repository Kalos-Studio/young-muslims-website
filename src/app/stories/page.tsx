import type { Metadata } from "next";

// WIREFRAME: route stub. Replace this body when the Stories page gets built.
import { PageStub } from "@/components/wireframe/page-stub";

export const metadata: Metadata = {
  title: "Stories · Young Muslims",
  description: "The impact YM has had on people, in their words.",
};

export default function StoriesPage() {
  return (
    <PageStub
      label="Stories"
      summary="A scattered field of portraits. Clicking one scroll-stops into that person's full story: a portrait beside a paragraph or two."
      note="Muneeb's 'product of YM' idea, broadened to include current members too. Stories of the impact YM has had on people, closer to case studies."
    />
  );
}
