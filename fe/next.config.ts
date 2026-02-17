import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
      },
    ],
  },
  async rewrites() {
    // Use BACKEND_URL for Docker, fallback to localhost for local dev
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3011";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/qr/sim",
        destination: "/sim?utm_source=qr_code&utm_medium=print&utm_campaign=sim_marketing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
