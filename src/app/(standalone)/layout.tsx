import "~/styles/globals.css";
import { SessionProvider } from "~/components/providers/SessionProvider";
import { PostHogProvider } from "~/components/providers/PostHogProvider";
import { Toaster } from "~/components/ui/toaster";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-black">
        <SessionProvider>
          <PostHogProvider>
            {children}
            <Toaster />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
