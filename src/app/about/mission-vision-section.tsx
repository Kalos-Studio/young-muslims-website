import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";

/* YM's official mission and vision, verbatim. */
const ROWS = [
  {
    id: "mission-heading",
    label: "Our mission",
    text: "Young Muslims seeks the pleasure of Allah (SWT) by empowering Muslim youth through companionship, mentorship, education, and service.",
    cta: { label: "Support us", href: "/support" },
  },
  {
    id: "vision-heading",
    label: "Our vision",
    text: "American Muslim youth, collectively contributing to the betterment of society — with God-consciousness and a firm understanding of their Muslim identity.",
    cta: { label: "Our stories", href: "/stories" },
  },
] as const;

/**
 * The About page's mission and vision, under "A generation to believe in"
 * (Figma 507:402, tablet 595:1977, mobile 596:2646; DESIGN-SYSTEM.md,
 * "About mission and vision"). Warm Snow; two rows, each its label on the
 * left and the statement with its button on the right (two equal columns
 * 32 apart from tablet; stacked, 32 apart, on phones), revealed by
 * TextReveal, the button whole (the site's StandardButton).
 *
 * Content caps at 1440 (inset 136 on desktop, so the columns are Figma's
 * 568). The next section's pale background shape rises into the foot of
 * this one, so it does not clip and keeps Figma's space at its foot.
 */
export function MissionVisionSection() {
  return (
    <section
      aria-label="Our mission and vision"
      className="bg-brand-warm-snow text-brand-obsidian"
    >
      <div className="mx-auto flex max-w-360 flex-col gap-20 px-8 pt-11.5 pb-25.75 md:gap-30.75 md:px-16 md:pt-22.75 md:pb-22.75 xl:gap-33.25 xl:px-34 xl:pb-32">
        {ROWS.map((row) => (
          <TextReveal
            key={row.id}
            className="grid items-start gap-8 md:grid-cols-2"
          >
            <h2
              id={row.id}
              className="text-lead font-bold md:text-card-title xl:text-mobile-display"
            >
              {row.label}
            </h2>
            <div>
              <p className="text-body font-medium md:text-article-title xl:text-landing-copy">
                {row.text}
              </p>
              <StandardButton
                href={row.cta.href}
                label={row.cta.label}
                {...textRevealUnit}
                className="mt-8"
              />
            </div>
          </TextReveal>
        ))}
      </div>
    </section>
  );
}
