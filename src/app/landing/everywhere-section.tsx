"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import bottomLeftPhoto from "../../../design-assets/figma/landing-2026/everywhere-bottom-left-photo.png";
import bottomRightPhoto from "../../../design-assets/figma/landing-2026/everywhere-bottom-right-photo.png";
import bottomRightShell from "../../../design-assets/figma/landing-2026/everywhere-bottom-right-shell.svg";
import mapCanada from "../../../design-assets/figma/landing-2026/everywhere-map/canada.svg";
import mapMexico from "../../../design-assets/figma/landing-2026/everywhere-map/mexico.svg";
import mapUs from "../../../design-assets/figma/landing-2026/everywhere-map/us.svg";
import brothersLogo from "../../../ymblogo.png";
import sistersLogo from "../../../ymslogo.png";
import leftPhoto from "../../../design-assets/figma/landing-2026/everywhere-left-photo.png";
import leftShell from "../../../design-assets/figma/landing-2026/everywhere-left-shell.svg";
import topPhoto from "../../../design-assets/figma/landing-2026/everywhere-top-photo.png";
import topShell from "../../../design-assets/figma/landing-2026/everywhere-top-shell.svg";

const METRICS = [
  { target: 200, suffix: "+", label: "NeighborNets" },
  { target: 26, suffix: "", label: "states" },
  { target: 10_000, suffix: "s", label: "of young Muslims" },
] as const;

