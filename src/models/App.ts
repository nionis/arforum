import { types } from "mobx-state-tree";
import { getClientSize, getColors } from "src/utils";

const App = types
  .model("App", {
    theme: types.optional(types.enumeration(["light", "dark"]), "light"),
    page: types.optional(types.enumeration(["Home"]), "Home"),
    width: types.number,
    height: types.number
  })
  .views(self => ({
    get colors() {
      return getColors(self.theme === "dark");
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

    changePage(page: typeof self["page"]) {
      self.page = page;
    },

    updateSizes(width: typeof self["width"], height: typeof self["height"]) {
      self.width = width;
      self.height = height;
    }
  }))
  .actions(self => ({
    afterCreate() {
      window.addEventListener("resize", () => {
        const { width, height } = getClientSize();
        self.updateSizes(width, height);
      });
    }
  }));

export default App;
