import { cn } from "@/lib/utils";

/**
 * WIREFRAME: keeps the prototype's shared content width without rendering
 * retired review notes. `bleed` leaves full-width sections unconstrained.
 */
const CONTAINER = "mx-auto w-full max-w-[80rem] px-6 md:px-10";

export function ContentFrame({
  children,
  bleed = false,
  className,
}: {
  children: React.ReactNode;
  bleed?: boolean;
  className?: string;
}) {
  return <div className={cn(!bleed && CONTAINER, className)}>{children}</div>;
}
