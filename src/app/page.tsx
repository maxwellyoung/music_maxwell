import { type NextPage } from "next";
import CollectableGrid from "~/components/CollectableGrid";
import DotMatrix from "~/components/DotMatrix";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex h-screen min-h-screen flex-col items-center justify-center bg-dark text-white">
        <DotMatrix />
        {/* <CtaSection /> */}
      </div>
      <CollectableGrid />
    </>
  );
};

export default Home;
