import type { StaticImageData } from "next/image";

import brooklynPhoto from "../../../design-assets/figma/landing-2026/neighbornets/brooklyn.jpg";
import houstonPhoto from "../../../design-assets/figma/landing-2026/neighbornets/houston.jpg";
import stamfordPhoto from "../../../design-assets/figma/landing-2026/neighbornets/stamford.jpg";
import suwaneePhoto from "../../../design-assets/figma/landing-2026/neighbornets/suwanee.jpg";
import tampaPhoto from "../../../design-assets/figma/landing-2026/neighbornets/tampa.jpg";

/*
 * The NeighborNets in the landing page's "Let's find your story" switcher
 * (Figma 251:509), in list order; the first is selected at first. Swap or
 * extend freely: the switcher reads only this array.
 *
 * - `highlight`: the text colour class for the name while selected.
 * - `alternates`: Boldonse's `ss01` glyphs, as on Tampa and Brooklyn in Figma.
 * - `photo`: pre-cropped to the tile's 484 x 547.6 framing
 *   (scripts/neighbornets-assets.mjs).
 * - `shape`: the organic shape behind the tile, from the Figma vector: its
 *   path, viewBox, any rotation (baked in here, about the shape's centre)
 *   and `className`, which places it relative to the tile (CSS module).
 */
export type NeighborNet = {
  slug: string;
  city: string;
  state: string;
  highlight: string;
  /** Sets the name with Boldonse's first stylistic set, as Figma does. */
  alternates?: boolean;
  photo: StaticImageData;
  shape: {
    viewBox: string;
    path: string;
    transform?: string;
    className: string;
  };
};

export const NEIGHBORNETS: NeighborNet[] = [
  {
    slug: "houston",
    city: "Houston",
    state: "Texas",
    highlight: "text-sisters-brass",
    photo: houstonPhoto,
    shape: {
      // The 768.456 x 808.727 vector, turned 29.9deg as in Figma, in its
      // turned bounds.
      viewBox: "0 0 1069.3 1084.2",
      transform:
        "translate(534.65 542.1) rotate(-29.9) translate(-384.228 -404.364)",
      path: "M754.953 328.321C692.212 556.845 572.493 798.326 354.514 808.545C183.418 815.575 -8.68809 617.706 0.304097 416.649C10.6451 200.836 222.697 32.2738 428.25 4.60238C667.402 -26.7068 815.323 103.966 754.953 328.321Z",
      className: "houston",
    },
  },
  {
    slug: "stamford",
    city: "Stamford",
    state: "Connecticut",
    highlight: "text-brothers-slate",
    photo: stamfordPhoto,
    shape: {
      viewBox: "0 0 776 798",
      path: "M678.802 157.731C665.409 152.754 650.681 149.389 636.276 144.872C593.152 131.368 553.341 113.348 523.886 77.5836C500.276 48.9166 487.435 -1.04343 442.056 0.0166C419.504 0.523571 398.702 12.4148 380.937 26.3795C363.172 40.2982 347.201 56.6597 328.01 68.5504C291.651 91.0876 256.627 89.1058 216.356 84.036C181.93 79.7037 148.747 83.0681 135.539 122.566C129.418 140.863 128.451 160.496 124.263 179.346C111.422 237.233 60.8422 266.269 21.8141 304.983C-23.151 349.55 10.9526 394.118 38.7969 435.229C56.1478 460.854 65.9969 489.475 69.6788 520.077C73.7749 554.137 59.8296 582.895 59.4154 617.093C58.1727 717.058 183.219 686.687 238.31 729.733C268.961 753.653 293.86 791.169 333.809 797.206C376.38 803.659 406.388 769 445.324 757.063C500.184 740.241 556.655 790.385 610.548 769.184C654.225 751.993 660.162 682.769 679.584 645.345C700.018 605.94 737.85 579.485 761.552 542.43C793.585 492.378 765.832 457.812 741.21 409.742C704.805 338.766 745.582 275.855 725.654 204.926C718.014 177.687 700.157 165.658 678.802 157.731Z",
      className: "stamford",
    },
  },
  {
    slug: "suwanee",
    city: "Suwanee",
    state: "Georgia",
    highlight: "text-brand-jade",
    photo: suwaneePhoto,
    shape: {
      viewBox: "0 0 855 850",
      path: "M763.721 646.12C732.012 672.343 695.974 694.021 660.219 714.705C530.466 789.68 413.274 925.524 268.466 796.779C171.833 710.824 19.7793 541.373 1.38424 408.369C-20.4452 250.421 221.466 102.318 335.13 28.5736C375.307 2.49347 411.862 -5.83706 459.661 4.00809C562.645 25.213 649.352 119.499 711.406 198.734C796.606 307.504 917.327 454.281 817.071 590.646C801.734 611.52 783.574 629.743 763.721 646.167V646.12Z",
      className: "suwanee",
    },
  },
  {
    slug: "tampa",
    city: "Tampa",
    alternates: true,
    state: "Florida",
    highlight: "text-brothers-sky",
    photo: tampaPhoto,
    shape: {
      viewBox: "0 0 1068 1054",
      path: "M354.848 237.353C536.761 269.923 422.483 142.844 488.8 18.2608C517.416 -35.3473 559.635 41.5584 582.745 88.7185C646.144 218.244 644.403 160.212 728.888 124.253C840.954 76.6226 730.676 284.183 821.797 301.268C850.838 306.681 895.74 304.798 946.101 308.611C1090.5 319.624 1118.32 373.421 965.775 455.645C704.13 596.702 1271.62 1472.69 697.07 807.369C635.601 736.158 623.316 739.688 582.745 822.618C553.846 881.686 509.227 954.591 479.81 935.106C394.242 878.109 522.311 699.211 272.01 816.782C-141.237 1010.88 259.961 572.98 272.01 548.318C293.049 505.346 -403.634 101.615 354.801 237.306L354.848 237.353Z",
      className: "tampa",
    },
  },
  {
    slug: "brooklyn",
    city: "Brooklyn",
    alternates: true,
    state: "New York",
    highlight: "text-sisters-buttercup",
    photo: brooklynPhoto,
    shape: {
      viewBox: "0 0 1065.51 830.928",
      path: "M259.871 766.132C314.643 762.911 369.576 774.026 418.71 798.459C544.686 861.125 695.095 834.92 789.604 703.789C824.185 655.836 871.01 619.053 925.675 596.607C1164.9 498.34 1101.32 67.8948 703.042 78.0975C649.237 79.4937 596.773 67.1967 549.089 42.2808C53.9921 -216.115 -242.207 795.505 259.871 766.132Z",
      className: "brooklyn",
    },
  },
];
