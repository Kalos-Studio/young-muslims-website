"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import findNnPic from "../../../find a NN Pic.png";
import footerPic2 from "../../../footer pic 2.png";
import footerPic3 from "../../../footer pic 3.png";
import footerPic4 from "../../../footer pic 4 1.png";
import footerPic from "../../../footer pic.png";
import footerLakeside from "../../../design-assets/figma/neighbornets/footer-lakeside.jpg";
import mustafaPhotoAlt from "../../../design-assets/figma/stories/mustafa-photo-alt.jpeg";
import footerFacebook from "../../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import footerInstagram from "../../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import footerLogo from "../../../design-assets/figma/landing-2026/new-sections/footer-logo.svg";
import footerTagline from "../../../design-assets/figma/landing-2026/new-sections/footer-tagline.svg";
import footerX from "../../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import footerYoutube from "../../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";
import { getNavigationItems } from "./nav-links";

const FOOTER_LINKS = [
  getNavigationItems("footer-primary"),
  getNavigationItems("footer-secondary"),
] as const;
const [contactLink] = getNavigationItems("footer-contact");

const MONTAGE_IMAGES: readonly StaticImageData[] = [
  findNnPic,
  footerPic2,
  footerPic3,
  footerPic4,
  footerPic,
  footerLakeside,
  mustafaPhotoAlt,
];

const EASTER_EGG_HEIGHT = 200;
const REVEAL_DURATION_MS = 560;
const FLASH_DURATION_MS = 130;
const FINAL_FRAME_HOLD_MS = 110;
const RETURN_DURATION_MS = 680;
const TAGLINE_REPETITIONS = 3;

type FooterPhase = "idle" | "revealing" | "flashing" | "returning";

