/*
  pick the latest item from a list of items
  usually used when we have 3 stores (ex: Comment)
  with the same id but we want to pick the latest edit
*/
import { Instance } from "mobx-state-tree";
import { sortBy } from "lodash";
import Primitive from "src/models/Primitive";

const pickLatest = <T extends Instance<typeof Primitive>>(items: T[]) => {
  return sortBy(items, item => item.createdAt).reverse();
};

export { pickLatest };
