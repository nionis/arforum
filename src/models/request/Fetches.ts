/*
  Caches fetches
*/
import { types, flow } from "mobx-state-tree";
import Fetch from "src/models/request/Fetch";
import cache from "src/stores/cache";
import { Reference } from "src/utils";
import { IRunOps } from "src/models/request/types";

const Fetches = types
  .model("Fetches", {
    store: types.map(Reference(Fetch))
  })
  .actions(self => ({
    remove(id: string) {
      self.store.delete(id);
      cache.delete(id);
    }
  }))
  .actions(self => ({
    add: flow(function* flow(ops: IRunOps) {
      const id = JSON.stringify({ query: ops.query, variables: ops.variables });
      const hasStore = self.store.has(id);

      if (!ops.forceRefetch && hasStore) {
        return self.store.get(id).response;
      }

      if (!hasStore) {
        self.store.set(
          id,
          Fetch.create({
            id
          })
        );
      }

      return self.store
        .get(id)
        .run(ops)
        .then(res => {
          setTimeout(() => {
            self.remove(id);
          }, 500e3);

          return res;
        });
    })
  }))
  .actions(self => ({
    clear() {
      const items = Array.from(self.store.entries());

      items.forEach(([id, tx]) => {
        if (tx.status === "PENDING") return;

        self.remove(id);
      });
    }
  }));

export default Fetches;
