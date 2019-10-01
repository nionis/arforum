import { observer } from "mobx-react";
import Head from "next/head";
import Header from "src/components/Header";
import Home from "src/pages/Home";
import Post from "src/pages/Post";
import User from "src/pages/User";
import CreateCategory from "src/pages/CreateCategory";
import NotFound from "src/pages/NotFound";
import app from "src/stores/app";

// observer app store and swap pages
const View = observer(() => {
  const { page, postId } = app.pathData;

  if (postId) {
    return <Post />;
  } else if (page === "Home") {
    return <Home />;
  } else if (page === "User") {
    return <User />;
  } else if (page === "CreateCategory") {
    return <CreateCategory />;
  }

  return <NotFound />;
});

const App = observer(() => {
  const { colors } = app;

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
          background-color: ${colors.pageBackground};
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
});

export default App;
