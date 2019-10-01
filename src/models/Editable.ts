import { types } from "mobx-state-tree";

const Editable = types.model("Editable", {
  editOf: types.maybe(types.string)
});

export default Editable;
