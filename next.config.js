import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async redirects() {
    // Campaign rooms retired 2026-08-20: one release-page system, the ledger.
    return [
      { source: "/1kiss", destination: "/r/1kiss", permanent: true },
      {
        source: "/sneakin",
        destination: "/r/sneakin-drinks-into-bars",
        permanent: true,
      },
      { source: "/turn-it-up", destination: "/r/turn-it-up", permanent: true },
      { source: "/flying", destination: "/r/flying", permanent: true },
      { source: "/wintour", destination: "/r/wintour", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXTAUTH_URL ?? "https://www.maxwellyoung.info",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Next 16 builds with Turbopack; the old webpack crypto fallback is obsolete.
  turbopack: {},
};

// Always validate environment variables during build
if (!process.env.SKIP_ENV_VALIDATION) {
  await import("./src/env.js");
}

export default nextConfig;
