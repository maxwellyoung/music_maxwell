import type { Metadata } from "next";
import MinimalIndex from "~/components/MinimalIndex";

export const metadata: Metadata = {
  title: "Lab A — Minimal | Maxwell Young",
};

export default function MinimalLabPage() {
  return <MinimalIndex />;
}
