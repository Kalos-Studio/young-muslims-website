import { Logo } from "./logo";

/**
 * A plain closing footer: the mark, the credit, and the legal line. No link
 * index — the header and the drawer already cover navigation, and repeating
 * every route down here added weight without adding a way to get anywhere.
 *
 * Permanent, and it imports nothing from the wireframe.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-16 px-10 py-12">
        <Logo className="h-7" />

        <div className="text-right text-xs text-muted-foreground">
          <p>Designed and built by Kalos.</p>
          <p className="mt-1">© {year} Young Muslims. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
