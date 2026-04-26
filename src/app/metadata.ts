import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: "Maxwell Young",
  description: "Music, release notes, videos, lyrics, and archive.",
  openGraph: {
    title: "Maxwell Young",
    description: "Music, release notes, videos, lyrics, and archive.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "Maxwell Young",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxwell Young",
    description: "Music, release notes, videos, lyrics, and archive.",
  },
};
