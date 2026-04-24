import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/bfhl", destination: "/api/bfhl", permanent: false },
    ];
  },
};

export default nextConfig;
