import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build for container deployments.
  // The resulting .next/standalone directory includes only the files needed
  // to run the server, greatly reducing the final image size.
  output: "standalone",
};

export default nextConfig;
