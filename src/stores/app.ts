import Router from "next/router";
import App from "src/models/App";
import { getClientSize } from "src/utils";

const app = App.create({
  path: Router.asPath,
  ...getClientSize()
});

export default app;
