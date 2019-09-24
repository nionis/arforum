import dynamic from "next/dynamic";

const Home = dynamic(() => import("src/Home"), {
  ssr: false
});

export default Home;
