const portraits = Array.from({ length: 6 }, (_, index) => index);

function PortraitRow({ reverse }: { reverse: boolean }) {
  return (
    <div className="overflow-hidden">
      <div
        data-leadership-track
        data-direction={reverse ? "right" : "left"}
        className={`nn-image-marquee-track nn-explainer-marquee-track flex w-max motion-reduce:w-full ${reverse ? "support-donation-track" : ""}`}
      >
        {/* Four identical groups match the existing marquee's 25% loop. */}
        {Array.from({ length: 4 }, (_, group) => (
          <ul
            key={group}
            aria-hidden={group > 0 ? true : undefined}
            aria-label={
              group === 0
                ? `Leadership portrait placeholders, row ${reverse ? 2 : 1}`
                : undefined
            }
            className={`flex shrink-0 gap-6 pr-6 md:gap-8 md:pr-8 ${group > 0 ? "motion-reduce:hidden" : "motion-reduce:grid motion-reduce:w-full motion-reduce:grid-cols-2 motion-reduce:px-8 md:motion-reduce:grid-cols-6"}`}
          >
            {portraits.map((index) => (
              <li
                key={index}
                className="w-48 shrink-0 motion-reduce:w-full md:w-56"
              >
                <div
                  className={`flex aspect-square items-end justify-center overflow-hidden rounded-media ${reverse ? "bg-muted text-accent" : "bg-muted text-secondary"}`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 160"
                    className="h-full w-full"
                    fill="currentColor"
                  >
                    <circle cx="80" cy="60" r="28" />
                    <path d="M20 160v-12a60 48 0 0 1 120 0v12Z" />
                  </svg>
                </div>
                <p className="mt-4 text-body font-semibold">
                  Leader {String(index + (reverse ? 7 : 1)).padStart(2, "0")}
                </p>
                <p className="mt-2 text-nav text-muted-foreground">
                  Profile coming soon
                </p>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function LeadershipSection() {
  return (
    <section
      aria-labelledby="leadership-heading"
      className="overflow-hidden bg-background py-20"
      data-header-theme="light"
    >
      <div className="mx-auto max-w-3xl px-8 text-center">
        <p className="text-nav font-bold text-secondary">Our leadership</p>
        <h2
          id="leadership-heading"
          className="mt-6 text-mobile-section font-extrabold md:text-section"
        >
          Led by youth.
          <br />
          Built on care.
        </h2>
        <p className="mt-4 text-nav text-muted-foreground">
          Meet the team soon. Portraits shown are placeholders.
        </p>
      </div>
      <div className="mt-8 space-y-8">
        <PortraitRow reverse={false} />
        <PortraitRow reverse />
      </div>
    </section>
  );
}
