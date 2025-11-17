import type { NextConfig } from "next";

// Security headers for better SEO and performance
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes and server-side functionality
  images: {
    // Keep unoptimized for now, can optimize later on Vercel
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thiskidcancode.s3.amazonaws.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
