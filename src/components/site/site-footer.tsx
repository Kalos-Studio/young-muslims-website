"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { animate, useInView, useScroll } from "motion/react";
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
import footerFacebook from "../../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import footerInstagram from "../../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import footerLogo from "../../../design-assets/figma/landing-2026/new-sections/footer-logo.svg";
import footerX from "../../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import footerYoutube from "../../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";
import { getNavigationItems } from "./nav-links";
import { useFooterPageStage } from "./footer-page-stage";
import { FooterScrollLayers } from "./footer-scroll-layers";
import { StandardButton } from "@/components/ui/standard-button";

const FOOTER_LINKS = [
  getNavigationItems("footer-primary"),
  getNavigationItems("footer-secondary"),
] as const;
const [contactLink] = getNavigationItems("footer-contact");

/* The social profiles, in Figma's order; each opens in a new tab. */
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/youngmuslims",
    icon: footerFacebook,
  },
  { label: "X", href: "https://twitter.com/youngmuslims", icon: footerX },
  {
    label: "YouTube",
    href: "https://www.youtube.com/youngmuslims",
    icon: footerYoutube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/young_muslims/",
    icon: footerInstagram,
  },
] as const;

/* PLACEHOLDER destinations: the privacy pages do not exist yet. Swap in the
   real routes when they are built. */
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Donor Privacy", href: "/donor-privacy" },
] as const;

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
 * The shared closing footer (Figma 273:618, tablet 280:843, mobile
 * 298:1459). Its dark ground is one organic shape with a wavy top that
 * rises above the footer's box (FooterScrollLayers, which also holds the
 * scroll-linked shapes and tagline); with the bottom-edge montage, these are
 * progressive layers that leave the navigation usable without JavaScript or
 * motion.
 *
 * The Easter egg (the montage the page lifts to reveal at its foot) is
 * load-bearing: its listeners, gating, timings and the page translation it
 * shares with the header through FooterPageStage are deliberately left
 * as they were. The visual layers only write transforms on their own
 * elements, inside the clipped wrapper, and change no layout.
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
      // Continuing a gesture after reaching the bottom must work too; requiring
      // a new gesture made the shared Easter egg appear absent on long pages.
      if (!event.ctrlKey && event.deltaY > 0 && isAtPageBottom() && canPlay())
        playMontage();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const nextY = event.touches[0]?.clientY;
      if (
        nextY !== undefined &&
        event.touches.length === 1 &&
        touchY !== null &&
        touchY - nextY > 8 &&
        isAtPageBottom() &&
        canPlay()
      )
        playMontage();
    };
    const onTouchEnd = () => {
      touchY = null;
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
      className="relative h-198.5 w-full text-brand-warm-snow md:h-131.25"
    >
      <FooterScrollLayers progress={scrollYProgress} />
      <div className="absolute inset-0">
        <div className="relative mx-auto flex h-full max-w-360 flex-col px-8 md:px-16 md:pt-10 xl:px-20 xl:pt-15">
          <div className="flex flex-col items-center gap-16 md:flex-row md:items-start md:justify-between md:gap-0">
            <div className="flex flex-col items-center md:items-start md:gap-12 xl:contents">
              <Link
                href="/"
                aria-label="Young Muslims home"
                className="block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow xl:order-1"
              >
                <Image
                  src={footerLogo}
                  alt=""
                  className="block h-auto w-69.5"
                />
              </Link>
              <div className="hidden md:block md:w-93.25 xl:order-3">
                <ContactBlock />
              </div>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex w-full shrink-0 gap-14 text-nav font-semibold whitespace-nowrap md:w-auto xl:order-2"
            >
              {FOOTER_LINKS.map((column, index) => (
                <ul key={index} className="flex flex-col gap-6">
                  {column.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="ym-cta-trigger block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow"
                      >
                        <span className="ym-cta-roll">
                          <span
                            className="ym-cta-roll__text"
                            data-text={link.label}
                          >
                            {link.label}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>

            <div className="w-full md:hidden">
              <ContactBlock />
            </div>
          </div>

          <div className="mt-auto mb-16 flex flex-col items-center gap-8 text-footer-legal font-bold md:mb-10 md:flex-row md:justify-between md:gap-0">
            <div className="flex items-center gap-6">
              <span>© Young Muslims 2026</span>
              <a
                href="https://kalos.so"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brothers-slate underline outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow"
              >
                Made by Kalos Studio
              </a>
            </div>
            <ul aria-label="Social media" className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow"
                  >
                    <Image src={social.icon} alt="" className="block size-8" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1">
              {LEGAL_LINKS.map((legal, index) => (
                <span key={legal.label} className="flex items-center gap-1">
                  {index > 0 ? <span aria-hidden="true">•</span> : null}
                  <a
                    href={legal.href}
                    className="outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow"
                  >
                    {legal.label}
                  </a>
                </span>
              ))}
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

/** The contact copy and "Contact us" (the dark StandardButton, to /contact). */
function ContactBlock() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-nav font-semibold">
        Want to learn more about Young Muslims, what we do, or how to
        join/create a NeighborNet? Reach out to us via email.
      </p>
      <StandardButton
        href={contactLink.href}
        label={contactLink.label}
        tone="dark"
        className="md:self-start"
      />
    </div>
  );
}