// Illustrative branch badges in the globe artwork's coordinate space.
// Each full badge is positioned within the US outline, including coastal clusters.
const MAP_LOGOS = [
  {
    x: 388,
    y: 208,
    branch: "s",
  },
  {
    x: 380,
    y: 226,
    branch: "s",
  },
  {
    x: 378,
    y: 366,
    branch: "s",
  },
  {
    x: 378,
    y: 382,
    branch: "b",
  },
  {
    x: 386,
    y: 396,
    branch: "b",
  },
  {
    x: 418,
    y: 428,
    branch: "b",
  },
  {
    x: 428,
    y: 442,
    branch: "b",
  },
  {
    x: 442,
    y: 436,
    branch: "s",
  },
  {
    x: 408,
    y: 416,
    branch: "b",
  },
  {
    x: 432,
    y: 422,
    branch: "s",
  },
  {
    x: 468,
    y: 456,
    branch: "b",
  },
  {
    x: 482,
    y: 462,
    branch: "b",
  },
  {
    x: 500,
    y: 464,
    branch: "s",
  },
  {
    x: 712,
    y: 440,
    branch: "s",
  },
  {
    x: 704,
    y: 502,
    branch: "b",
  },
  {
    x: 696,
    y: 520,
    branch: "b",
  },
  {
    x: 718,
    y: 526,
    branch: "s",
  },
  {
    x: 702,
    y: 534,
    branch: "b",
  },
  {
    x: 692,
    y: 546,
    branch: "s",
  },
  {
    x: 728,
    y: 512,
    branch: "b",
  },
  {
    x: 684,
    y: 560,
    branch: "s",
  },
  {
    x: 744,
    y: 508,
    branch: "b",
  },
  {
    x: 766,
    y: 506,
    branch: "b",
  },
  {
    x: 676,
    y: 546,
    branch: "s",
  },
  {
    x: 686,
    y: 532,
    branch: "b",
  },
  {
    x: 784,
    y: 504,
    branch: "s",
  },
  {
    x: 720,
    y: 244,
    branch: "b",
  },
  {
    x: 720,
    y: 262,
    branch: "b",
  },
  {
    x: 734,
    y: 268,
    branch: "s",
  },
  {
    x: 746,
    y: 284,
    branch: "s",
  },
  {
    x: 728,
    y: 288,
    branch: "s",
  },
  {
    x: 744,
    y: 322,
    branch: "s",
  },
  {
    x: 818,
    y: 318,
    branch: "b",
  },
  {
    x: 816,
    y: 334,
    branch: "b",
  },
  {
    x: 838,
    y: 334,
    branch: "b",
  },
  {
    x: 850,
    y: 350,
    branch: "s",
  },
  {
    x: 900,
    y: 330,
    branch: "s",
  },
  {
    x: 892,
    y: 348,
    branch: "s",
  },
  {
    x: 914,
    y: 354,
    branch: "b",
  },
  {
    x: 930,
    y: 370,
    branch: "s",
  },
  {
    x: 874,
    y: 380,
    branch: "b",
  },
  {
    x: 866,
    y: 398,
    branch: "s",
  },
  {
    x: 888,
    y: 404,
    branch: "b",
  },
  {
    x: 904,
    y: 420,
    branch: "s",
  },
  {
    x: 1028,
    y: 220,
    branch: "s",
  },
  {
    x: 1010,
    y: 270,
    branch: "b",
  },
  {
    x: 986,
    y: 298,
    branch: "s",
  },
  {
    x: 994,
    y: 274,
    branch: "b",
  },
  {
    x: 974,
    y: 308,
    branch: "s",
  },
  {
    x: 972,
    y: 292,
    branch: "b",
  },
  {
    x: 960,
    y: 316,
    branch: "s",
  },
  {
    x: 958,
    y: 300,
    branch: "b",
  },
  {
    x: 956,
    y: 348,
    branch: "b",
  },
  {
    x: 970,
    y: 374,
    branch: "s",
  },
  {
    x: 972,
    y: 390,
    branch: "b",
  },
  {
    x: 958,
    y: 364,
    branch: "s",
  },
  {
    x: 942,
    y: 300,
    branch: "b",
  },
  {
    x: 942,
    y: 318,
    branch: "b",
  },
  {
    x: 934,
    y: 332,
    branch: "s",
  },
  {
    x: 944,
    y: 384,
    branch: "s",
  },
  {
    x: 900,
    y: 470,
    branch: "b",
  },
  {
    x: 892,
    y: 486,
    branch: "s",
  },
  {
    x: 950,
    y: 542,
    branch: "b",
  },
  {
    x: 940,
    y: 530,
    branch: "s",
  },
  {
    x: 934,
    y: 514,
    branch: "b",
  },
  {
    x: 926,
    y: 500,
    branch: "b",
  },
  {
    x: 912,
    y: 492,
    branch: "s",
  },
  {
    x: 920,
    y: 434,
    branch: "s",
  },
  {
    x: 912,
    y: 452,
    branch: "s",
  },
  {
    x: 798,
    y: 496,
    branch: "s",
  },
  {
    x: 774,
    y: 492,
    branch: "s",
  },
  {
    x: 814,
    y: 492,
    branch: "s",
  },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function CountUpMetric({
  target,
  suffix,
  label,
  isActive,
  isMobile,
  reduceMotion,
  className,
}: {
  target: number;
  suffix: string;
  label: string;
  isActive: boolean;
  isMobile: boolean;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const numberIsVisible = useInView(numberRef, { once: true, amount: 1 });
  const shouldCount = isMobile ? numberIsVisible : isActive;

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    let previousNumber = -1;
    const setNumber = (value: number) => {
      const rounded = Math.round(value);
      if (rounded === previousNumber) return;
      previousNumber = rounded;
      element.textContent = `${numberFormatter.format(rounded)}${suffix}`;
    };

    if (reduceMotion) {
      setNumber(target);
      return;
    }

    if (!shouldCount) {
      setNumber(0);
      return;
    }

    const controls = animate(0, target, {
      duration: 1.5,
      // Keep mobile integer steps evenly paced instead of lingering near the end.
      ...(isMobile ? { ease: "linear" as const } : {}),
      onUpdate: setNumber,
    });

    return () => controls.stop();
  }, [shouldCount, isMobile, reduceMotion, suffix, target]);

  return (
    <div
      className={`absolute top-0 text-center text-brand-obsidian ${className ?? ""}`}
    >
      <p className="font-display text-[32px] leading-normal font-normal tracking-[-0.02em] text-brand-royal md:text-landing-stat">
        <span
          ref={numberRef}
          aria-label={`${numberFormatter.format(target)}${suffix}`}
        >
          {numberFormatter.format(target)}
          {suffix}
        </span>
      </p>
      <p className="text-lg leading-normal font-semibold tracking-[-0.02em] md:text-landing-stat-label md:leading-[1.2] md:font-medium">
        {label}
      </p>
    </div>
  );
}

