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
        url: "/og-image.jpg",
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
    images: ["/twitter-image.jpg"],
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
  manifest: "/icons/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/icons/favicon.ico" }],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
