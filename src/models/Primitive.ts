import { types } from "mobx-state-tree";

const Primitive = types.model("Primitive", {
  id: types.identifier,
  from: types.maybe(types.string),
  createdAt: types.maybe(types.number),
  updatedAt: types.maybe(types.number)
});

export default Primitive;
