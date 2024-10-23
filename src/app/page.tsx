import React from "react";
import CtaSection from "~/components/CtaSection";
import CollectableGrid from "~/components/CollectableGrid";
import { StoreSectionComponent } from "~/components/store-section";
import { AbstractBlakePaintingComponent } from "~/components/abstract-blake-painting";
import { AdvancedImageCollageComponent } from "~/components/advanced-image-collage";

const Home = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* <AbstractBlakePaintingComponent />
      <div className="relative z-10 w-full"> */}
      <CtaSection />
      <CollectableGrid />
      {/* </div> */}
    </main>
  );
};

export default Home;
