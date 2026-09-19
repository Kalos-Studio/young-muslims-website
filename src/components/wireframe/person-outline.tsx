import { cn } from "@/lib/utils";

/**
 * WIREFRAME: a plain head-and-shoulders outline, standing in for a photo of a
 * person.
 *
 * A grey circle reads as "something goes here"; this reads as "a person goes
 * here", which is the difference between the Stories page looking like an
 * abstract layout and looking like a wall of faces.
 *
 * Strokes use `currentColor`, so the colour comes from whatever it sits in.
 */
export function PersonOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <circle cx="32" cy="22" r="11" />
      <path d="M12 57a20 20 0 0 1 40 0" />
    </svg>
  );
}
