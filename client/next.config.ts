import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/api-docs",
        destination: `${apiUrl}/api-docs/`,
      },
      {
        source: "/api-docs/:path*",
        destination: `${apiUrl}/api-docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
