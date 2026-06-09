import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error Next.js typing might not include eslint here depending on the version
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
