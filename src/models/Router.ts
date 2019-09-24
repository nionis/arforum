import { types } from "mobx-state-tree";

const Router = types
  .model("Router", {
    page: types.optional(types.enumeration(["Home"]), "Home")
  })
  .actions(self => ({
    changePage(page: typeof self["page"]) {
      self.page = page;
    }
  }));

export default Router;
