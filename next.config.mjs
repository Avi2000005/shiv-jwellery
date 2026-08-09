/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    /**
     * Tree-shake large packages so only the exports you actually import
     * end up in the bundle — reduces JS parse/eval time which directly
     * improves page responsiveness.
     */
    optimizePackageImports: [
      '@react-three/drei',
      'framer-motion',
      'lucide-react',
      'three',
    ],
  },
}

export default nextConfig
