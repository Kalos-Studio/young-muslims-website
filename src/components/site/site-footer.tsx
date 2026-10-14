"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// Optimized from the original 128 MB "find a NN Pic.png" in the repository root.
import findNnPic from "../../../design-assets/figma/neighbornets/footer-find-nn.webp";
import footerPic2 from "../../../footer pic 2.png";
import footerPic3 from "../../../footer pic 3.png";
import footerPic4 from "../../../footer pic 4 1.png";
import footerPic from "../../../footer pic.png";
import footerLakeside from "../../../design-assets/figma/neighbornets/footer-lakeside.jpg";
import mustafaPhotoAlt from "../../../design-assets/figma/stories/mustafa-photo-alt.jpeg";
import footerFacebook from "../../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import footerInstagram from "../../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import footerLogo from "../../../design-assets/figma/landing-2026/new-sections/footer-logo.svg";
import footerX from "../../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import footerYoutube from "../../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";
import { getNavigationItems } from "./nav-links";
import { useFooterPageStage } from "./footer-page-stage";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

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
const FLASH_DURATION_MS = 240;
const FINAL_FRAME_HOLD_MS = 300;
const RETURN_DURATION_MS = 680;
const TAGLINE_COPY = "FOR THE YOUTH. BY THE YOUTH.";
const TAGLINE_REPETITIONS = 5;
const TAGLINE_TRAVEL_DISTANCE = 240;

