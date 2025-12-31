/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.shopifycdn.com",
      },
    ],
    // Tăng timeout cho image optimization
    minimumCacheTTL: 1,
    // Cho phép unoptimized images để tránh timeout
    unoptimized: false,
  },
};

export default nextConfig;
