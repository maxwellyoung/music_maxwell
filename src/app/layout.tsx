import "~/styles/globals.css";
import { GeistPixelCircle, GeistPixelLine } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "~/components/JsonLd";
import { SessionProvider } from "~/components/providers/SessionProvider";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";
import Navbar from "../components/Navbar";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://www.maxwellyoung.info";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Maxwell Young — Music, releases, and archive",
    template: "%s",
  },
  description:
    "Maxwell Young music, releases, videos, lyrics, artwork, and archive.",
  openGraph: {
    siteName: "Maxwell Young",
    type: "website",
    images: ["/artworks/1kiss.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/artworks/1kiss.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistPixelLine.variable} ${GeistPixelCircle.variable}`}
    >
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": `${appUrl}/#artist`,
                name: "Maxwell Young",
                url: appUrl,
                image: `${appUrl}/pressphotos/4.jpg`,
                jobTitle: "Musician and producer",
                birthDate: "1999",
                birthPlace: { "@type": "Country", name: "New Zealand" },
                sameAs: [
                  "https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q",
                  "https://music.apple.com/us/artist/maxwell-young/1113632139",
                  "https://www.youtube.com/@maxwell_young",
                  "https://www.instagram.com/maxwell_young",
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${appUrl}/#website`,
                url: appUrl,
                name: "Maxwell Young",
                publisher: { "@id": `${appUrl}/#artist` },
              },
            ],
          }}
        />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-[#f2ede4] px-4 py-3 text-sm font-bold text-[#07090d] transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <SessionProvider>
          <Navbar />
          <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </div>
          <Footer />
          <Toaster />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
