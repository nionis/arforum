import React from "react";
import { observer } from "mobx-react";
import router from "src/stores/router";
import Home from "src/Home";

const Router = observer((pageProps: any) => {
  const Component = (() => {
    if (router.page === "Home") return Home;

    return () => <h1>not found</h1>;
  })();

  return <Component {...pageProps} />;
});

export default Router;
