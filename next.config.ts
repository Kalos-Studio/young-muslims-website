import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/seo";

const nextConfig: NextConfig = {
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
