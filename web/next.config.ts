import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [320, 480, 640, 750],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "/api/backend/register",
      },
      {
        source: "/otp",
        destination: "/api/backend/otp",
      },
      {
        source: "/resend-otp",
        destination: "/api/backend/resend-otp",
      },
      {
        source: "/forgot-password",
        destination: "/api/backend/forgot-password",
      },
      {
        source: "/reset-password",
        destination: "/api/backend/reset-password",
      },
    ];
  },
};

export default nextConfig;
