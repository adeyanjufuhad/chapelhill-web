import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // Admin-uploaded photos are served from the public "media" bucket in Neon Object Storage.
    remotePatterns: [{ protocol: "https", hostname: "**.neon.tech", pathname: "/media/**" }],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
