/*
  Keeps track of transactions
*/
import { types, flow } from "mobx-state-tree";
import TransactionModel from "src/models/request/Transaction";
import cache from "src/stores/cache";
import { Reference, ITransactionResult } from "src/utils";
import { ITransactionOps } from "src/models/request/types";

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
      data: ITransactionResult<any, any>,
      ops: ITransactionOps & {
        title?: string;
      } = {}
    ) {
      const id = String(++self.latestId);

      self.store.set(
        id,
        TransactionModel.create({
          id,
          title: ops.title
        })
      );

      return self.store.get(id).run(data, ops);
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
