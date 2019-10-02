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
  .views(self => ({
    get pendingSize() {
      const items = Array.from(self.store.values());
      const pending = items.filter(item => item.status === "PENDING");

      return pending.length;
    }
  }))
  .actions(self => ({
    remove(id: string) {
      self.store.delete(id);
      cache.delete(id);
    }
  }))
  .actions(self => ({
    add: flow(function* flow(
      ops: ITransactionResult<any, any>,
      txIdCb?: (id: string) => any
    ) {
      const id = String(++self.latestId);

      self.store.set(
        id,
        TransactionModel.create({
          id
        })
      );

      return self.store.get(id).run(ops, txIdCb);
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
