import type { Metadata } from "next";
import { GuestbookClient } from "./GuestbookClient";

export const metadata: Metadata = {
  title: "Guestbook | Maxwell Young",
  description:
    "Leave a message for Maxwell Young - share your thoughts, favorite songs, or just say hi.",
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
