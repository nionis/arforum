import { types } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";

const Vote = types.compose(
  "Vote",
  Primitive,
  HasOwner,
  types.model({
    item: types.string,
    type: types.enumeration(["upvote", "downvote"])
  })
);

export default Vote;
