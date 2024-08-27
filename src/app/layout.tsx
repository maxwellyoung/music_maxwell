import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Maxwell Young | Singer-Songwriter",
    template: "%s | Maxwell Young",
  },
  description:
    "Freewheelin' by Maxwell Young - Out June 7. Stream now on all major platforms.",
  keywords: [
    "Maxwell Young",
    "Freewheelin'",
    "Singer-Songwriter",
    "New Zealand Musician",
  ],
  authors: [{ name: "Maxwell Young" }],
  creator: "Maxwell Young",
  publisher: "Maxwell Young",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://maxwellyoung.info"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maxwell Young | Freewheelin'",
    description:
      "Freewheelin' by Maxwell Young - Out June 7. Stream now on all major platforms.",
    url: "https://maxwellyoung.com",
    siteName: "Maxwell Young",
    images: [
      {
        url: "https://maxwellyoung.com/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Maxwell Young - Freewheelin'",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxwell Young | Freewheelin'",
    description:
      "Freewheelin' by Maxwell Young - Out June 7. Stream now on all major platforms.",
    creator: "@internetmaxwell",
    images: ["https://maxwellyoung.com/twitter-image.jpg"], // Replace with your actual Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
