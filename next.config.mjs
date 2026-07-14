/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle with only the node_modules actually
  // used. Without this the deploy ships the whole dependency tree (~370 MB)
  // and runs out of disk on the host.
  output: "standalone",
  // Tree-shake big barrel packages so a route only compiles the icons /
  // animation primitives it actually uses (big dev-compile + bundle win).
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
