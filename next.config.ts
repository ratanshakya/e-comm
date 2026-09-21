import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ferf1mheo22r9ira.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
