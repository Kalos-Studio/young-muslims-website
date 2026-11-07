import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import { BelongingRing } from "./belonging-ring";
import styles from "./belonging-section.module.css";

/*
 * The waves into the next (Obsidian) section, Figma 165:1221 (Landing
 * Twilight) and 165:1223 (Obsidian), vendored as
 * design-assets/figma/landing-2026/belonging-wave-pale.svg and
 * belonging-wave-obsidian.svg. Figma keeps them the same size at every
 * breakpoint, centred 115 units left of the section's middle, so they are
 * placed from the band's bottom centre (each path's box centre, then Figma's
 * -9.8 degree rotation about it) in a 1440-wide view box. That box is drawn
 * 1:1 up to 1440px wide, cropped at the sides, and scales up beyond, so the
 * waves always reach both edges.
 */
const BACK_WAVE =
  "M1712.81 200.158C1606.81 252.74 1474.7 244.909 1377.93 180.3C1178.79 47.3541 887.443 -27.2297 627.145 9.22328C93.6825 83.9006 -256.117 871.228 235.579 1226.62C429.497 1364.14 676.372 1337.75 848.474 1251.23C954.011 1198.19 1086.02 1205.27 1183.17 1269.23C1480.48 1465.01 1736.12 1503.61 1955.3 1278.46C2022.43 1209.56 2125.63 1175.35 2228.56 1187.84C3048.8 1287.5 2926.48 -402.574 1712.72 200.065L1712.81 200.158Z";
const FRONT_WAVE =
  "M1614.85 188.711C1514.91 238.285 1390.36 230.901 1299.12 169.988C1111.37 44.6458 836.687 -25.6723 591.276 8.69576C88.3245 79.102 -241.469 821.399 222.105 1156.47C404.933 1286.12 637.687 1261.24 799.947 1179.67C899.447 1129.66 1023.91 1136.34 1115.5 1196.64C1395.81 1381.22 1636.82 1417.61 1843.47 1205.34C1906.76 1140.38 2004.06 1108.12 2101.1 1119.9C2874.43 1213.86 2759.1 -379.55 1614.76 188.623L1614.85 188.711Z";
const BACK_WAVE_PLACEMENT =
  "translate(-115.01 402.98) rotate(-9.8) translate(-1376.115 -716.1)";
const FRONT_WAVE_PLACEMENT =
  "translate(-107.04 443.34) rotate(-9.8) translate(-1297.41 -675.145)";

function BelongingWaves() {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative", styles.waveBand)}
    >
      {/* Backs the wave's bottom edge, which can fall on a fractional pixel,
          so no Warm Snow hairline shows against the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-obsidian" />
      <svg
        viewBox="-720 -460 1440 460"
        preserveAspectRatio="xMidYMax slice"
        className={cn(
          "absolute bottom-0 left-0 block h-auto w-full overflow-visible",
          styles.waves,
        )}
      >
        <path
          className="fill-landing-twilight"
          transform={BACK_WAVE_PLACEMENT}
          d={BACK_WAVE}
        />
        <path
          className="fill-brand-obsidian"
          transform={FRONT_WAVE_PLACEMENT}
          d={FRONT_WAVE}
        />
      </svg>
    </div>
  );
}

/**
 * The landing page's second section, "More than a program" (Figma 37:19,
 * tablet 279:150, mobile 294:1078). It follows the hero, so it rides up over
 * it behind the hero's wave. The copy sits in the middle of an oval ring of
 * faces that swirls in and drifts with scroll (BelongingRing); the copy
 * itself uses the site's text reveal.
 */
export function BelongingSection() {
  return (
    <section
      aria-labelledby="belonging-heading"
      className="relative overflow-clip bg-brand-warm-snow"
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          styles.stage,
        )}
      >
        <BelongingRing />
        <TextReveal className="relative z-10 mx-auto flex w-full max-w-360 flex-col items-center px-8 text-center md:px-16 xl:px-20">
          <h2
            id="belonging-heading"
            className="text-mobile-section font-extrabold text-brand-jade md:text-landing-section"
          >
            More than a program.
            <br />A place to belong.
          </h2>
          <p className="mt-6 text-body font-medium text-brand-obsidian md:max-w-146 md:text-landing-copy xl:max-w-196">
            Young Muslims is the nation&apos;s largest Muslim youth
            organization, but that&apos;s not how members describe it. To them,
            it&apos;s the people they see every week, the ones who became a
            second family. Across the country, Young Muslims turns everyday
            friendship into a stronger Deen, a stronger self, and a lifetime of
            brotherhood and sisterhood.
          </p>
          <StandardButton
            href="/about"
            label="Who We Are"
            {...textRevealUnit}
            className="mt-6 md:mt-8"
          />
        </TextReveal>
      </div>
      <BelongingWaves />
    </section>
  );
}
