import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Figma plugin sources and the shipped components are read from disk by lib/kit.ts.
  outputFileTracingIncludes: {
    "/api/download/[id]": ["./lib/figma-plugin/**", "./components/ui/**"],
    "/api/test-download": ["./lib/figma-plugin/**", "./components/ui/**"],
  },
};

export default nextConfig;
