import {
  createClient,
  type ClientConfig,
  type SanityClient,
} from "@sanity/client";

const isDev = process.env.NODE_ENV === "development";

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: !isDev, // Disable CDN in development
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  // Only use credentials in production (requires CORS config in Sanity dashboard)
  withCredentials: !isDev && !!process.env.SANITY_API_TOKEN,
  perspective: "published",
};

// Ensure that all required properties are provided and correctly typed
export const sanityClient: SanityClient = createClient(config);
