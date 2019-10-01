/*
  Keeps track of transactions
*/
import { types, flow } from "mobx-state-tree";
import TransactionModel from "src/models/request/Transaction";
import cache from "src/stores/cache";
import { Reference, ITransactionResult } from "src/utils";

const Transactions = types
  .model("Transactions", {
    latestId: 0,
    store: types.map(Reference(TransactionModel))
  })
  .actions(self => ({
    remove(id: string) {
      self.store.delete(id);
      cache.delete(id);
    }
  }))
  .actions(self => ({
    add: flow(function* flow(ops: ITransactionResult<any, any>) {
      const id = String(++self.latestId);

      self.store.set(
        id,
        TransactionModel.create({
          id
        })
      );

      return self.store
        .get(id)
        .run(ops)
        .then(res => {
          setTimeout(() => {
            self.remove(id);
          }, 10e3);

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

export default Transactions;
