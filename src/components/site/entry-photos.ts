import type { StaticImageData } from "next/image";

import photo01 from "../../../design-assets/figma/entry-animation/photo-01.jpg";
import photo02 from "../../../design-assets/figma/entry-animation/photo-02.jpg";
import photo03 from "../../../design-assets/figma/entry-animation/photo-03.jpg";
import photo04 from "../../../design-assets/figma/entry-animation/photo-04.jpg";
import photo05 from "../../../design-assets/figma/entry-animation/photo-05.jpg";
import photo06 from "../../../design-assets/figma/entry-animation/photo-06.jpg";
import photo07 from "../../../design-assets/figma/entry-animation/photo-07.jpg";

/**
 * The group photos that flash through the entry wordmark, in order. This is
 * the only list to edit when swapping photos; the screen and the timing both
 * read from it. Sources are Figma nodes 564:320, 564:327, 564:331, 564:335,
 * 564:339, 564:346 and 564:351, resized to an 1800px long edge for first load.
 *
 * Each photo is centre-sliced into the wordmark. Photo 7 (564:351) is a
 * portrait shot, so it is vendored pre-cropped to its Figma frame crop
 * (image top -100.71%, height 227.66%, full width: source rows 1812-3611 of
 * 4096), which keeps the subjects as high in the frame as the design.
 */
export const entryPhotos: readonly StaticImageData[] = [
  photo01,
  photo02,
  photo03,
  photo04,
  photo05,
  photo06,
  photo07,
];
