import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Maxwell Young | Alternative Pop Artist",
    template: "%s | Maxwell Young",
  },
  description:
    "Maxwell Young is a New Zealand artist blending pop songwriting with visual design and classical training. His 2022 EP 'Birthday Girl' marked a shift toward more expansive, emotional work. 'In My 20s'—his upcoming 2025 project—blends alternative pop with experimental textures and cinematic visuals.",
  keywords: [
    "Maxwell Young",
    "In My 20s",
    "Birthday Girl",
    "Alternative Pop",
    "New Zealand Artist",
    "Visual Design",
    "Classical Training",
    "Experimental Pop",
    "Cinematic Music",
    "Electronic",
    "Casey Neistat",
    "The Internet",
    "Snail Mail",
    "Lontalius",
    "Wellington Music",
  ],
  authors: [{ name: "Maxwell Young" }],
  creator: "Maxwell Young",
  publisher: "Maxwell Young",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.maxwellyoung.info"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maxwell Young | Alternative Pop Artist",
    description:
      "Maxwell Young is a New Zealand artist blending pop songwriting with visual design and classical training. Started violin at age three, now creating immersive environments through music, video, and design that reflect the journey of coming into adulthood.",
    url: "https://www.maxwellyoung.info",
    siteName: "Maxwell Young",
    images: [
      {
        url: "/social/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maxwell Young - Alternative Pop Artist from Wellington",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxwell Young | Alternative Pop Artist",
    description:
      "Maxwell Young is a New Zealand artist blending pop songwriting with visual design and classical training. Started violin at age three, now creating immersive environments through music, video, and design that reflect the journey of coming into adulthood.",
    creator: "@internetmaxwell",
    images: [
      {
        url: "/social/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maxwell Young - Alternative Pop Artist from Wellington",
      },
    ],
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
  category: "music",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": "https://www.maxwellyoung.info",
  name: "Maxwell Young",
  url: "https://www.maxwellyoung.info",
  image: "/social/og-image.jpg",
  description:
    "Maxwell Young is a New Zealand artist blending pop songwriting with visual design and classical training. Started violin at age three, now creating immersive environments through music, video, and design.",
  genre: [
    "Alternative Pop",
    "Electronic",
    "Experimental Pop",
    "Cinematic",
    "Classical",
  ],
  sameAs: [
    "https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q",
    "https://music.apple.com/us/artist/maxwell-young/1113632139",
    "https://soundcloud.com/maxwell_young",
    "https://www.youtube.com/@maxwell_young",
    "https://x.com/internetmaxwell",
    "https://instagram.com/maxwell_young",
  ],
  location: {
    "@type": "Place",
    name: "Wellington, New Zealand",
  },
  member: {
    "@type": "Person",
    name: "Maxwell Young",
    jobTitle: "Singer-songwriter, Producer, Visual Artist",
    additionalType: "Violinist",
    description:
      "Started playing violin at age three and began producing as a teenager. Known for blending classical training with modern pop production.",
  },
  album: [
    {
      "@type": "MusicAlbum",
      name: "In My 20s",
      datePublished: "2025",
      description:
        "Upcoming project blending alternative pop with experimental textures and cinematic visuals",
    },
    {
      "@type": "MusicAlbum",
      name: "Birthday Girl",
      datePublished: "2022",
      description: "EP marking a shift toward more expansive, emotional work",
    },
  ],
  track: [
    "Turn It Up",
    "Freewheelin'",
    "I Just Wanna Fly",
    "Hopeless",
    "Call Ur Name / Go Ahead",
    "Birthday Girl",
    "Cherry Pie / Lose U Too",
    "Videostar / Cleopatra",
    "Dread!",
    "Don't Waste Your Time",
    "No. 5",
    "Only Romantics",
    "Daydreamer",
  ],
  performerIn: [
    {
      "@type": "Event",
      name: "Opening for The Internet",
      location: {
        "@type": "Place",
        name: "San Fran",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Wellington",
          addressCountry: "NZ",
        },
      },
    },
    {
      "@type": "Event",
      name: "Opening for Snail Mail",
      location: {
        "@type": "Place",
        addressLocality: "Wellington",
        addressCountry: "NZ",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
