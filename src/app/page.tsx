import dynamic from "next/dynamic";
const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-[90vh]">
      <section className="container mx-auto py-8">
        <CollectableGrid />
      </section>
    </main>
  );
}
