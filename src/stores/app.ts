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
  },
  createCategory: () => {
    Router.push(`/#/n/category`);
  },
  createPost: () => {
    Router.push(`/#/n/post`);
  }
};

export default app;
