import type { Metadata } from "next";
import { ShowsClient } from "./ShowsClient";

export const metadata: Metadata = {
  title: "Shows | Maxwell Young",
  description: "Upcoming and past live shows by Maxwell Young.",
};

// Past shows data - could move to CMS later
const pastShows = [
  {
    id: "1",
    venue: "San Fran",
    city: "Wellington, NZ",
    date: "2024-03-15",
    withArtists: ["Lontalius"],
    type: "headline" as const,
  },
  {
    id: "2",
    venue: "The Internet NZ Tour",
    city: "Auckland, NZ",
    date: "2019-09-20",
    withArtists: ["The Internet"],
    type: "support" as const,
  },
  {
    id: "3",
    venue: "Snail Mail NZ Tour",
    city: "Wellington, NZ",
    date: "2019-05-10",
    withArtists: ["Snail Mail"],
    type: "support" as const,
  },
];

export default function ShowsPage() {
  return <ShowsClient pastShows={pastShows} upcomingShows={[]} />;
}
