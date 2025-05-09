import CollectableGrid from "~/components/CollectableGrid";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[90vh]">
      <section className="container mx-auto py-8">
        <CollectableGrid />
      </section>
    </main>
  );
}
