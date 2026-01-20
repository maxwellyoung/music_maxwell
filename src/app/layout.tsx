import "~/styles/globals.css";
import { type Metadata } from "next";
import { SessionProvider } from "~/components/providers/SessionProvider";
import { PostHogProvider } from "~/components/providers/PostHogProvider";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";
import { NavigationRoot } from "~/components/navigation";

export const metadata: Metadata = {
  title: "Maxwell Young",
  description: "Alternative pop artist.",
  openGraph: {
    images: ["/icons/ss.webp"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/icons/ss.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <SessionProvider>
          <PostHogProvider>
            <NavigationRoot />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <Toaster />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
