import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Maxwell Young",
  description: "Freewheelin' out June 7",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overflow-x-hidden">{children}</body>
      <Analytics />
    </html>
  );
}
