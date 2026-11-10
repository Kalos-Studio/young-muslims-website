import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

import tile3b4cd from "../../../design-assets/figma/neighbornets/2026-page/3b4cd.png";
import tilef29fa from "../../../design-assets/figma/neighbornets/2026-page/f29fa.png";
import tile4f0d3 from "../../../design-assets/figma/neighbornets/2026-page/4f0d3.png";
import tileffac9 from "../../../design-assets/figma/neighbornets/2026-page/ffac9.png";
import tile33797 from "../../../design-assets/figma/neighbornets/2026-page/33797.png";
import tile59811 from "../../../design-assets/figma/neighbornets/2026-page/59811.png";
import tile2d29c from "../../../design-assets/figma/neighbornets/2026-page/2d29c.png";
import tileca616 from "../../../design-assets/figma/neighbornets/2026-page/ca616.png";
import tilef62af from "../../../design-assets/figma/neighbornets/2026-page/f62af.png";
import tile2efe7 from "../../../design-assets/figma/neighbornets/2026-page/2efe7.png";
import tile6364f from "../../../design-assets/figma/neighbornets/2026-page/6364f.png";
import tiled3926 from "../../../design-assets/figma/neighbornets/2026-page/d3926.png";
import tile234fa from "../../../design-assets/figma/neighbornets/2026-page/234fa.png";
import tile2a722 from "../../../design-assets/figma/neighbornets/2026-page/2a722.png";
import tileec2af from "../../../design-assets/figma/neighbornets/2026-page/ec2af.png";
import tiled68e7 from "../../../design-assets/figma/neighbornets/2026-page/d68e7.png";
import tilea1f98 from "../../../design-assets/figma/neighbornets/2026-page/a1f98.png";
import tile2666e from "../../../design-assets/figma/neighbornets/2026-page/2666e.png";
import tile03266 from "../../../design-assets/figma/neighbornets/2026-page/03266.png";
import tile241bd from "../../../design-assets/figma/neighbornets/2026-page/241bd.png";
import tile5e320 from "../../../design-assets/figma/neighbornets/2026-page/5e320.png";
import tile3fb20 from "../../../design-assets/figma/neighbornets/2026-page/3fb20.png";
import tile0e843 from "../../../design-assets/figma/neighbornets/2026-page/0e843.png";
import tilecd6a3 from "../../../design-assets/figma/neighbornets/2026-page/cd6a3.png";
import tilec13d5 from "../../../design-assets/figma/neighbornets/2026-page/c13d5.png";
import styles from "./neighbornet-branding.module.css";
import { PhotoMarqueeMotion } from "./photo-marquee-motion";
import marquee from "./photo-marquee.module.css";

/** Figma 372:66's rows of per-NeighborNet YM lockups, left to right. */
const ROWS: StaticImageData[][] = [
  [
    tile3b4cd,
    tilef29fa,
    tile4f0d3,
    tileffac9,
    tile33797,
    tile59811,
    tile2d29c,
    tileca616,
    tilef62af,
  ],
  [
    tile2efe7,
    tilef62af,
    tile6364f,
    tiled3926,
    tile234fa,
    tile2a722,
    tileec2af,
    tiled68e7,
    tilea1f98,
  ],
  [
    tile2666e,
    tilea1f98,
    tile03266,
    tile241bd,
    tile5e320,
    tile3fb20,
    tile0e843,
    tilecd6a3,
    tilec13d5,
  ],
];
const TRACKS = [styles.trackTop, styles.trackMiddle, styles.trackBottom];
/**
 * The cursor drift's share per row (sideways only: the rows are flush, so
 * they stay level): the middle row trails least.
 */
const ROW_DEPTHS = [1, 0.6, 0.8];
/** Copies of each row in its track: one loop's move never shows an end. */
const COPIES = 4;

/**
 * The NeighborNet branding rows (Figma 372:66, tablet 374:734, mobile
 * 401:1877), below "What's a NeighborNet?": three full-bleed rows of
 * NeighborNets' own Young Muslims lockups, flush, looping in alternating
 * directions (top right, middle left, bottom right) and trailing the cursor
 * on desktop: the page's shared photo marquee (PhotoMarqueeMotion). The
 * tiles are decorative; the section names what they show.
 */
export function NeighborNetBranding() {
  return (
    <PhotoMarqueeMotion
      label="Young Muslims branding from NeighborNets across the country"
      depths={ROW_DEPTHS}
      level
      className="overflow-x-clip bg-brand-warm-snow"
    >
      {ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          data-marquee="row"
          className={cn(marquee.row, styles.row)}
        >
          <div className={cn(marquee.track, styles.track, TRACKS[rowIndex])}>
            {Array.from({ length: COPIES }, (_, copy) =>
              row.map((tile, index) => (
                <div key={`${copy}-${index}`} className={styles.tile}>
                  <Image
                    src={tile}
                    alt=""
                    fill
                    sizes="(min-width: 48rem) 226px, 133px"
                    className="object-cover"
                  />
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </PhotoMarqueeMotion>
  );
}
