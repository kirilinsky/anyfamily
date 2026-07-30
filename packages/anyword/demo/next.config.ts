import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // demo lives inside the anyword repo — pin the root so the parent lockfile
  // is not picked up as the workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
