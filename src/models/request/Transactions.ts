/*
  Keeps track of transactions
*/
import { types, flow } from "mobx-state-tree";
import TransactionModel from "src/models/request/Transaction";
import { randomId, Reference, ITransactionObject } from "src/utils";

const Transactions = types
  .model("Transactions", {
    store: types.map(Reference(TransactionModel))
  })
  .actions(self => ({
    add: flow(function* flow(ops: ITransactionObject<any>) {
      const id = randomId();

      self.store.set(id, TransactionModel.create());

      return self.store.get(id).run(ops);
    }),

    remove(id: string) {
      self.store.delete(id);
    }
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
