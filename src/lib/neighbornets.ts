/**
 * A NeighborNet is a local Young Muslims circle, the equivalent of a chapter.
 * Brothers and sisters run separate NeighborNets, so every record is tagged
 * with the branch it belongs to and the map makes that difference readable at
 * a glance (Royal for Brothers, Jade for Sisters).
 *
 * The records are generated from data/*.csv by
 * scripts/generate-neighbornets.mjs (src/generated/*-neighbornets.ts).
 */
export type Branch = "brothers" | "sisters";

/**
 * Lifecycle of a NeighborNet. `forming` nets are not meeting on a fixed
 * schedule yet, `paused` ones are dormant but still have a point of contact.
 */
export type NeighborNetStatus = "active" | "forming" | "paused";

export type NeighborNetContact = {
  /** Who a newcomer reaches out to first. */
  name: string;
  role: string;
  email?: string;
  instagram?: string;
};

export type NeighborNetLocation = {
  id: string;
  name: string;
  branch: Branch;
  status: NeighborNetStatus;
  /**
   * The city, town or (in New York City) borough at the net's coordinates,
   * reverse-geocoded once (data/neighbornet-places.csv).
   */
  city?: string;
  /** Two-letter USPS state code (a province code outside the US). */
  state?: string;
  /** The ZIP code at the net's coordinates. */
  postalCode?: string;
  /** ISO country code; present only outside the US. */
  country?: string;
  /**
   * The national team's regional grouping. Inconsistent between the lists (a
   * metro for Brothers, a state for Sisters), so the map never filters by it.
   */
  region: string;
  longitude: number;
  latitude: number;
  contact?: NeighborNetContact;
};

export const branchLabel: Record<Branch, string> = {
  brothers: "Brothers",
  sisters: "Sisters",
};
