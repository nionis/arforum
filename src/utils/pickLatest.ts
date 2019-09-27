import { Instance } from "mobx-state-tree";
import { sortBy } from "lodash";
import Primitive from "src/models/Primitive";

const pickLatest = <T extends Instance<typeof Primitive>>(items: T[]) => {
  return sortBy(items, item => item.updatedAt).reverse();
};

export { pickLatest };