function FooterMontage({ frame }: { frame: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-[794px] left-0 h-[200px] w-full overflow-hidden bg-brand-obsidian md:top-[525px]"
    >
      {MONTAGE_IMAGES.map((image, index) => (
        <div
          key={image.src}
          className="absolute inset-0"
          style={{ opacity: index === frame ? 1 : 0 }}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * The shared closing footer. Its normal state follows the Figma layout; the
 * leading wave, directional tagline and bottom-edge montage are progressive
 * motion layers that leave the navigation usable without JavaScript or motion.
 */
export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runningRef = useRef(false);
  const armedRef = useRef(true);
  const previousProgressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const footerHasEntered = useInView(footerRef, { once: true, amount: 0.05 });
  const [phase, setPhase] = useState<FooterPhase>("idle");
  const [montageFrame, setMontageFrame] = useState(0);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const taglineX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-96, 96],
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const queueTimer = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  const playMontage = useCallback(() => {
    if (reduceMotion || runningRef.current || !armedRef.current) return;

    clearTimers();
    runningRef.current = true;
    armedRef.current = false;
    setMontageFrame(0);
    setPhase("revealing");

    queueTimer(() => {
      setPhase("flashing");

      for (let index = 1; index < MONTAGE_IMAGES.length; index += 1) {
        queueTimer(() => setMontageFrame(index), index * FLASH_DURATION_MS);
      }

      queueTimer(
        () => {
          setPhase("returning");
          queueTimer(() => {
            runningRef.current = false;
            setPhase("idle");
            setMontageFrame(0);
          }, RETURN_DURATION_MS);
        },
        (MONTAGE_IMAGES.length - 1) * FLASH_DURATION_MS + FINAL_FRAME_HOLD_MS,
      );
    }, REVEAL_DURATION_MS);
  }, [clearTimers, queueTimer, reduceMotion]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const isScrollingDown = progress > previousProgressRef.current;

    if (progress < 0.72) armedRef.current = true;
    if (progress >= 0.985 && isScrollingDown) playMontage();

    previousProgressRef.current = progress;
  });

  useEffect(() => clearTimers, [clearTimers]);

  const montageIsRaised = phase === "revealing" || phase === "flashing";
  const stageTransition =
    phase === "revealing"
      ? { type: "spring" as const, stiffness: 92, damping: 20, mass: 0.9 }
      : {
          duration: RETURN_DURATION_MS / 1000,
          ease: [0.22, 1, 0.36, 1] as const,
        };

  return (
    <footer
      ref={footerRef}
      data-footer-phase={phase}
      className="relative h-[794px] w-full text-brand-warm-snow md:h-[525px]"
    >
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          y: reduceMotion || footerHasEntered ? 0 : 84,
          scaleY: reduceMotion || footerHasEntered ? 1 : 0.72,
        }}
        transition={{ type: "spring", stiffness: 62, damping: 18, mass: 0.95 }}
        className="pointer-events-none absolute right-0 bottom-[calc(100%-1px)] left-0 h-[110px] origin-bottom text-brand-obsidian"
      >
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 110V79C172 11 347 104 554 67C781 26 850 3 1051 37C1215 65 1325 49 1440 8V110H0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      <div className="absolute inset-0 overflow-hidden bg-brand-obsidian">
        <motion.div
          data-footer-stage
          className="absolute top-0 left-0 h-[994px] w-full bg-brand-obsidian md:h-[725px]"
          animate={{
            y: reduceMotion || !montageIsRaised ? 0 : -EASTER_EGG_HEIGHT,
          }}
          transition={stageTransition}
        >
          <div className="absolute top-0 left-1/2 h-[794px] w-[360px] -translate-x-1/2 md:h-[525px] md:w-[1440px]">
            <div className="absolute top-0 left-8 flex w-[296px] flex-col items-stretch md:top-[60px] md:left-[80px] md:w-[1280px] md:flex-row md:items-start md:justify-between">
              <Image
                src={footerLogo}
                alt="Young Muslims"
                className="mx-auto mt-0 w-[278px] md:mx-0 md:mt-0 md:w-auto"
              />

              <nav
                aria-label="Footer navigation"
                className="mt-[64px] flex gap-14 text-nav font-semibold md:mt-0"
              >
                {FOOTER_LINKS.map((column, index) => (
                  <div key={index} className="flex flex-col gap-6">
                    {column.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        className="hover:underline"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>

              <div className="mt-[64px] w-[296px] md:mt-0 md:w-[373px]">
                <p className="text-nav font-semibold">
                  Want to learn more about Young Muslims, what we do, or how to
                  join/create a NeighborNet? Reach out to us via email.
                </p>
                <Link
                  href={contactLink.href}
                  className="mt-6 inline-flex w-full justify-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:w-auto"
                >
                  {contactLink.label}
                </Link>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute top-[514px] left-1/2 w-screen -translate-x-1/2 overflow-hidden md:top-[334px]"
            >
              <motion.div
                className="-ml-[741px] flex w-max md:-ml-[1995px]"
                style={{ x: taglineX }}
              >
                {Array.from({ length: TAGLINE_REPETITIONS }).map((_, index) => (
                  <Image
                    key={index}
                    src={footerTagline}
                    alt=""
                    className="block h-auto w-[741px] max-w-none shrink-0 opacity-100 md:w-auto"
                  />
                ))}
              </motion.div>
            </div>

            <div className="absolute top-[610px] left-8 flex h-[120px] w-[296px] flex-col items-center justify-between text-[10px] font-bold tracking-[-0.02em] md:top-[453px] md:left-[80px] md:h-auto md:w-[1280px] md:flex-row">
              <div className="flex w-full justify-between gap-6 md:w-auto md:justify-start">
                <span>© Young Muslims 2026</span>
                <span className="text-brothers-slate underline">
                  Made by Kalos Studio
                </span>
              </div>
              <div className="flex gap-4" aria-label="Social media">
                <Image src={footerFacebook} alt="Facebook" />
                <Image src={footerX} alt="X" />
                <Image src={footerYoutube} alt="YouTube" />
                <Image src={footerInstagram} alt="Instagram" />
              </div>
              <div className="flex gap-2">
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Donor Privacy</span>
              </div>
            </div>
          </div>

          <FooterMontage frame={montageFrame} />
        </motion.div>
      </div>
    </footer>
  );
}
