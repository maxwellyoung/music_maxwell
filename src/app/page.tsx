import { type NextPage } from "next";

import dynamic from "next/dynamic";
import CtaSection from "~/components/CtaSection";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"));

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-dark flex h-screen min-h-screen flex-col items-center justify-center overflow-x-hidden text-white">
        <CtaSection />
      </div>
      <CollectableGrid />
    </>
  );
};

export default Home;
