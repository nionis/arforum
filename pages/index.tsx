import dynamic from "next/dynamic";

// we can't use SSR on arweave
const App = dynamic(() => import("src/App"), {
  ssr: false
});

export default App;
