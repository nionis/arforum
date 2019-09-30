import { types } from "mobx-state-tree";
import User from "src/models/User";
import { Reference } from "src/utils";

const HasOwner = types.model("HasOwner", {
  from: Reference(User)
});

export default HasOwner;
