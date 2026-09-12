/**
 * The site's information architecture, in one place.
 *
 * The header and the side drawer both render from these arrays, so adding a
 * page to the site means adding it here once. Nothing about this file is part
 * of the wireframe: these are the real routes and the real labels, and they
 * outlive the grey boxes.
 *
 * `href` values are `as const` so they stay literal types rather than widening
 * to `string`, which is what Next's typed `<Link href>` expects.
 */

export type NavLink = {
  href: string;
  label: string;
};

/**
 * The three links in the middle of the header. These are the pages we want a
 * first-time visitor to see; everything else is one level down.
 */
export const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/stories", label: "Stories" },
  { href: "/support", label: "Support" },
] as const satisfies readonly NavLink[];

/**
 * The header's call to action. Kept separate from `primaryLinks` because it is
 * styled as a button, not a nav link, and because it is the one action the
 * whole site is pointing at.
 */
export const ctaLink = {
  href: "/neighbornets",
  label: "Join a NeighborNet",
} as const satisfies NavLink;

/**
 * Pages that live only in the side drawer. They matter, but they are not part
 * of the main path through the site, and putting them in the header would
 * dilute it.
 */
export const drawerOnlyLinks = [
  { href: "/store", label: "Store" },
  { href: "/blog", label: "Blog" },
] as const satisfies readonly NavLink[];

/** Everything the drawer lists, in the order it lists them. */
export const drawerLinks = [
  ...primaryLinks,
  ctaLink,
  ...drawerOnlyLinks,
] as const satisfies readonly NavLink[];
