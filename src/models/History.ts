import { types } from "mobx-state-tree";

const History = types.model("History", {
  previousIds: types.array(types.string)
});

export default History;
