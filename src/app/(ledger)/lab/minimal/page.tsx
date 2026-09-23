import type { Metadata } from "next";
import MinimalIndex from "~/components/MinimalIndex";
import releases from "~/data/releases";
import { summarizeRelease } from "~/lib/releaseSummary";

export const metadata: Metadata = {
  title: "Lab A — Minimal | Maxwell Young",
};

export default function MinimalLabPage() {
  return <MinimalIndex releases={releases.map(summarizeRelease)} />;
}
