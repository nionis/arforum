import Router from "next/router";
import { types } from "mobx-state-tree";
import { throttle } from "lodash";
import { getClientSize, getColors } from "src/utils";

const App = types
  .model("App", {
    theme: types.optional(types.enumeration(["light", "dark"]), "light"),
    path: types.string,
    width: types.number,
    height: types.number
  })
  .views(self => ({
    get colors() {
      return getColors(self.theme === "dark");
    },

    get pathData(): {
      page?: "Home" | "User" | "CreateCategory" | "CreatePost";
      categoryId?: string;
      postId?: string;
      userId?: string;
    } {
      if (self.path === "/") {
        return {
          page: "Home"
        };
      }

      const [, , type, id1, id2] = self.path.split("/");

      if (type === "c") {
        return {
          page: "Home",
          categoryId: id1,
          postId: id2
        };
      } else if (type === "u") {
        return {
          page: "User",
          userId: id1
        };
      } else if (type === "n" && id1 === "category") {
        return {
          page: "CreateCategory"
        };
      } else if (type === "n" && id1 === "post") {
        return {
          page: "CreatePost"
        };
      }

      return {};
    },

    get size(): "large" | "small" {
      if (self.width > 750) return "large";

      return "small";
    }
  }))
  .actions(self => ({
    swapTheme() {
      if (self.theme === "light") {
        self.theme = "dark";
      } else {
        self.theme = "light";
      }
    },

    updatePath(path: typeof self["path"]) {
      self.path = path;
    },

    updateSizes(width: typeof self["width"], height: typeof self["height"]) {
      self.width = width;
      self.height = height;
    }
  }))
  .actions(self => ({
    afterCreate() {
      // listen to path change
      Router.events.on("hashChangeStart", self.updatePath);

      // listen to screen resize
      window.addEventListener(
        "resize",
        throttle(() => {
          // this is not necessary
          const { width, height } = getClientSize();
          self.updateSizes(width, height);
        }, 150)
      );
    }
  }));

export default App;
