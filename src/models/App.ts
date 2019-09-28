import Router from "next/router";
import { types } from "mobx-state-tree";
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
      page?: "Home";
      categoryId?: string;
      postId?: string;
    } {
      if (self.path === "/") {
        return {
          page: "Home"
        };
      }

      const [, , type, primaryId, secondaryId] = self.path.split("/");

      if (type === "c") {
        return {
          page: "Home",
          categoryId: primaryId,
          postId: secondaryId
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
      window.addEventListener("resize", () => {
        const { width, height } = getClientSize();
        self.updateSizes(width, height);
      });
    }
  }));

export default App;
