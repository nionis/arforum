import { types } from "mobx-state-tree";
import { id } from "src/utils";

const Primitive = types.model("Primitive", {
  id,
  createdAt: types.number,
  updatedAt: types.number
});

export default Primitive;
