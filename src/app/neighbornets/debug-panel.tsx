"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { branchLabel } from "@/lib/neighbornets";
import {
  basemapOptions,
  defaultSettings,
  differentiatorOptions,
  infoModeOptions,
  markerStyleOptions,
  palettes,
  sizeModeOptions,
  type MapSettings,
  type Palette,
} from "./map-options";

/**
 * Throwaway control surface for comparing map treatments. It is deliberately
 * plain: this is a workbench, not a shipped UI. Nothing here should outlive the
 * decision about how brothers' and sisters' nets get distinguished.
 */
export function DebugPanel({
  settings,
  onChange,
  counts,
}: {
  settings: MapSettings;
  onChange: (next: MapSettings) => void;
  counts: { brothers: number; sisters: number; shown: number };
}) {
  const [open, setOpen] = useState(true);

  function set<K extends keyof MapSettings>(key: K, value: MapSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-accent lg:cursor-default lg:hover:bg-transparent"
      >
        <SlidersHorizontal className="size-4 shrink-0" />
        <span className="flex-1 text-sm font-semibold">Debug controls</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform lg:hidden",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-3 pb-3",
          open ? "block" : "hidden lg:block",
        )}
      >
        <p className="mb-3 text-xs text-muted-foreground">
          Showing {counts.shown} of {counts.brothers + counts.sisters}{" "}
          neighbornets ({counts.brothers} brothers, {counts.sisters} sisters).
        </p>

        <Section label="Branch filter">
          <SegmentedControl
            value={settings.branchFilter}
            onChange={(v) => set("branchFilter", v)}
            options={[
              { value: "all" as const, label: "All" },
              { value: "brothers" as const, label: branchLabel.brothers },
              { value: "sisters" as const, label: branchLabel.sisters },
            ]}
          />
        </Section>

        <Section label="Basemap">
          <RadioList
            value={settings.basemap}
            onChange={(v) => set("basemap", v)}
            options={basemapOptions}
          />
          <Toggle
            checked={settings.showStateOutlines}
            onChange={(v) => set("showStateOutlines", v)}
            label="State outlines"
            note="Overlay state polygons on top of whichever basemap is active."
          />
        </Section>

        <Section label="Marker style">
          <RadioList
            value={settings.markerStyle}
            onChange={(v) => set("markerStyle", v)}
            options={markerStyleOptions}
          />
        </Section>

        <Section label="Brothers vs. sisters">
          <RadioList
            value={settings.differentiator}
            onChange={(v) => set("differentiator", v)}
            options={differentiatorOptions}
          />
        </Section>

        <Section label="Palette">
          <div className="space-y-1">
            {(Object.keys(palettes) as Palette[]).map((key) => {
              const p = palettes[key];
              const active = settings.palette === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("palette", key)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-md border px-2 py-1.5 text-left",
                    active
                      ? "border-foreground/40 bg-accent"
                      : "border-border hover:bg-accent/50",
                  )}
                >
                  <span className="mt-0.5 flex shrink-0 gap-1">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: p.brothers }}
                    />
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: p.sisters }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium">{p.label}</span>
                    <span className="block text-[11px] leading-4 text-muted-foreground">
                      {p.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Dot size">
          <RadioList
            value={settings.sizeMode}
            onChange={(v) => set("sizeMode", v)}
            options={sizeModeOptions}
          />
        </Section>

        <Section label="Info reveal">
          <RadioList
            value={settings.infoMode}
            onChange={(v) => set("infoMode", v)}
            options={infoModeOptions}
          />
        </Section>

        <Section label="Extras">
          <Toggle
            checked={settings.showLabels}
            onChange={(v) => set("showLabels", v)}
            label="Always-on name labels"
            note="Gets crowded fast where a city has both a brothers' and sisters' net."
          />
          <Toggle
            checked={settings.pairOffset}
            onChange={(v) => set("pairOffset", v)}
            label="Spread same-city pairs"
            note="Most cities run both a brothers' and a sisters' net at the same address. Off, they stack and one disappears."
          />
          <Toggle
            checked={settings.cluster}
            onChange={(v) => set("cluster", v)}
            label="Cluster overlapping nets"
            note="Clean at national zoom, but the two branch layers stack, so one branch hides the other where they share a city."
          />
          <Toggle
            checked={settings.dimInactive}
            onChange={(v) => set("dimInactive", v)}
            label="Dim forming / paused nets"
            note="Pushes active nets forward visually."
          />
        </Section>

        <button
          type="button"
          onClick={() => onChange(defaultSettings)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-accent"
        >
          <RotateCcw className="size-3" />
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-3 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <legend className="sr-only">{label}</legend>
      <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
        {label}
      </p>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function RadioList<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; note: string }[];
}) {
  return (
    <div className="space-y-1">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "block w-full rounded-md border px-2 py-1.5 text-left",
              active
                ? "border-foreground/40 bg-accent"
                : "border-border hover:bg-accent/50",
            )}
          >
            <span className="block text-xs font-medium">{option.label}</span>
            <span className="block text-[11px] leading-4 text-muted-foreground">
              {option.note}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid grid-flow-col rounded-md border border-border p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium",
            value === option.value
              ? "bg-foreground text-background"
              : "hover:bg-accent",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  note,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  note: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-3.5 shrink-0 accent-foreground"
      />
      <span className="min-w-0">
        <span className="block text-xs font-medium">{label}</span>
        <span className="block text-[11px] leading-4 text-muted-foreground">
          {note}
        </span>
      </span>
    </label>
  );
}
