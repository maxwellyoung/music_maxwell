import type { Metadata } from "next";
import { VideosClient } from "./VideosClient";

export const metadata: Metadata = {
  title: "Videos | Maxwell Young",
  description: "Watch music videos and visual content from Maxwell Young.",
  openGraph: {
    title: "Videos | Maxwell Young",
    description: "Watch music videos and visual content from Maxwell Young.",
  },
};

export default function VideosPage() {
  return <VideosClient />;
}
