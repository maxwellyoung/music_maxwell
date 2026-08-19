import CollectableGrid from "~/components/CollectableGrid";
import HomeHero from "~/components/HomeHero";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
    </main>
  );
}
