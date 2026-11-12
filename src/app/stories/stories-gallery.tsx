import Image, { getImageProps } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import watermarkLeft from "../../../design-assets/figma/stories/gallery/watermark-left.svg";
import watermarkRight from "../../../design-assets/figma/stories/gallery/watermark-right.svg";
import { GALLERY_PEOPLE } from "./gallery-people";
import { StoriesGalleryField, type FieldFace } from "./stories-gallery-field";
import styles from "./stories-gallery.module.css";

/** A face is drawn at most `--stories-gallery-face` across. */
const FACE_SIZES = "(width >= 80rem) 11rem, (width >= 48rem) 7.5rem, 6rem";

/**
 * The Stories gallery (Figma 401:3786, tablet 414:754, mobile 414:1225):
 * "Pick someone. Get their story." over an endless field of the community's
 * faces (StoriesGalleryField), each a link to their story. On Warm Snow,
 * after the Stories hero's wave.
 */
export function StoriesGallery() {
  const faces: FieldFace[] = GALLERY_PEOPLE.map((person) => {
    const { props } = getImageProps({
      src: person.image,
      alt: "",
      sizes: FACE_SIZES,
    });
    return {
      face: person.face,
      slug: person.slug,
      name: person.name,
      src: props.src,
      srcSet: props.srcSet,
      sizes: props.sizes,
    };
  });
  return (
    <section
      aria-labelledby="stories-heading"
      className="overflow-x-clip bg-brand-warm-snow pt-31 pb-21.5 text-brand-obsidian md:pt-34.5 md:pb-29.5 xl:pt-49"
    >
      <TextReveal className="mx-auto flex w-full max-w-360 flex-col gap-4 px-8 text-center md:px-16 xl:px-22.5">
        <h2
          id="stories-heading"
          tabIndex={-1}
          className="text-mobile-section font-extrabold outline-none md:text-landing-section"
        >
          {/* Phones break between the sentences (Figma 414:1228). */}
          <span className="inline-block">Pick someone.</span>{" "}
          <span className="inline-block">Get their story.</span>
        </h2>
        <p className="text-body font-medium md:text-landing-copy">
          Every person here found something at Young Muslims worth talking
          about. Select anyone to see their experience.
        </p>
      </TextReveal>
      <div className="mt-12.75 md:mt-19.5 xl:mt-23.5">
        <StoriesGalleryField faces={faces}>
          <Image
            src={watermarkLeft}
            alt=""
            className={cn(styles.watermark, styles.watermarkLeft)}
          />
          <Image
            src={watermarkRight}
            alt=""
            className={cn(styles.watermark, styles.watermarkRight)}
          />
        </StoriesGalleryField>
      </div>
    </section>
  );
}
