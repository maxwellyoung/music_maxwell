import "~/styles/globals.css";
import { type Metadata } from "next";
import { SessionProvider } from "~/components/providers/SessionProvider";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Maxwell Young",
  description: "Alternative pop artists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="overflow-x-hidden">
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
