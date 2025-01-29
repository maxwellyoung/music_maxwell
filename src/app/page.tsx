import React from "react";
import CollectableGrid from "~/components/CollectableGrid";
import CtaSection from "~/components/CtaSection";

const Home = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden">
      <CtaSection />
      <CollectableGrid />
    </main>
  );
};

export default Home;
