import { types } from "mobx-state-tree";
import getColors from "src/getColors";

const App = types
  .model("App", {
    theme: types.optional(types.enumeration(["light", "dark"]), "light"),
    page: types.optional(types.enumeration(["Home"]), "Home")
  })
  .views(self => ({
    get colors() {
      return getColors(self.theme === "dark");
    }
  }))
  .actions(self => ({
    changePage(page: typeof self["page"]) {
      self.page = page;
    }
  }));

export default App;
