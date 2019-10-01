import { types } from "mobx-state-tree";
import User from "src/models/User";
import { Reference } from "src/utils";

const HasOwner = types.model("HasOwner", {
  from: types.maybe(Reference(User))
});

export default HasOwner;
