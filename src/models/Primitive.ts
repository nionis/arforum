import { types } from "mobx-state-tree";
import User from "src/models/User";

const Primitive = types.model("Primitive", {
  id: types.identifier,
  from: types.maybe(User),
  createdAt: types.maybe(types.number),
  updatedAt: types.maybe(types.number)
});

export default Primitive;
