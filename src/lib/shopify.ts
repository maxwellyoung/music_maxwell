// lib/shopify.js
import Client from "shopify-buy";

const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
  apiVersion: "2024-01", // Latest stable version
});

export default client;
