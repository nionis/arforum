import { types, flow } from "mobx-state-tree";
import user from "src/stores/user";
import arweave from "src/arweave";

const TransactionModel = types
  .model("Transaction", {
    status: types.optional(
      types.enumeration(["NONE", "PENDING", "SUCCESS", "FAILURE"]),
      "NONE"
    ),
    error: types.maybe(types.string)
  })
  .volatile(self => ({
    transaction: undefined
  }))
  .actions(self => ({
    update(updates: Partial<typeof self>) {
      for (let key in updates) {
        self[key] = updates[key];
      }
    },

    reset() {
      self.status = "NONE";
      self.transaction = undefined;
      self.error = undefined;
    }
  }))
  .actions(self => ({
    run: flow(function*(transaction: any) {
      self.reset();
      let response;

      try {
        if (!user.loggedIn) {
          throw Error("user is not logged in");
        }

        yield arweave.transactions.sign(transaction, user.jwk);

        self.update({
          status: "PENDING",
          transaction
        });

        response = yield arweave.transactions.post(transaction);
      } catch (err) {
        self.update({
          status: "FAILURE",
          transaction,
          error: err.toString()
        });
      }

      if (response.status === 200 || response.status === 208) {
        self.update({
          status: "PENDING",
          transaction
        });
      } else {
        self.update({
          status: "FAILURE",
          error: response.statusText,
          transaction
        });
      }

      // let status = response.status;
      // while (status !== 200) {
      //   status = yield arweave.transactions.getStatus(transaction.id);
      //   console.log("checking status");
      // }

      return self;
    })
  }));

export default TransactionModel;
