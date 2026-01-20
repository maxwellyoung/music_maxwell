/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  async headers() {
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://maxwellyoung.info";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
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
  // Add experimental features for better build handling
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Ensure Node.js built-ins like 'crypto' are not bundled during build
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  webpack: (config, { isServer: _isServer, ..._rest }) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = config.resolve.fallback || {};
    // Tell Webpack not to polyfill 'crypto'; Node.js will provide it at runtime
    config.resolve.fallback.crypto = false;
    return config;
  },
};

// Always validate environment variables during build
if (!process.env.SKIP_ENV_VALIDATION) {
  await import("./src/env.js");
}

// Remove require and use dynamic import for ESM compatibility
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