export function EverywhereSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [headingIsRevealed, setHeadingIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const metricsAreVisible = useInView(metricsRef, { once: true });
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 70, damping: 20 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 70, damping: 20 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mobileQuery.matches);

    updateMobile();
    mobileQuery.addEventListener("change", updateMobile);
    return () => mobileQuery.removeEventListener("change", updateMobile);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.08 && !headingIsRevealed) setHeadingIsRevealed(true);
  });

  const topPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [125, -125],
  );
  const bottomLeftPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [115, -115],
  );
  const bottomRightPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : isMobile ? [-16, 16] : [-100, 100],
  );
  const topLeftPortraitX = useTransform(smoothPointerX, (value) => value * -24);
  const topLeftPortraitY = useTransform(smoothPointerY, (value) => value * -18);
  const topRightPortraitX = useTransform(smoothPointerX, (value) => value * 20);
  const topRightPortraitY = useTransform(smoothPointerY, (value) => value * 16);
  const lowerLeftPortraitX = useTransform(
    smoothPointerX,
    (value) => value * 26,
  );
  const lowerLeftPortraitY = useTransform(
    smoothPointerY,
    (value) => value * 20,
  );
  const lowerRightPortraitX = useTransform(
    smoothPointerX,
    (value) => value * -22,
  );
  const lowerRightPortraitY = useTransform(
    smoothPointerY,
    (value) => value * 18,
  );
  const globeOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.36],
    reduceMotion ? [1, 1] : [0, 1],
  );
  const globeY = useTransform(
    scrollYProgress,
    [0.2, 0.38],
    reduceMotion ? [0, 0] : [90, 0],
  );
  const globeScale = useTransform(
    scrollYProgress,
    [0.2, 0.38],
    reduceMotion ? [1, 1] : [0.94, 1],
  );

  function updatePointer(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || isMobile || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      className="relative h-[1495px] w-full overflow-hidden bg-brand-warm-snow md:h-[1963px]"
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
        <motion.div
          initial={false}
          animate={{
            opacity: reduceMotion || headingIsRevealed ? 1 : 0,
            y: reduceMotion || headingIsRevealed ? 0 : 32,
          }}
          transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[41px] left-1/2 w-[296px] -translate-x-1/2 text-center text-brand-obsidian md:top-[232px] md:w-[440px]"
        >
          <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section md:leading-[1.2]">
            And it&apos;s not just here. It&apos;s{" "}
            <span className="text-landing-cyan">everywhere</span>.
          </h2>
          <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy md:leading-[1.2]">
            What started as a few friends in one city is now a network that
            spans the country.
          </p>
        </motion.div>

        <div
          ref={metricsRef}
          className="absolute top-[281px] left-0 h-[358px] w-full md:top-[533px] md:h-[121px]"
        >
          {METRICS.map((metric, index) => (
            <CountUpMetric
              key={metric.label}
              {...metric}
              isActive={metricsAreVisible}
              isMobile={isMobile}
              reduceMotion={reduceMotion}
              className={
                index === 0
                  ? "left-1/2 -translate-x-1/2 md:left-[181px] md:translate-x-0"
                  : index === 1
                    ? "top-[152px] left-1/2 -translate-x-1/2 md:top-0 md:left-[669px] md:translate-x-0"
                    : "top-[304px] left-1/2 -translate-x-1/2 md:top-0 md:left-[1001px] md:translate-x-0"
              }
            />
          ))}
        </div>

        <div
          role="img"
          aria-label="Map showing Young Muslims NeighborNet communities across the United States, with blue YMB logos for brothers and green YMS logos for sisters"
          className="absolute top-[705px] left-1/2 h-[795px] w-[1440px] origin-top -translate-x-1/2 scale-[0.339] md:top-[702px] md:left-0 md:translate-x-0 md:scale-100"
        >
          <motion.div
            className="relative size-full"
            style={{ opacity: globeOpacity, y: globeY, scale: globeScale }}
          >
            <div
              aria-hidden="true"
              className="absolute top-[37px] left-0 size-[1440px] rounded-full bg-brand-warm-snow"
            />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]"
              style={{ clipPath: "circle(720px at 720px 756.85px)" }}
            >
              <div className="absolute top-[-875px] left-[-632px] h-[1891px] w-[2522px]">
                <Image
                  src={mapCanada}
                  alt=""
                  className="absolute top-[245px] left-[898px] max-w-none"
                  style={{
                    opacity: 0.3,
                    maskImage:
                      "linear-gradient(to bottom, #000 45%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 45%, transparent 100%)",
                  }}
                />
                <Image
                  src={mapUs}
                  alt=""
                  className="absolute top-[500px] left-[373px] max-w-none"
                />
                <Image
                  src={mapMexico}
                  alt=""
                  className="absolute top-[1330px] left-[1021px] max-w-none"
                  style={{
                    opacity: 0.2,
                    maskImage:
                      "linear-gradient(to bottom, #000 25%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 25%, transparent 100%)",
                  }}
                />
              </div>

              <svg
                aria-hidden="true"
                viewBox="0 0 1440 795"
                className="absolute inset-0 h-full w-full"
              >
                {MAP_LOGOS.map(({ x, y, branch }, index) => (
                  <foreignObject
                    key={index}
                    x={x - 12}
                    y={y - 12}
                    width={24}
                    height={24}
                  >
                    <div
                      className={`flex size-6 items-center justify-center rounded-pill p-px ${branch === "b" ? "bg-brand-royal" : "bg-brand-jade"}`}
                    >
                      <Image
                        src={branch === "b" ? brothersLogo : sistersLogo}
                        alt=""
                        className="size-full object-contain"
                        sizes="24px"
                      />
                    </div>
                  </foreignObject>
                ))}
              </svg>

              <div className="absolute top-[37px] left-0 h-[772px] w-[1440px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_45.5%,var(--color-brand-warm-snow)_100%)]" />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[37px] left-0 size-[1440px] rounded-full border-2 border-[#a9a8ac]"
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute top-[83px] left-[79px] hidden h-[371px] w-[366px] md:block"
          style={{ y: topPortraitY }}
        >
          <motion.div
            className="relative size-full"
            style={{ x: topLeftPortraitX, y: topLeftPortraitY }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="absolute top-[13px] left-[43px] h-[285px] w-[282px] -rotate-30">
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 h-[208px] w-[230px] -translate-x-1/2 -translate-y-1/2 scale-110 -rotate-90 bg-[#e3f2ed]"
                style={{
                  maskImage: `url("${bottomLeftPhoto.src}")`,
                  WebkitMaskImage: `url("${bottomLeftPhoto.src}")`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
              <Image
                src={bottomLeftPhoto}
                alt=""
                className="absolute top-1/2 left-1/2 h-[213px] w-[202px] -translate-x-1/2 -translate-y-1/2 -rotate-90 object-contain"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-[178px] left-[261px] h-[205px] w-[215px] md:top-[116px] md:left-[993px] md:h-[332px] md:w-[347px]"
          style={{ y: topPortraitY }}
        >
          <motion.div
            className="relative size-full"
            style={{ x: topRightPortraitX, y: topRightPortraitY }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <Image src={topShell} alt="" className="size-full max-w-none" />
            <Image
              src={topPhoto}
              alt=""
              className="absolute top-[26px] left-[27px] h-[153px] w-[160px] object-contain md:top-[43px] md:left-[45px] md:h-[247px] md:w-[258px]"
            />
          </motion.div>
        </motion.div>

        <motion.div
          data-discover-portrait="left"
          className="absolute top-[1230px] left-[28px] h-[272px] w-[269px] origin-top-left scale-[0.55] md:top-[1385px] md:left-[43px] md:h-[446px] md:w-[439px] md:scale-100"
          style={{ y: isMobile ? 0 : bottomLeftPortraitY }}
        >
          <motion.div
            className="relative size-full"
            style={{ x: lowerLeftPortraitX, y: lowerLeftPortraitY }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={leftShell}
                alt=""
                className="h-[179px] w-[198px] max-w-none rotate-[-126.04deg] md:h-[261px] md:w-[289px]"
              />
            </div>
            <div className="absolute top-[30px] left-[30px] flex h-[212px] w-[209px] rotate-[-126.04deg] items-center justify-center md:top-[44px] md:left-[44px] md:h-[357px] md:w-[352px]">
              <Image
                src={leftPhoto}
                alt=""
                className="h-[170px] w-[187px] max-w-none rotate-90 object-contain md:h-[241px] md:w-[266px]"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          data-discover-portrait="right"
          className="absolute top-[1230px] left-[188px] h-[209px] w-[203px] origin-top-left scale-[0.7] md:top-[1349px] md:left-[1071px] md:h-[271px] md:w-[264px] md:scale-100"
          style={{ y: isMobile ? 0 : bottomRightPortraitY }}
        >
          <motion.div
            className="relative size-full"
            style={{ x: lowerRightPortraitX, y: lowerRightPortraitY }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <Image
              src={bottomRightShell}
              alt=""
              className="size-full max-w-none"
            />
            <Image
              src={bottomRightPhoto}
              alt=""
              className="absolute top-[21px] left-[21px] h-[167px] w-[163px] object-contain md:top-[27px] md:left-[27px] md:h-[217px] md:w-[211px]"
            />
          </motion.div>
        </motion.div>

        <p className="absolute top-[1016px] left-1/2 w-[296px] -translate-x-1/2 text-center text-base leading-normal font-medium tracking-[-0.02em] text-brand-obsidian md:top-[1477px] md:w-[560px] md:text-landing-copy md:leading-[1.2]">
          Wherever you go, there&apos;s a Young Muslim. A brother or sister in a
          city you&apos;ve never been to, dealing with the same things you are.
        </p>
        <Link
          href="/neighbornets"
          className="ym-cta-trigger absolute top-[1134px] left-1/2 inline-flex w-[296px] -translate-x-1/2 items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-nav font-bold whitespace-nowrap text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none md:top-[1557px] md:w-auto"
        >
          <AnimatedCtaLabel label="Discover NeighborNets" />
        </Link>
      </div>
    </section>
  );
}
