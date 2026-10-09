"use client";

import { AtSign, Mail, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { branchLabel, type NeighborNetLocation } from "@/lib/neighbornets";
import { branchColor } from "./net-marker";
import type { Palette } from "./map-options";

/**
 * The neighbornet-specific information surface. One component drives the hover
 * tooltip, the on-map popup, and the side panel so the three reveal modes can
 * be compared without the content drifting between them.
 */

type Density = "peek" | "compact" | "full";

export function NetDetails({
  net,
  palette,
  density,
  onClose,
  className,
}: {
  net: NeighborNetLocation;
  palette: Palette;
  /**
   * `peek` is a one-line hover teaser, `compact` fits an on-map popup, `full`
   * is the side panel with every contact method.
   */
  density: Density;
  onClose?: () => void;
  className?: string;
}) {
  const color = branchColor(net.branch, palette);
  const branchStyles =
    net.branch === "brothers"
      ? {
          accent: "bg-brothers-sky",
          label: "text-brothers-midnight",
        }
      : {
          accent: "bg-sisters-buttercup",
          label: "text-sisters-forest",
        };

  if (density === "peek") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-card border border-border bg-popover px-4 py-2 text-xs text-popover-foreground",
          className,
        )}
      >
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium">{net.name}</span>
        <span className="text-muted-foreground">{placeLabel(net)}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-brand-pure-white text-brand-obsidian",
        density === "compact" ? "w-80" : null,
        className,
      )}
    >
      {density === "compact" ? (
        <div aria-hidden="true" className={cn("h-2", branchStyles.accent)} />
      ) : null}

      <div className={density === "compact" ? "p-6" : "p-4"}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {density === "compact" ? (
              <>
                <p className={cn("text-nav font-bold", branchStyles.label)}>
                  {branchLabel[net.branch]} NeighborNet
                </p>
                <h3 className="mt-2 text-card-title font-semibold">
                  {net.name}
                </h3>
                <p className="mt-2 text-body text-muted-foreground">
                  {placeLabel(net)}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h3 className="text-base font-semibold">{net.name}</h3>
              </div>
            )}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="-m-1 rounded-sm p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {density === "full" ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip style={{ borderColor: color, color }}>
              {branchLabel[net.branch]}
            </Chip>
            {net.size !== undefined ? (
              <Chip className="border-border text-muted-foreground">
                ~{net.size} regulars
              </Chip>
            ) : null}
          </div>
        ) : null}

        <dl className="mt-6 space-y-4 border-t border-border pt-6 text-body">
          <Row label="Region">{net.region}</Row>
          {net.meeting ? <Row label="Meets">{net.meeting.cadence}</Row> : null}
          {density === "full" && net.meeting ? (
            <Row label="Where">{net.meeting.venue}</Row>
          ) : null}
          {net.contact ? (
            <Row label="Contact">
              {net.contact.name}
              <span className="text-muted-foreground">
                , {net.contact.role}
              </span>
            </Row>
          ) : null}
        </dl>

        {net.contact ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {net.contact.email ? (
              <ContactLink href={`mailto:${net.contact.email}`} icon={Mail}>
                Email
              </ContactLink>
            ) : null}
            {net.contact.phone ? (
              <ContactLink
                href={`tel:${net.contact.phone.replace(/[^\d+]/g, "")}`}
                icon={Phone}
              >
                {density === "full" ? net.contact.phone : "Call"}
              </ContactLink>
            ) : null}
            {net.contact.instagram ? (
              <ContactLink
                href={`https://instagram.com/${net.contact.instagram.replace("@", "")}`}
                icon={AtSign}
              >
                {net.contact.instagram}
              </ContactLink>
            ) : null}
          </div>
        ) : null}

        {density === "full" && net.notes ? (
          <p className="mt-6 border-t border-border pt-6 text-body text-muted-foreground">
            {net.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function placeLabel(net: NeighborNetLocation): string {
  if (!net.city) return net.region;
  return net.state ? `${net.city}, ${net.state}` : net.city;
}

function Chip({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-xs leading-4 font-medium",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 shrink-0 text-nav font-bold text-brand-obsidian">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-muted-foreground">{children}</dd>
    </div>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: React.AriaAttributes["aria-hidden"];
  }>;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-pill border border-brand-royal px-4 py-2 text-nav font-bold text-brand-royal transition-colors outline-none hover:bg-brand-royal hover:text-brand-pure-white focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-pure-white"
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </a>
  );
}
