import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fail build on TypeScript errors
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
