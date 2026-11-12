import {
  createImageUrlBuilder,
  type SanityImageObject,
} from "@sanity/image-url";
import { sanityProjectId, sanityDataset } from "./sanity-config";

const builder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
});

export function sanityImageUrl(
  image: SanityImageObject,
  width: number,
  height: number,
) {
  return builder.image(image).width(width).height(height).fit("crop").url();
}
