import { cn } from "@/lib/utils";

/**
 * WIREFRAME: the outer wrapper for a wireframe page.
 *
 * Deliberately does nothing but be the <main> element. It used to print the
 * Figma artboard's name in the corner of every page, which was redundant — you
 * can see which page you are on — and it used to impose one content width,
 * which stopped a section from ever going full-bleed.
 *
 * Width is <Annotate>'s job now, so a contained section and a full-page hero
 * can sit in the same page.
 */
export function PageFrame({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"main">) {
  return (
    <main className={cn("w-full", className)} {...props}>
      {children}
    </main>
  );
}
