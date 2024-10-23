// lib/shopify.js
import Client from "shopify-buy";

const config: Client.Config = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN as string,
  storefrontAccessToken: process.env
    .NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
  apiVersion: "2023-07",
};

const client: Client = Client.buildClient(config);

export default client;
