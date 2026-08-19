import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/verite-airbnb",
  assetPrefix: "/verite-airbnb/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
