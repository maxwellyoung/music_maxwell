import type { Metadata } from "next";
import { BTSClient } from "./BTSClient";

export const metadata: Metadata = {
  title: "Behind the Scenes | Maxwell Young",
  description:
    "Explore the creative process behind Maxwell Young's music - demos, voice memos, and production insights.",
};

// This could be moved to CMS later
const btsContent = [
  {
    id: "1",
    title: "Early Demo - Wintour",
    type: "demo" as const,
    description:
      "The first voice memo that became Wintour. Recorded on my phone walking through Wellington.",
    date: "2024-08-15",
    mediaUrl: null, // Would be SoundCloud embed or audio file
    relatedSong: "Wintour",
  },
  {
    id: "2",
    title: "Production Breakdown",
    type: "breakdown" as const,
    description:
      "How we built the synth layers in Freewheelin' - starting with a simple chord progression and adding texture.",
    date: "2023-06-20",
    mediaUrl: null,
    relatedSong: "Freewheelin'",
  },
  {
    id: "3",
    title: "Writing Session Notes",
    type: "notes" as const,
    description:
      "Scraps from the notebook - early lyrics and ideas that eventually became Turn It Up.",
    date: "2024-01-10",
    mediaUrl: null,
    relatedSong: "Turn It Up",
  },
];

export default function BTSPage() {
  return <BTSClient content={btsContent} />;
}
