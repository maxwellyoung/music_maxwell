import { type NextPage } from "next";
import DotMatrix from "~/components/DotMatrix";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <DotMatrix />
      {/* <CtaSection /> */}
    </div>
  );
};

export default Home;
