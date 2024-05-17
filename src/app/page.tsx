import { type NextPage } from "next";
import CollectableGrid from "~/components/CollectableGrid";
import DotMatrix from "~/components/DotMatrix";

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
