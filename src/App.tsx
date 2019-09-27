import { observer } from "mobx-react";
import Head from "next/head";
import Header from "src/components/Header";
import Home from "src/Home";
import appStore from "src/stores/app";

const View = observer(() => {
  if (appStore.page === "Home") {
    return <Home />;
  }

  return <span>not found</span>;
});

const App = observer(() => {
  return (
    <>
      <Head>
        <title>arforum</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
          rel="stylesheet"
          key="google-font-cabin"
        />
      </Head>

      <Header />
      <View />

      <style global jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Roboto", sans-serif;
          background-color: ${appStore.colors.pageBackground};
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
});

export default App;
