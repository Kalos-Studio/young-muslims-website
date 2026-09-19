import type { FeatureCollection, Point } from "geojson";

/**
 * A neighbornet is a local Young Muslims circle, the equivalent of a chapter.
 * Brothers and sisters run separate neighbornets, so every record is tagged
 * with the branch it belongs to and the map has to make that difference
 * readable at a glance.
 */
export type Branch = "brothers" | "sisters";

/**
 * Lifecycle of a neighbornet. `forming` nets are not meeting on a fixed
 * schedule yet, `paused` ones are dormant but still have a point of contact.
 */
export type NeighborNetStatus = "active" | "forming" | "paused";

export type NeighborNetContact = {
  /** Person a newcomer should reach out to first. */
  name: string;
  role: string;
  email?: string;
  phone?: string;
  instagram?: string;
  whatsapp?: string;
};

export type NeighborNetMeeting = {
  /** Human-readable cadence, e.g. "Fridays after Maghrib". */
  cadence: string;
  /** Where the net gathers. Intentionally vague for nets that rotate homes. */
  venue: string;
};

export type NeighborNet = {
  id: string;
  name: string;
  branch: Branch;
  status: NeighborNetStatus;
  city: string;
  /** Two-letter USPS state code. */
  state: string;
  /** Regional grouping used by the national team. */
  region: string;
  longitude: number;
  latitude: number;
  /** Rough headcount of regular attendees. Used for size-scaled dot styles. */
  size: number;
  /** Ages the net is aimed at, e.g. "High school". */
  ageGroup: string;
  contact: NeighborNetContact;
  meeting: NeighborNetMeeting;
  notes?: string;
};

/**
 * Seed data for the map prototype.
 *
 * Every name, contact, and meeting time below is PLACEHOLDER content invented
 * for layout testing. The coordinates are real city centers, nothing else is.
 * Replace this array (or swap it for a fetch) once the real neighbornet roster
 * exists. Contact emails use `example.org` on purpose so nothing here can be
 * mistaken for a live address.
 */
