import { types } from "mobx-state-tree";

const History = types.model("History", {
  id: types.identifier,
  previousIds: types.array(types.string)
});

export default History;
