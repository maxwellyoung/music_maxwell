import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// NODE_ENV is usually auto-set by Next.js (e.g. "production" on Vercel, "development" locally) – but we require it here.
const NODE_ENV = z
  .enum(["development", "production", "test"])
  .default("production");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: NODE_ENV,
    DATABASE_URL: z.string().url(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // --- Additional server-side env vars ---
    SANITY_API_TOKEN: z.string().min(1).optional(), // Required if using Sanity server-side
    RESEND_API_KEY: z.string().min(1).optional(), // Required if using Resend
    RESEND_SENDER: z.string().min(1).optional(), // Required if using Resend
    SMTP_HOST: z.string().min(1).optional(), // Required if using SMTP
    SMTP_PORT: z.string().min(1).optional(), // Required if using SMTP
    SMTP_SECURE: z.string().optional(), // 'true' or 'false', optional
    SMTP_USER: z.string().min(1).optional(), // Required if using SMTP
    SMTP_PASSWORD: z.string().min(1).optional(), // Required if using SMTP
    SMTP_FROM: z.string().min(1).optional(), // Required if using SMTP
    SKIP_ENV_VALIDATION: z.string().optional(), // Used to skip env validation (builds, Docker, etc.)
    NEXT_PHASE: z.string().optional(), // Used by Next.js in some build phases
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // --- Client-side env vars ---
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(), // Required if using Sanity client-side
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).optional(),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(), // Used for client-side URL references
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1).optional(), // Required if using Shopify
    NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN: z.string().min(1).optional(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // --- Additional server-side env vars ---
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_SENDER: process.env.RESEND_SENDER,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
    NEXT_PHASE: process.env.NEXT_PHASE,
    // --- Client-side env vars ---
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
