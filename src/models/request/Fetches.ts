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
  .volatile(self => ({
    promises: new Map()
  }))
  .views(self => ({
    get pendingSize() {
      const items = Array.from(self.store.values());
      const pending = items.filter(item => item.status === "PENDING");

      return pending.length;
    }
  }))
  .actions(self => ({
    remove(id: string) {
      self.promises.delete(id);
      self.store.delete(id);
      cache.delete(id);
    }
  }))
  .actions(self => ({
    add: flow(function* flow(ops: IRunOps) {
      const id = JSON.stringify(ops.query);
      const hasStore = self.store.has(id);

      if (!ops.forceRefetch && hasStore) {
        const fetch = self.store.get(id);

        if (fetch.status === "PENDING") {
          return self.promises.get(id);
        }

        return fetch.response;
      }

      if (!hasStore) {
        self.store.set(
          id,
          Fetch.create({
            id
          })
        );
      }

      const promise = self.store
        .get(id)
        .run(ops)
        .then(res => {
          setTimeout(() => {
            self.remove(id);
          }, 500e3);

          return res;
        });

      self.promises.set(id, promise);

      return promise;
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
