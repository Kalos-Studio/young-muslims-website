import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/seo";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/mygi3vn8/production/**",
      },
    ],
  },
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
