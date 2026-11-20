import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import { PartnersMarquee } from "../about/partners-marquee";
import styles from "./why-it-matters.module.css";

export type Supporter = { place: string; amount: string };

/*
 * PLACEHOLDER: Figma's sample entries (446:1860), not real gifts. Nothing
 * here is live. Swap this for real data (Fundraise Up's REST API, read on
 * the server with a secret key: a recent donation's amount and the donor's
 * region) by passing `supporters` to SupporterFeed; the row takes any
 * number of entries.
 */
const SAMPLE_SUPPORTERS: Supporter[] = [
  { place: "Texas", amount: "$40" },
  { place: "New Jersey", amount: "$17" },
  { place: "Illinois", amount: "$125" },
  { place: "California", amount: "$700" },
  { place: "Georgia", amount: "$60" },
  { place: "New York", amount: "$225" },
  { place: "Texas", amount: "$10" },
];

/**
 * The supporters row under the "Why it matters" photo (Figma 446:1860):
 * each supporter's avatar and "Anonymous from <state>", over the amount
 * (Boldonse) and an outward arrow, Jade and Royal in turn. A full-bleed
 * row that loops on its own, whatever the page's scroll (the About
 * partners' marquee: a CSS animation, paused off screen, resting under
 * reduced motion; composited, transform only).
 *
 * One copy of the row is the entries, repeated to an even count so the
 * colours alternate across the loop's seam too; the track holds two
 * copies. Only the first run of entries is read out.
 */
export function SupporterFeed({
  supporters = SAMPLE_SUPPORTERS,
  className,
}: {
  supporters?: Supporter[];
  className?: string;
}) {
  const row =
    supporters.length % 2 ? [...supporters, ...supporters] : supporters;
  return (
    <PartnersMarquee
      label="Supporters (sample entries)"
      className={className}
      trackClassName={styles.track}
    >
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy > 0 || undefined}
          className="flex shrink-0 gap-5 pr-5"
        >
          {row.map((supporter, index) => (
            <li
              key={index}
              aria-hidden={
                (copy === 0 && index >= supporters.length) || undefined
              }
              className="flex shrink-0 flex-col gap-2 p-2.5"
            >
              <p className="flex items-center gap-2 text-article-meta font-medium">
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-pill bg-brothers-slate text-brand-warm-snow"
                >
                  <MaterialIcon name="person" />
                </span>
                <span>
                  Anonymous from{" "}
                  <strong className="font-bold">{supporter.place}</strong>
                </span>
              </p>
              <p
                className={cn(
                  "flex items-center gap-1 font-display text-tablet-display",
                  index % 2 ? "text-brand-royal" : "text-brand-jade",
                )}
              >
                {supporter.amount}
                <MaterialIcon aria-hidden name="arrow_outward" size={88} />
              </p>
            </li>
          ))}
        </ul>
      ))}
    </PartnersMarquee>
  );
}
