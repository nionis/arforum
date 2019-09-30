/*
  Caches fetches
*/
import { types, flow } from "mobx-state-tree";
import Fetch from "src/models/request/Fetch";
import { Reference } from "src/utils";
import { IRunOps } from "src/models/request/types";

const Fetches = types
  .model("Fetches", {
    stores: types.map(Reference(Fetch))
  })
  .actions(self => ({
    add: flow(function* flow(ops: IRunOps) {
      const id = JSON.stringify({ query: ops.query, variables: ops.variables });
      const hasStore = self.stores.has(id);

      if (!ops.forceRefetch && hasStore) {
        return self.stores.get(id).response;
      }

      if (!hasStore) {
        self.stores.set(id, Fetch.create());
      }

      return self.stores.get(id).run(ops);
    }),

    remove(id: string) {
      self.stores.delete(id);
    }
  }))
  .actions(self => ({
    clear() {
      const items = Array.from(self.stores.entries());

      items.forEach(([id, tx]) => {
        if (tx.status === "PENDING") return;

        self.remove(id);
      });
    }
  }));

export default Fetches;
