export function HeroVideo() {
  return (
    <section
      data-header-theme="dark"
      aria-label="Young Muslims community introduction"
      className="relative flex h-[100svh] min-h-[760px] w-full items-center justify-center overflow-hidden bg-brothers-midnight px-6 text-center text-brand-warm-snow"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(74,144,217,0.42),transparent_34%),radial-gradient(circle_at_72%_68%,rgba(57,116,81,0.48),transparent_38%),linear-gradient(135deg,#16294f,#171725_68%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-obsidian/35" />

      <p className="absolute top-36 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap text-brand-warm-snow/60">
        Full-bleed community video placeholder
      </p>

      <div className="relative z-10 flex w-full max-w-[983px] flex-col items-center gap-4">
        <h1 className="font-display text-display font-normal md:whitespace-nowrap">
          FOR THE YOUTH. BY THE YOUTH.
        </h1>
        <p className="w-full max-w-[893px] text-lead font-semibold md:whitespace-nowrap">
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
