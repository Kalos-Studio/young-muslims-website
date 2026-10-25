import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { cn } from "@/lib/utils";

export function EditorialPhoto({
  src,
  alt,
  className,
  preload = false,
}: {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-media", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        sizes="(max-width: 767px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export function EditorialLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: string;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "ym-cta-trigger inline-flex items-center justify-center gap-4 px-6 py-4 text-nav font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        secondary
          ? "border border-current text-secondary hover:bg-muted"
          : "bg-secondary text-secondary-foreground hover:bg-primary",
      )}
    >
      <AnimatedCtaLabel label={children} />
    </Link>
  );
}
