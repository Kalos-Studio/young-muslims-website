export function HeroVideo() {
  return (
    <section
      data-header-theme="dark"
      aria-label="Young Muslims community introduction"
      className="relative flex h-[808px] w-full items-center justify-center overflow-hidden bg-brothers-midnight px-8 text-center text-brand-warm-snow md:h-[1007px] md:min-h-[760px] md:px-6"
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

      <div className="relative z-10 flex w-full max-w-[983px] flex-col items-center gap-[11px] md:gap-4">
        <h1 className="font-display text-[32px] leading-normal font-normal tracking-[-0.02em] md:text-landing-display md:whitespace-nowrap">
          FOR THE YOUTH. BY THE YOUTH.
        </h1>
        <p className="w-full max-w-[893px] text-sm leading-normal font-semibold tracking-[-0.02em] md:text-landing-hero-subtitle md:whitespace-nowrap">
          A nationwide brotherhood and sisterhood, built on real friendships and
          a shared Deen.
        </p>
      </div>

      <svg
        aria-hidden="true"
        className="absolute right-0 bottom-[-1px] left-0 z-20 h-[104px] w-full text-brand-warm-snow"
        viewBox="0 0 1440 104"
        preserveAspectRatio="none"
      >
        <path
          d="M0 52C240 104 480 104 720 52S1200 0 1440 52V104H0Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
