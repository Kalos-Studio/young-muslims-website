import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/seo";
import { sanityProjectId, sanityDataset } from "./src/lib/sanity-config";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
      },
    ],
  },
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
