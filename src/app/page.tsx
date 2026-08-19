import type { Metadata } from "next";
import MinimalIndex from "~/components/MinimalIndex";

export const metadata: Metadata = {
  title: "Maxwell Young — Music, releases, and archive",
  description:
    "Maxwell Young releases, artwork, lyrics, films, credits, and archive.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <MinimalIndex />;
}
