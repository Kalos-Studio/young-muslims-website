"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SanityImageObject } from "@sanity/image-url";
import { sanityImageUrl } from "@/lib/sanity-image";

type Props = ImageProps & {
  coverImage?: SanityImageObject;
  wide?: boolean;
};

export function BlogCoverImage({
  coverImage,
  wide = false,
  src,
  alt,
  ...props
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!coverImage || !container) return;
    // Crop to the real responsive frame, so CSS object-cover does not discard
    // the focal point after Sanity has already applied the editor's crop.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setRatio(width / height);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [coverImage]);

  const width = wide ? 1600 : 800;
  const height = Math.max(1, Math.round(width / (ratio ?? (wide ? 8 / 3 : 1))));
  return (
    <Image
      {...props}
      ref={ref}
      src={coverImage ? sanityImageUrl(coverImage, width, height) : src}
      alt={alt}
    />
  );
}
