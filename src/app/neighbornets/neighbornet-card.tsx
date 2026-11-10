import Image from "next/image";

import { branchLabel, type NeighborNetLocation } from "@/lib/neighbornets";
import { cn } from "@/lib/utils";

import coverBrothers from "../../../design-assets/figma/neighbornets/map/card/cover-brothers.svg";
import coverSisters from "../../../design-assets/figma/neighbornets/map/card/cover-sisters.svg";
import locationIcon from "../../../design-assets/figma/neighbornets/map/card/location.svg";
import watermarkBrothers from "../../../design-assets/figma/neighbornets/map/card/watermark-brothers.svg";
import watermarkSisters from "../../../design-assets/figma/neighbornets/map/card/watermark-sisters.svg";
import styles from "./neighbornet-card.module.css";

/** Each side's colours and art (Royal for Brothers, Jade for Sisters). */
const SIDE = {
  brothers: {
    cover: coverBrothers,
    coverFill: "bg-brand-royal",
    tag: "bg-brand-royal",
    chip: "border-brand-royal text-brand-royal",
    chipFill: styles.brothers,
    watermark: watermarkBrothers,
  },
  sisters: {
    cover: coverSisters,
    coverFill: "bg-sisters-brass",
    tag: "bg-brand-jade",
    chip: "border-brand-jade text-brand-jade",
    chipFill: styles.sisters,
    watermark: watermarkSisters,
  },
} as const;

/**
 * A NeighborNet's card (Figma 370:217 and 370:367; selected, 583:1011): its
 * cover, side tag, name and city, then its Instagram and email as chips.
 *
 * - Cover: a placeholder until nets have photos, the side's YOUNG MUSLIMS
 *   lockup on its colour (Brothers on Royal, Sisters on Sisters Brass, as
 *   Figma's Shadow Creek card). SWAPPABLE: give the card a photo here.
 * - Contacts: a chip only for what the net has; a net with neither says
 *   "No contact available" on a line a chip's height, so cards end level.
 *   In a row, cards stretch to the tallest (a long name can wrap): the
 *   header takes the extra, so the contacts line up along the bottom.
 * - `selected`: the 6px Obsidian border in a 6px Sisters Brass ring.
 * - `distance` (a search's nearest nets): after the city, "· 12 mi away".
 * - `onSelect` (a results card): the card selects its net when clicked
 *   anywhere but its links (its name is the button, for keyboards), and
 *   lifts on hover.
 * - Chips: on hover or focus the side colour rises to fill the chip as its
 *   text and icon turn Warm Snow and the label rolls (the standard button's
 *   hover, without the arrow).
 */
export function NeighborNetCard({
  net,
  selected = false,
  distance,
  onSelect,
  className,
}: {
  net: NeighborNetLocation;
  selected?: boolean;
  distance?: string;
  onSelect?: () => void;
  className?: string;
}) {
  const side = SIDE[net.branch];
  const instagram = net.contact?.instagram;
  const email = net.contact?.email;
  return (
    <article
      aria-label={`${net.name}, ${branchLabel[net.branch]}`}
      onClick={
        onSelect &&
        ((event) => {
          if (!(event.target as Element).closest("a")) onSelect();
        })
      }
      className={cn(
        "relative flex w-72 flex-col overflow-clip bg-brand-pure-white text-brand-obsidian md:w-82",
        selected && "border-6 border-brand-obsidian ring-6 ring-sisters-brass",
        onSelect && cn("cursor-pointer", styles.lift),
        className,
      )}
    >
      <Image
        src={side.watermark}
        alt=""
        className="pointer-events-none absolute top-25 right-0 size-41.75"
      />
      <div
        className={cn("flex h-25 items-center justify-center", side.coverFill)}
      >
        <Image src={side.cover} alt="" className="h-6 w-auto" />
      </div>
      <div className="relative flex flex-1 flex-col items-start gap-2 px-6 py-4">
        <span
          className={cn(
            "px-1.5 py-1 text-article-meta font-semibold text-brand-pure-white",
            side.tag,
          )}
        >
          {branchLabel[net.branch]}
        </span>
        <h3 className="text-article-title font-bold">
          {onSelect ? (
            <button
              type="button"
              aria-label={`Show ${net.name} on the map`}
              className="text-left outline-none focus-visible:underline"
            >
              {net.name}
            </button>
          ) : (
            net.name
          )}
        </h3>
        {(net.city || distance) && (
          <p className="flex items-center gap-1 text-article-meta font-semibold">
            <Image src={locationIcon} alt="" className="size-4 shrink-0" />
            {[net.city, distance].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <div className="relative h-px bg-muted" />
      <div className="relative flex gap-2 px-6 py-4">
        {instagram || email ? (
          <>
            {instagram && (
              <Chip
                href={`https://www.instagram.com/${instagram.replace(/^@/, "")}/`}
                icon={styles.instagram}
                label={`${net.name} on Instagram`}
                className={cn(
                  side.chip,
                  side.chipFill,
                  email ? "shrink-0" : "min-w-0",
                )}
              >
                {instagram.replace(/^@/, "")}
              </Chip>
            )}
            {email && (
              <Chip
                href={`mailto:${email}`}
                icon={styles.mail}
                label={`Email ${net.name}`}
                className={cn(side.chip, side.chipFill, "min-w-0 flex-1")}
              >
                {email}
              </Chip>
            )}
          </>
        ) : (
          // The same height as a chip, so every card ends level.
          <p className="flex h-6.5 items-center text-article-meta font-semibold text-caption">
            No contact available
          </p>
        )}
      </div>
    </article>
  );
}

function Chip({
  href,
  icon,
  label,
  className,
  children,
}: {
  href: string;
  /** The icon's mask class. */
  icon: string;
  label: string;
  className: string;
  children: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "ym-cta-trigger flex items-center gap-1 border bg-brand-pure-white px-1.5 py-1 text-article-meta font-semibold outline-none",
        styles.chip,
        className,
      )}
    >
      <span aria-hidden className={cn("size-4 shrink-0", styles.icon, icon)} />
      <span className="ym-cta-roll min-w-0">
        <span className="ym-cta-roll__text" data-text={children}>
          <span className="block truncate">{children}</span>
        </span>
      </span>
    </a>
  );
}