export const neighborNets: NeighborNet[] = [
  {
    id: "nn-brooklyn-b",
    name: "Valley Stream Brothers",
    branch: "brothers",
    status: "active",
    city: "Valley Stream",
    state: "NY",
    region: "Northeast",
    longitude: -73.7085,
    latitude: 40.6643,
    size: 34,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "brooklyn-brothers@example.org",
      phone: "(555) 010-0101",
      instagram: "@placeholder_ym",
    },
    meeting: {
      cadence: "Fridays after Maghrib",
      venue: "Community masjid, second floor",
    },
    notes: "Largest net in the region; splits into two halaqa circles.",
  },
  {
    id: "nn-brooklyn-s",
    name: "Valley Stream Sisters",
    branch: "sisters",
    status: "active",
    city: "Valley Stream",
    state: "NY",
    region: "Northeast",
    longitude: -73.7085,
    latitude: 40.6643,
    size: 28,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "brooklyn-sisters@example.org",
      instagram: "@placeholder_ym",
    },
    meeting: {
      cadence: "Saturdays, 4:00 PM",
      venue: "Rotating homes",
    },
  },
  {
    id: "nn-paterson-b",
    name: "Clifton Brothers",
    branch: "brothers",
    status: "active",
    city: "Clifton",
    state: "NJ",
    region: "Northeast",
    longitude: -74.1638,
    latitude: 40.8584,
    size: 22,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "paterson-brothers@example.org",
      whatsapp: "+1-555-010-0102",
    },
    meeting: { cadence: "Sundays, 6:00 PM", venue: "Islamic center annex" },
  },
  {
    id: "nn-paterson-s",
    name: "Clifton Sisters",
    branch: "sisters",
    status: "active",
    city: "Clifton",
    state: "NJ",
    region: "Northeast",
    longitude: -74.1638,
    latitude: 40.8584,
    size: 19,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "paterson-sisters@example.org",
    },
    meeting: { cadence: "Sundays, 3:00 PM", venue: "Islamic center annex" },
  },
  {
    id: "nn-philly-b",
    name: "Upper Darby Brothers",
    branch: "brothers",
    status: "active",
    city: "Upper Darby",
    state: "PA",
    region: "Northeast",
    longitude: -75.2591,
    latitude: 39.949,
    size: 17,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "philly-brothers@example.org",
    },
    meeting: { cadence: "Wednesdays, 7:30 PM", venue: "Campus prayer room" },
  },
  {
    id: "nn-philly-s",
    name: "Upper Darby Sisters",
    branch: "sisters",
    status: "forming",
    city: "Upper Darby",
    state: "PA",
    region: "Northeast",
    longitude: -75.2591,
    latitude: 39.949,
    size: 8,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Regional coordinator",
      email: "philly-sisters@example.org",
    },
    meeting: { cadence: "Forming, reach out to be added", venue: "TBD" },
    notes: "Needs a consistent host before it can be listed as active.",
  },
  {
    id: "nn-dc-b",
    name: "Sterling Brothers",
    branch: "brothers",
    status: "active",
    city: "Sterling",
    state: "VA",
    region: "Mid-Atlantic",
    longitude: -77.4286,
    latitude: 39.0062,
    size: 26,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "dc-brothers@example.org",
      phone: "(555) 010-0103",
    },
    meeting: { cadence: "Fridays, 8:00 PM", venue: "Masjid basement hall" },
  },
  {
    id: "nn-dc-s",
    name: "Sterling Sisters",
    branch: "sisters",
    status: "active",
    city: "Sterling",
    state: "VA",
    region: "Mid-Atlantic",
    longitude: -77.4286,
    latitude: 39.0062,
    size: 24,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "dc-sisters@example.org",
      instagram: "@placeholder_ym",
    },
    meeting: { cadence: "Saturdays, 5:00 PM", venue: "Masjid classroom B" },
  },
  {
    id: "nn-atlanta-b",
    name: "North Atlanta Brothers",
    branch: "brothers",
    status: "active",
    city: "North Atlanta",
    state: "GA",
    region: "Southeast",
    longitude: -84.3366,
    latitude: 33.8651,
    size: 15,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "atlanta-brothers@example.org",
    },
    meeting: { cadence: "Saturdays, 6:30 PM", venue: "Rotating homes" },
  },
  {
    id: "nn-atlanta-s",
    name: "North Atlanta Sisters",
    branch: "sisters",
    status: "active",
    city: "North Atlanta",
    state: "GA",
    region: "Southeast",
    longitude: -84.3366,
    latitude: 33.8651,
    size: 13,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "atlanta-sisters@example.org",
    },
    meeting: { cadence: "Saturdays, 2:00 PM", venue: "Rotating homes" },
  },
  {
    id: "nn-orlando-b",
    name: "Tampa Brothers",
    branch: "brothers",
    status: "paused",
    city: "Tampa",
    state: "FL",
    region: "Southeast",
    longitude: -82.4572,
    latitude: 27.9506,
    size: 6,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Regional coordinator",
      email: "orlando@example.org",
    },
    meeting: { cadence: "Paused for the summer", venue: "TBD" },
    notes: "Lead moved out of state; looking for a replacement.",
  },
  {
    id: "nn-chicago-b",
    name: "Niles Brothers",
    branch: "brothers",
    status: "active",
    city: "Niles",
    state: "IL",
    region: "Midwest",
    longitude: -87.8028,
    latitude: 42.0189,
    size: 31,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "chicago-brothers@example.org",
      whatsapp: "+1-555-010-0104",
    },
    meeting: { cadence: "Fridays after Isha", venue: "Southside masjid" },
  },
  {
    id: "nn-chicago-s",
    name: "Niles Sisters",
    branch: "sisters",
    status: "active",
    city: "Niles",
    state: "IL",
    region: "Midwest",
    longitude: -87.8028,
    latitude: 42.0189,
    size: 27,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "chicago-sisters@example.org",
    },
    meeting: { cadence: "Sundays, 1:00 PM", venue: "Southside masjid" },
  },
  {
    id: "nn-detroit-b",
    name: "Dearborn Brothers",
    branch: "brothers",
    status: "active",
    city: "Dearborn",
    state: "MI",
    region: "Midwest",
    longitude: -83.1763,
    latitude: 42.3223,
    size: 20,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "dearborn-brothers@example.org",
    },
    meeting: { cadence: "Thursdays, 7:00 PM", venue: "Youth center" },
  },
  {
    id: "nn-detroit-s",
    name: "Dearborn Sisters",
    branch: "sisters",
    status: "active",
    city: "Dearborn",
    state: "MI",
    region: "Midwest",
    longitude: -83.1763,
    latitude: 42.3223,
    size: 18,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "dearborn-sisters@example.org",
      instagram: "@placeholder_ym",
    },
    meeting: { cadence: "Thursdays, 5:00 PM", venue: "Youth center" },
  },
  {
    id: "nn-minneapolis-s",
    name: "Bloomington Sisters",
    branch: "sisters",
    status: "active",
    city: "Bloomington",
    state: "MN",
    region: "Midwest",
    longitude: -93.2983,
    latitude: 44.8408,
    size: 16,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "twincities-sisters@example.org",
    },
    meeting: { cadence: "Saturdays, 11:00 AM", venue: "Community center" },
  },
  {
    id: "nn-minneapolis-b",
    name: "Bloomington Brothers",
    branch: "brothers",
    status: "active",
    city: "Bloomington",
    state: "MN",
    region: "Midwest",
    longitude: -93.2983,
    latitude: 44.8408,
    size: 14,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "twincities-brothers@example.org",
    },
    meeting: { cadence: "Saturdays, 1:00 PM", venue: "Community center" },
  },
  {
    id: "nn-houston-b",
    name: "Sugar Land Brothers",
    branch: "brothers",
    status: "active",
    city: "Sugar Land",
    state: "TX",
    region: "South Central",
    longitude: -95.6349,
    latitude: 29.6197,
    size: 23,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "houston-brothers@example.org",
      phone: "(555) 010-0105",
    },
    meeting: { cadence: "Fridays, 8:30 PM", venue: "Masjid youth wing" },
  },
  {
    id: "nn-houston-s",
    name: "Sugar Land Sisters",
    branch: "sisters",
    status: "active",
    city: "Sugar Land",
    state: "TX",
    region: "South Central",
    longitude: -95.6349,
    latitude: 29.6197,
    size: 21,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "houston-sisters@example.org",
    },
    meeting: { cadence: "Sundays, 4:00 PM", venue: "Masjid youth wing" },
  },
  {
    id: "nn-dallas-b",
    name: "Richardson Brothers",
    branch: "brothers",
    status: "active",
    city: "Richardson",
    state: "TX",
    region: "South Central",
    longitude: -96.7299,
    latitude: 32.9483,
    size: 18,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "dallas-brothers@example.org",
    },
    meeting: { cadence: "Wednesdays, 8:00 PM", venue: "Campus MSA room" },
  },
  {
    id: "nn-dallas-s",
    name: "Richardson Sisters",
    branch: "sisters",
    status: "forming",
    city: "Richardson",
    state: "TX",
    region: "South Central",
    longitude: -96.7299,
    latitude: 32.9483,
    size: 7,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Regional coordinator",
      email: "dallas-sisters@example.org",
    },
    meeting: { cadence: "Forming, reach out to be added", venue: "TBD" },
  },
  {
    id: "nn-denver-b",
    name: "Aurora Brothers",
    branch: "brothers",
    status: "forming",
    city: "Aurora",
    state: "CO",
    region: "Mountain West",
    longitude: -104.8319,
    latitude: 39.7294,
    size: 9,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Regional coordinator",
      email: "denver@example.org",
    },
    meeting: { cadence: "Monthly for now", venue: "Rotating homes" },
  },
  {
    id: "nn-phoenix-s",
    name: "Tempe Sisters",
    branch: "sisters",
    status: "active",
    city: "Tempe",
    state: "AZ",
    region: "Southwest",
    longitude: -111.94,
    latitude: 33.4255,
    size: 12,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "phoenix-sisters@example.org",
    },
    meeting: { cadence: "Saturdays, 10:00 AM", venue: "Islamic center" },
  },
  {
    id: "nn-phoenix-b",
    name: "Tempe Brothers",
    branch: "brothers",
    status: "active",
    city: "Tempe",
    state: "AZ",
    region: "Southwest",
    longitude: -111.94,
    latitude: 33.4255,
    size: 11,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "phoenix-brothers@example.org",
    },
    meeting: { cadence: "Saturdays, 7:00 PM", venue: "Islamic center" },
  },
  {
    id: "nn-bayarea-b",
    name: "Fremont Brothers",
    branch: "brothers",
    status: "active",
    city: "Fremont",
    state: "CA",
    region: "West",
    longitude: -121.9886,
    latitude: 37.5485,
    size: 29,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "bayarea-brothers@example.org",
      whatsapp: "+1-555-010-0106",
    },
    meeting: { cadence: "Fridays after Maghrib", venue: "Masjid annex" },
  },
  {
    id: "nn-bayarea-s",
    name: "Fremont Sisters",
    branch: "sisters",
    status: "active",
    city: "Fremont",
    state: "CA",
    region: "West",
    longitude: -121.9886,
    latitude: 37.5485,
    size: 25,
    ageGroup: "High school + college",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "bayarea-sisters@example.org",
    },
    meeting: { cadence: "Sundays, 12:00 PM", venue: "Masjid annex" },
  },
  {
    id: "nn-socal-b",
    name: "Garden Grove Brothers",
    branch: "brothers",
    status: "active",
    city: "Garden Grove",
    state: "CA",
    region: "West",
    longitude: -117.9414,
    latitude: 33.7739,
    size: 20,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "oc-brothers@example.org",
    },
    meeting: { cadence: "Fridays, 7:30 PM", venue: "Islamic institute" },
  },
  {
    id: "nn-socal-s",
    name: "Garden Grove Sisters",
    branch: "sisters",
    status: "active",
    city: "Garden Grove",
    state: "CA",
    region: "West",
    longitude: -117.9414,
    latitude: 33.7739,
    size: 22,
    ageGroup: "High school",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "oc-sisters@example.org",
      instagram: "@placeholder_ym",
    },
    meeting: { cadence: "Sundays, 3:00 PM", venue: "Islamic institute" },
  },
  {
    id: "nn-seattle-s",
    name: "Bellevue Sisters",
    branch: "sisters",
    status: "active",
    city: "Bellevue",
    state: "WA",
    region: "Pacific Northwest",
    longitude: -122.2015,
    latitude: 47.6101,
    size: 14,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "seattle-sisters@example.org",
    },
    meeting: { cadence: "Tuesdays, 6:00 PM", venue: "Campus prayer room" },
  },
  {
    id: "nn-seattle-b",
    name: "Bellevue Brothers",
    branch: "brothers",
    status: "active",
    city: "Bellevue",
    state: "WA",
    region: "Pacific Northwest",
    longitude: -122.2015,
    latitude: 47.6101,
    size: 13,
    ageGroup: "College",
    contact: {
      name: "Placeholder Name",
      role: "Neighbornet lead",
      email: "seattle-brothers@example.org",
    },
    meeting: { cadence: "Tuesdays, 8:00 PM", venue: "Campus prayer room" },
  },
];

/** Properties carried on each point feature when the data is fed to MapLibre. */
export type NeighborNetFeatureProperties = {
  id: string;
  name: string;
  branch: Branch;
  status: NeighborNetStatus;
  city: string;
  state: string;
  size: number;
};

/**
 * MapLibre sources want GeoJSON, not our record shape. Only the fields the
 * layer styling and cluster popups need are promoted onto the feature.
 */
export function toFeatureCollection(
  nets: NeighborNet[],
): FeatureCollection<Point, NeighborNetFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: nets.map((net) => ({
      type: "Feature",
      id: net.id,
      geometry: { type: "Point", coordinates: [net.longitude, net.latitude] },
      properties: {
        id: net.id,
        name: net.name,
        branch: net.branch,
        status: net.status,
        city: net.city,
        state: net.state,
        size: net.size,
      },
    })),
  };
}

export const branchLabel: Record<Branch, string> = {
  brothers: "Brothers",
  sisters: "Sisters",
};

export const statusLabel: Record<NeighborNetStatus, string> = {
  active: "Active",
  forming: "Forming",
  paused: "Paused",
};
