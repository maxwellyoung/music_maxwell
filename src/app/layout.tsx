import "~/styles/globals.css";
import { type Metadata, type Viewport } from "next";
import { SessionProvider } from "~/components/providers/SessionProvider";
import { PostHogProvider } from "~/components/providers/PostHogProvider";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";
import { NavigationRoot } from "~/components/navigation";
import dynamic from "next/dynamic";

// Lazy load ambient effects - not critical for first paint
const CursorGlow = dynamic(
  () => import("~/components/CursorGlow").then((mod) => mod.CursorGlow),
  { ssr: false }
);
const FloatingQuotes = dynamic(
  () => import("~/components/FloatingQuotes").then((mod) => mod.FloatingQuotes),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Maxwell Young",
  description: "Alternative pop artist from New Zealand making emotionally-driven alt-pop.",
  metadataBase: new URL("https://maxwellyoung.info"),
  openGraph: {
    title: "Maxwell Young",
    description: "Alternative pop artist from New Zealand making emotionally-driven alt-pop.",
    images: ["/icons/ss.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxwell Young",
    description: "Alternative pop artist from New Zealand.",
    images: ["/icons/ss.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />

        {/* DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://open.spotify.com" />
        <link rel="dns-prefetch" href="https://music.apple.com" />

        {/* Favicons */}
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
      <body className="flex min-h-screen flex-col overflow-x-hidden antialiased">
        <SessionProvider>
          <PostHogProvider>
            {/* Ambient effects - lazy loaded, non-blocking */}
            <CursorGlow />
            <FloatingQuotes />

            {/* Navigation */}
            <NavigationRoot />

            {/* Main content with fade-in */}
            <main className="flex-1 pt-16 animate-in fade-in duration-500">
              {children}
            </main>

            <Footer />
            <Toaster />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
