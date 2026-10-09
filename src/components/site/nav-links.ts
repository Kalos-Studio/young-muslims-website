/**
 * The site's destination and navigation policy.
 *
 * Destination identity, placement, context-specific labels, ordering, and
 * current-route behavior live here. Rendering modules ask for the projection
 * they need instead of rebuilding those rules independently.
 */

type DestinationId =
  "chapters" | "about" | "stories" | "support" | "store" | "blog" | "contact";

export type NavigationSurface =
  | "header-primary"
  | "header-cta"
  | "drawer-primary"
  | "drawer-secondary"
  | "footer-primary"
  | "footer-secondary"
  | "footer-contact";

export type NavigationItem = Readonly<{
  id: DestinationId;
  href: string;
  label: string;
}>;

type Destination = Readonly<{
  href: string;
  label: string;
  currentRoute: "prefix" | "never";
  labels?: Partial<Record<NavigationSurface, string>>;
}>;

const DESTINATIONS = {
  chapters: {
    href: "/neighbornets",
    label: "Find a Chapter",
    currentRoute: "prefix",
    labels: { "drawer-primary": "Chapters" },
  },
  about: {
    href: "/about",
    label: "Who We Are",
    currentRoute: "prefix",
  },
  stories: {
    href: "/stories",
    label: "Stories",
    currentRoute: "prefix",
  },
  support: {
    href: "/support",
    label: "Support",
    currentRoute: "prefix",
  },
  store: {
    href: "/store",
    label: "Store",
    currentRoute: "prefix",
  },
  blog: {
    href: "/blog",
    label: "Blog",
    currentRoute: "prefix",
  },
  contact: {
    href: "/about",
    label: "Contact",
    // Contact currently points at the About page rather than its own route.
    // It must not compete with Who We Are for aria-current.
    currentRoute: "never",
    labels: { "footer-contact": "Contact us" },
  },
} as const satisfies Record<DestinationId, Destination>;

const DESTINATIONS_BY_SURFACE = {
  "header-primary": ["about", "stories", "support"],
  "header-cta": ["chapters"],
  "drawer-primary": ["chapters", "about", "stories", "support"],
  "drawer-secondary": ["store", "blog", "contact"],
  "footer-primary": ["chapters", "about", "stories", "support"],
  "footer-secondary": ["blog", "store"],
  "footer-contact": ["contact"],
} as const satisfies Record<NavigationSurface, readonly DestinationId[]>;

export function getNavigationItems(
  surface: NavigationSurface,
): readonly NavigationItem[] {
  return DESTINATIONS_BY_SURFACE[surface].map((id) => {
    const destination: Destination = DESTINATIONS[id];

    return {
      id,
      href: destination.href,
      label: destination.labels?.[surface] ?? destination.label,
    };
  });
}

export function isNavigationItemCurrent(
  item: NavigationItem,
  pathname: string,
): boolean {
  const destination: Destination = DESTINATIONS[item.id];

  if (destination.currentRoute === "never") return false;
  return item.href === "/"
    ? pathname === "/"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
