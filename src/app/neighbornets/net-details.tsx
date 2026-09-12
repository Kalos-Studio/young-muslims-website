"use client";

import { AtSign, Mail, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { branchLabel, type NeighborNet } from "@/lib/neighbornets";
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
  net: NeighborNet;
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

  if (density === "peek") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md",
          className,
        )}
      >
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium">{net.name}</span>
        <span className="text-muted-foreground">
          {net.city}, {net.state}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
        density === "compact" ? "w-64 p-3" : "p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h3
              className={cn(
                "truncate font-semibold",
                density === "full" ? "text-base" : "text-sm",
              )}
            >
              {net.name}
            </h3>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="-m-1 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip style={{ borderColor: color, color }}>
          {branchLabel[net.branch]}
        </Chip>
        {density === "full" ? (
          <Chip className="border-border text-muted-foreground">
            ~{net.size} regulars
          </Chip>
        ) : null}
      </div>

      <dl className="mt-3 space-y-1.5 text-xs">
        <Row label="Meets">{net.meeting.cadence}</Row>
        {density === "full" ? (
          <Row label="Where">{net.meeting.venue}</Row>
        ) : null}
        <Row label="Contact">
          {net.contact.name}
          <span className="text-muted-foreground">, {net.contact.role}</span>
        </Row>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
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

      {density === "full" && net.notes ? (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {net.notes}
        </p>
      ) : null}
    </div>
  );
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
        "rounded-full border px-2 py-0.5 text-[11px] leading-4 font-medium",
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
    <div className="flex gap-2">
      <dt className="w-14 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:bg-accent"
    >
      <Icon className="size-3" />
      {children}
    </a>
  );
}
