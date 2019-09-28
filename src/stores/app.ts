import Router from "next/router";
import App from "src/models/App";
import { getClientSize } from "src/utils";

const app = App.create({
  path: Router.asPath,
  ...getClientSize()
});

export const goto = {
  home: () => {
    Router.push("/");
  },
  category: (id: string) => {
    Router.push(`/#/c/${id}`);
  },
  post: (catId: string, postId: string) => {
    Router.push(`/#/c/${catId}/${postId}`);
  },
  user: (userId: string) => {
    Router.push(`/#/u/${userId}`);
  }
};

export default app;
