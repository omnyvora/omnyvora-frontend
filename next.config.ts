import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained output under .next/standalone — required for the Docker runner stage.
  output: "standalone",
  // Allow the dev server to serve font/HMR assets to 127.0.0.1 (localhost alias).
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
