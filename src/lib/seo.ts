export const SITE_ORIGIN = "https://youngmuslims.com";

// Netlify previews also use NODE_ENV=production. Require both the deployment
// context and an explicit opt-in; absent configuration stays non-indexable.
export const isSiteIndexable =
  process.env.NODE_ENV === "production" &&
  process.env.CONTEXT === "production" &&
  process.env.SITE_INDEXABLE === "true";

export const indexablePaths = [
  "/",
  "/about",
  "/stories",
  "/support",
  "/neighbornets",
  "/store",
  "/blog",
  "/design-system",
] as const;
