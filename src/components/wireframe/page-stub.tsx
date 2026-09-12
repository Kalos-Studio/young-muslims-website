import { Annotate } from "./annotate";
import { Frame } from "./frame";
import { PageFrame } from "./page-frame";

/**
 * WIREFRAME: a route that exists but has not been wireframed yet.
 *
 * These exist so the navigation is genuinely clickable today — a prototype
 * where half the links 404 tests nothing. Each stub says what the page is going
 * to be, so the client can still follow the shape of the site.
 *
 * Building a page for real means replacing its `page.tsx` body. Nothing else
 * has to change, because the route, the metadata and the nav entry are already
 * correct.
 */
export function PageStub({
  label,
  summary,
  note,
}: {
  /** Frame name, matching the Figma artboard. */
  label: string;
  /** What this page will hold, in a sentence. */
  summary: string;
  /** Optional sticky note carrying thinking we already have. */
  note?: React.ReactNode;
}) {
  return (
    <PageFrame label={label}>
      <Annotate note={note}>
        <Frame
          variant="outline"
          label="Not wireframed yet"
          detail={summary}
          className="min-h-[26rem]"
        />
      </Annotate>
    </PageFrame>
  );
}
