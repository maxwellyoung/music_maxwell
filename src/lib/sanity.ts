import {
  createClient,
  type ClientConfig,
  type SanityClient,
} from "@sanity/client";

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION, // Use a recent API version
};

// Ensure that all required properties are provided and correctly typed
export const sanityClient: SanityClient = createClient(config);
