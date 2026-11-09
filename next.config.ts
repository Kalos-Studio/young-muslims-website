import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/seo";

const nextConfig: NextConfig = {
  // Bake the indexing decision into the build; see src/lib/seo.ts.
  env: { SITE_INDEXABLE_RESOLVED: String(isSiteIndexable) },
  async headers() {
    return isSiteIndexable
      ? []
      : [
          {
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
          },
        ];
  },
};

export default nextConfig;
