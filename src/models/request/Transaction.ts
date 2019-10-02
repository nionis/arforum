/*
  A model which inherits from src/models/request/Request.ts.
  Provides sugar when making a transaction.
  - create transaction
  - add tags
  - sign transaction
  - post transaction
  - handles second transaction when first is still pending
  - wait until its mined / fails
*/
import { types } from "mobx-state-tree";
import TransactionType from "arweave/web/lib/transaction";
import { forEach } from "lodash";
import Request from "src/models/request/Request";
import account from "src/stores/account";
import arweave from "src/arweave";
import { wait, ITags, ITransactionResult } from "src/utils";
import { ITransactionOps } from "src/models/request/types";

const goodStatusCodes = [200, 202, 208];

const Transaction = types
  .compose(
    "Transaction",
    Request,
    types.model({
      title: ""
    })
  )
  .actions(self => ({
    run: <T extends ITags>(
      data: ITransactionResult<T, any>,
      ops: ITransactionOps = {}
    ) => {
      return self.track(async () => {
        let response;
        let transaction: TransactionType | undefined;

        if (!account.loggedIn) {
          throw Error("user is not logged in");
        }

        try {
          transaction = await arweave
            .createTransaction(
              {
                data: data.content || " ",
                target: ops.target,
                quantity: ops.quantity,
                reward: ops.reward
              },
              account.jwk
            )
            .then(tx => {
              forEach(data.tags, (val, key) => {
                tx.addTag(key, val);
              });

              return tx;
            });

          const anchor_id = await arweave.api
            .get("/tx_anchor")
            .then(res => res.data);

          (transaction.last_tx as string) = anchor_id;

          await arweave.transactions.sign(transaction, account.jwk);

          response = await arweave.transactions.post(transaction);
        } catch (err) {
          throw Error(err);
        }

        if (!goodStatusCodes.includes(response.status)) {
          throw Error("couldn't post transaction");
        }

        if (ops.txIdCb) {
          ops.txIdCb(transaction.id);
        }

        let confirmed = 0;
        let runsWithError = 0;
        while (confirmed === 0 && runsWithError < 10) {
          await wait(5e3);
          await arweave.transactions
            .getStatus(transaction.id)
            .then(res => {
              if (!goodStatusCodes.includes(res.status)) {
                runsWithError++;
              } else if (res.confirmed) {
                confirmed = res.confirmed.number_of_confirmations;
              }
            })
            .catch(err => {
              console.error(err);
              runsWithError++;
            });
        }

        if (confirmed === 0) {
          throw Error("checking status failed multiple times");
        } else {
          return transaction;
        }
      });
    }
  }));

export default Transaction;
