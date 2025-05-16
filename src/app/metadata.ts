import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: "Music Maxwell",
  description: "A platform for music enthusiasts",
  openGraph: {
    title: "Music Maxwell",
    description: "A platform for music enthusiasts",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "Music Maxwell",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Music Maxwell",
    description: "A platform for music enthusiasts",
  },
};
