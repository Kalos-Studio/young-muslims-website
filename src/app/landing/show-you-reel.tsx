"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import highlightReel from "../../../design-assets/figma/landing-2026/highlight-reel.png";
import styles from "./show-you-section.module.css";

/**
 * The highlight-reel card (Figma 54:75; tablet 279:226, mobile 294:1154).
 *
 * Before it is played it shows the Figma photo under a dark overlay, a play
 * icon and its labels. With a fine pointer it grows slightly on hover and a
 * PLAY label follows the pointer around the card. Clicking (or pressing
 * Enter/Space) swaps in the reel itself, playing in place with the browser's
 * own controls and with sound: playback is started by the click, so audio is
 * allowed. From then on it is just a video; the hover effects stop. Under
 * reduced motion the card does not grow and no label follows the pointer.
 *
 * The encodes and poster come from the 4K master (see
 * design-assets/video-source/README.md): 1280px for phones, 1920px otherwise.
 */
export function ShowYouReel() {
  const cardRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const followRef = useRef(false);

  useEffect(() => {
    followRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    if (!video) return;
    video.focus();
    // The click that set `playing` is the user's activation, so this plays
    // with sound; if the browser still refuses, the controls are there.
    void video.play().catch(() => undefined);
  }, [playing]);

  /** Places the PLAY label at the pointer, in the card's own (unscaled) units. */
  const follow = (event: PointerEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    const label = followerRef.current;
    if (!followRef.current || !card || !label) return;
    const box = card.getBoundingClientRect();
    const scale = box.width > 0 ? card.offsetWidth / box.width : 1;
    const x = (event.clientX - box.left) * scale;
    const y = (event.clientY - box.top) * scale;
    label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    card.dataset.pointer = "inside";
  };

  const leave = () => {
    delete cardRef.current?.dataset.pointer;
  };

  return (
    <div
      ref={cardRef}
      data-playing={playing ? "" : undefined}
      className={cn(
        "relative isolate aspect-show-reel-portrait w-full overflow-hidden rounded-media bg-brand-obsidian md:aspect-show-reel",
        styles.reel,
      )}
    >
      {playing ? (
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          preload="auto"
          poster="/videos/young-muslims-highlight-reel-poster.webp"
          className="absolute inset-0 size-full bg-brand-obsidian object-contain"
          aria-label="Young Muslims highlight reel"
        >
          <source
            media="(max-width: 767px)"
            src="/videos/young-muslims-highlight-reel-mobile.mp4"
            type="video/mp4"
          />
          <source
            src="/videos/young-muslims-highlight-reel-desktop.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          onPointerMove={follow}
          onPointerEnter={follow}
          onPointerLeave={leave}
          aria-label="Play the Young Muslims highlight reel, with sound"
          className={cn(
            "absolute inset-0 size-full text-left text-brand-pure-white outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-inset",
            styles.playButton,
          )}
        >
          <Image
            src={highlightReel}
            alt="Young Muslims gathered together"
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 624px, 833px"
            className="object-cover"
          />
          <span aria-hidden className="absolute inset-0 bg-brand-obsidian/40" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="block xl:hidden">
              <MaterialIcon name="play_arrow" size={66} />
            </span>
            <span className="hidden xl:block">
              <MaterialIcon name="play_arrow" size={100} />
            </span>
          </span>
          <span className="absolute bottom-9 left-4.5 md:bottom-7.5 md:left-7.5 xl:bottom-10 xl:left-10">
            <span className="block text-xs font-extrabold xl:text-body">
              30 SECOND WATCH
            </span>
            <span className="mt-1.5 block text-landing-copy font-semibold md:text-lead xl:mt-1.75 xl:text-mobile-display">
              Young Muslims Highlight Reel
            </span>
          </span>
          <span
            ref={followerRef}
            aria-hidden
            className={cn(
              "text-nav font-extrabold text-brand-warm-snow",
              styles.follower,
            )}
          >
            PLAY
          </span>
        </button>
      )}
    </div>
  );
}
