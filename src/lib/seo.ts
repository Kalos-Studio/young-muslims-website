export const SITE_ORIGIN = "https://youngmuslims.com";

// Netlify previews also use NODE_ENV=production. Require both the deployment
// context and an explicit opt-in; absent configuration stays non-indexable.
const indexableFromBuildEnv =
  process.env.NODE_ENV === "production" &&
  process.env.CONTEXT === "production" &&
  process.env.SITE_INDEXABLE === "true";

// Decided once, at build time. Netlify does not pass CONTEXT or netlify.toml
// variables to on-demand pages at request time, so reading them there would
// make those pages noindex in production. next.config.ts inlines the build's
// answer as SITE_INDEXABLE_RESOLVED; next.config.ts itself, which runs before
// that value exists, falls back to the build environment.
export const isSiteIndexable =
  process.env.SITE_INDEXABLE_RESOLVED === undefined
    ? indexableFromBuildEnv
    : process.env.SITE_INDEXABLE_RESOLVED === "true";

export const indexablePaths = [
  "/",
  "/about",
  "/contact",
  "/stories",
  "/support",
  "/neighbornets",
  "/store",
  "/blog",
  "/design-system",
] as const;

// Organization and WebSite structured data for the homepage. Keep every value
// verifiable (SEO-15): add `logo` and `sameAs` only once the logo URL and the
// official social profiles are confirmed.
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Young Muslims",
      alternateName: "YM",
      url: `${SITE_ORIGIN}/`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "Young Muslims",
      alternateName: "YM",
      url: `${SITE_ORIGIN}/`,
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};