type FooterPhase = "idle" | "revealing" | "flashing" | "returning";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FooterMontage({
  frame,
  onFrameSettled,
}: {
  frame: number;
  onFrameSettled: (index: number, loaded: boolean) => void;
}) {
  return (
    <>
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
            loading="eager"
            onLoad={() => onFrameSettled(index, true)}
            onError={() => onFrameSettled(index, false)}
            className="object-cover"
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <Image src={footerLogo} alt="" className="block h-auto w-7/8" />
      </div>
    </>
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
  const finishedAtRef = useRef(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const settledFramesRef = useRef(new Map<number, boolean>());
  const [availableFrames, setAvailableFrames] = useState<number[] | null>(null);
  const { pageY, footerEdgeOffset, montageHost } = useFooterPageStage();
  const pathname = usePathname();
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const footerHasEntered = useInView(footerRef, { once: true, amount: 0.05 });
  const footerIsNearby = useInView(footerRef, {
    once: true,
    margin: "1000px 0px",
  });
  const [phase, setPhase] = useState<FooterPhase>("idle");
  const [montageFrame, setMontageFrame] = useState(0);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const taglineX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion
      ? [0, 0, 0]
      : [-TAGLINE_TRAVEL_DISTANCE, 0, TAGLINE_TRAVEL_DISTANCE],
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const queueTimer = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
  }, []);

  const onFrameSettled = useCallback((index: number, loaded: boolean) => {
    if (settledFramesRef.current.has(index)) return;
    settledFramesRef.current.set(index, loaded);
    if (settledFramesRef.current.size === MONTAGE_IMAGES.length) {
      setAvailableFrames(
        MONTAGE_IMAGES.flatMap((_, frame) =>
          settledFramesRef.current.get(frame) ? [frame] : [],
        ),
      );
    }
  }, []);

  const resetMontage = useCallback(() => {
    clearTimers();
    animationRef.current?.stop();
    pageY.set(0);
    footerEdgeOffset.set(0);
    runningRef.current = false;
    setPhase("idle");
  }, [clearTimers, footerEdgeOffset, pageY]);

  const syncFooterEdge = useCallback(() => {
    const footerBottom = footerRef.current?.getBoundingClientRect().bottom;
    if (footerBottom === undefined) return;

    // The footer rect includes the animated page translation. Remove that
    // translation so the photo clip follows native scrolling independently.
    footerEdgeOffset.set(
      Math.max(0, footerBottom - window.innerHeight - pageY.get()),
    );
  }, [footerEdgeOffset, pageY]);

  const playMontage = useCallback(() => {
    if (
      reduceMotion ||
      runningRef.current ||
      !availableFrames?.length ||
      Date.now() - finishedAtRef.current < 350
    )
      return;

    clearTimers();
    runningRef.current = true;
    setMontageFrame(availableFrames[0]);
    setPhase("revealing");
    animationRef.current?.stop();
    syncFooterEdge();
    animationRef.current = animate(pageY, -EASTER_EGG_HEIGHT, {
      duration: REVEAL_DURATION_MS / 1000,
      ease: [0.22, 1, 0.36, 1],
    });

    queueTimer(() => {
      setPhase("flashing");

      for (let index = 1; index < availableFrames.length; index += 1) {
        queueTimer(
          () => setMontageFrame(availableFrames[index]),
          index * FLASH_DURATION_MS,
        );
      }

      queueTimer(
        () => {
          setPhase("returning");
          animationRef.current = animate(pageY, 0, {
            duration: RETURN_DURATION_MS / 1000,
            ease: [0.22, 1, 0.36, 1],
          });
          queueTimer(() => {
            runningRef.current = false;
            finishedAtRef.current = Date.now();
            setPhase("idle");
          }, RETURN_DURATION_MS);
        },
        (availableFrames.length - 1) * FLASH_DURATION_MS + FINAL_FRAME_HOLD_MS,
      );
    }, REVEAL_DURATION_MS);
  }, [
    availableFrames,
    clearTimers,
    pageY,
    queueTimer,
    reduceMotion,
    syncFooterEdge,
  ]);

  useEffect(() => resetMontage, [pathname, reduceMotion, resetMontage]);

  useEffect(() => {
    if (reduceMotion) return;
    let touchY: number | null = null;
    let touchStartedAtBottom = false;
    let lastWheelAt = 0;
    let wheelStartedBeforeBottom = false;
    const isAtPageBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2;
    const footerIsVisible = () => {
      const bounds = footerRef.current?.getBoundingClientRect();
      return Boolean(
        bounds && bounds.top < window.innerHeight && bounds.bottom > 0,
      );
    };
    const canPlay = () =>
      footerIsVisible() &&
      document.documentElement.style.overflow !== "hidden" &&
      !document.querySelector('dialog[open], [role="dialog"]');
    const onScroll = () => {
      if (runningRef.current) syncFooterEdge();
      if (runningRef.current && !footerIsVisible()) resetMontage();
    };
    const onWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelAt > 200) {
        wheelStartedBeforeBottom = !isAtPageBottom();
      }
      lastWheelAt = now;
      if (
        !event.ctrlKey &&
        event.deltaY > 0 &&
        !wheelStartedBeforeBottom &&
        isAtPageBottom() &&
        canPlay()
      )
        playMontage();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
      touchStartedAtBottom = isAtPageBottom();
    };
    const onTouchMove = (event: TouchEvent) => {
      const nextY = event.touches[0]?.clientY;
      if (
        nextY !== undefined &&
        event.touches.length === 1 &&
        touchY !== null &&
        touchY - nextY > 8 &&
        touchStartedAtBottom &&
        isAtPageBottom() &&
        canPlay()
      )
        playMontage();
    };
    const onTouchEnd = () => {
      touchY = null;
      touchStartedAtBottom = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        (target instanceof Element &&
          target.closest(
            'input, textarea, select, button, a, [contenteditable="true"]',
          ))
      )
        return;
      if (
        ["ArrowDown", "PageDown", "End", " "].includes(event.key) &&
        isAtPageBottom() &&
        canPlay()
      )
        playMontage();
    };
    const onResize = () => {
      if (runningRef.current) syncFooterEdge();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [playMontage, reduceMotion, resetMontage, syncFooterEdge]);

  return (
    <footer
      ref={footerRef}
      data-footer-phase={phase}
      data-footer-ready={Boolean(availableFrames?.length)}
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
                aria-label={contactLink.label}
                className="ym-cta-trigger mt-6 inline-flex w-full items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:w-auto"
              >
                <AnimatedCtaLabel label={contactLink.label} />
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute top-[514px] left-1/2 -mt-6 w-screen -translate-x-1/2 overflow-hidden py-4 md:top-[334px]"
          >
            <motion.div
              className="-ml-[741px] flex w-max gap-8 font-display text-[32px] whitespace-nowrap text-brand-warm-snow/20 uppercase md:-ml-[1995px] md:text-marquee"
              style={{ x: taglineX }}
            >
              {Array.from({ length: TAGLINE_REPETITIONS }).map((_, index) => (
                <span key={index} className="shrink-0">
                  {TAGLINE_COPY}
                </span>
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
      </div>
      {montageHost &&
        footerIsNearby &&
        !reduceMotion &&
        createPortal(
          <div
            data-footer-stage
            aria-hidden="true"
            className="absolute inset-0"
            style={{ visibility: phase === "idle" ? "hidden" : "visible" }}
          >
            <FooterMontage
              frame={montageFrame}
              onFrameSettled={onFrameSettled}
            />
          </div>,
          montageHost,
        )}
    </footer>
  );
}
