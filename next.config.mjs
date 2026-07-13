/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tree-shake big barrel packages so a route only compiles the icons /
  // animation primitives it actually uses (big dev-compile + bundle win).
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
