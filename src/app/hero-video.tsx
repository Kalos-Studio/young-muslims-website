import heroTransitionPale from "../../design-assets/figma/landing-2026/hero-transition-pale.svg";

export function HeroVideo() {
  return (
    <section
      data-header-theme="dark"
      aria-label="Young Muslims community introduction"
      className="relative z-[1] flex h-[808px] w-full items-center justify-center bg-brand-warm-snow px-8 text-center text-brand-warm-snow md:h-[1007px] md:min-h-[760px] md:px-6"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1440 1007"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="hero-video-clip" clipPathUnits="objectBoundingBox">
            <path
              d="M2639.5618 1168.8439C2620.2015 1995.6266 1809.854 1507.5787 1267.626 1785.03C531.0985 2162.2078 -3.0511 1921.6673 0.0131 1261.8847C19.9306 -450.5971 2666.0255 -359.6454 2639.5618 1168.8439Z"
              transform="matrix(0.0006806665 0.0001968309 -0.0001376449 0.0009733464 -0.0849268595 -0.9661111235)"
            />
          </clipPath>
        </defs>
        <image
          href={heroTransitionPale.src}
          width="3252.18310546875"
          height="2419.48486328125"
          transform="matrix(0.9801598191 0.1982086748 -0.1982086748 0.9801598191 -377.2775878906 -1309.5624389648)"
        />
      </svg>

      <div
        className="absolute inset-0 z-10 overflow-hidden bg-brothers-midnight"
        style={{
          clipPath: "url(#hero-video-clip)",
          WebkitClipPath: "url(#hero-video-clip)",
        }}
      >
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/videos/ym-website-hero-dark-overlay.mp4"
            type="video/mp4"
          />
          Your browser does not support background video.
        </video>
        <div aria-hidden className="absolute inset-0 bg-brand-obsidian/10" />
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[-96px] left-0 z-[5] h-[192px] w-full md:bottom-[-120px] md:h-[240px]"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
      >
        <image
          href={heroTransitionPale.src}
          width="3252.18310546875"
          height="2419.48486328125"
          transform="matrix(0.9801598191 0.1982086748 -0.1982086748 0.9801598191 -377.2775878906 -2316.5624389648)"
        />
      </svg>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[-1px] left-0 z-[15] h-[104px] w-full text-brand-warm-snow md:h-[132px]"
        viewBox="0 0 1440 104"
        preserveAspectRatio="none"
      >
        <path
          d="M0 52C240 104 480 104 720 52S1200 0 1440 52V104H0Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-20 flex w-full max-w-[983px] translate-y-[60px] flex-col items-center gap-[11px] md:translate-y-0 md:gap-4">
        <h1 className="font-display text-[32px] leading-normal font-normal tracking-[-0.02em] md:text-landing-display md:whitespace-nowrap">
          FOR THE YOUTH. BY THE YOUTH.
        </h1>
        <p className="w-full max-w-[893px] text-sm leading-normal font-semibold tracking-[-0.02em] md:text-landing-hero-subtitle md:whitespace-nowrap">
          A nationwide brotherhood and sisterhood, built on real friendships and
          a shared Deen.
        </p>
      </div>
    </section>
  );
}
