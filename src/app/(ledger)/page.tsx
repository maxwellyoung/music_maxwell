import type { Metadata } from "next";
import { Suspense } from "react";
import MarginNotes from "~/components/MarginNotes";
import MinimalIndex from "~/components/MinimalIndex";
import releases from "~/data/releases";
import { summarizeRelease } from "~/lib/releaseSummary";

export const metadata: Metadata = {
  title: "Maxwell Young — Music, releases, and archive",
  description:
    "Maxwell Young releases, artwork, lyrics, films, credits, and archive.",
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default function Home() {
  return (
    <MinimalIndex
      releases={releases.map(summarizeRelease)}
      notesSlot={
        <Suspense fallback={null}>
          <MarginNotes />
        </Suspense>
      }
    />
  );
}
