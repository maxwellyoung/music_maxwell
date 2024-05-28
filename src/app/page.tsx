import { type NextPage } from "next";

import dynamic from "next/dynamic";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"));
const DotMatrix = dynamic(() => import("~/components/DotMatrix"));

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-dark flex h-screen min-h-screen flex-col items-center justify-center overflow-x-hidden text-white">
        <DotMatrix />
      </div>
      <CollectableGrid />
    </>
  );
};

export default Home;
