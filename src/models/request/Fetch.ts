/*
  A model which inherits from src/models/request/Request.ts.
  Provides sugar when fetching data from arweave.
  - fetch ids & tags using graphql
  - if toggled on, fetch content data using arql
  - return data
*/
import { types } from "mobx-state-tree";
import arweave, { graphql } from "src/arweave";
import Request from "src/models/request/Request";
import { ITxNormalized, IRunOps } from "src/models/request/types";

const Fetch = types
  .compose(
    "Fetch",
    Request,
    types.model({})
  )
  .actions(self => ({
    run: (ops: IRunOps) => {
      return self.track<ITxNormalized[]>(async () => {
        let txs: ITxNormalized[] = await graphql(ops.query, ops.variables)
          .then(ops.getTxs)
          .then(txs => {
            return txs.map(tx => {
              const tags: ITxNormalized["tags"] = (tx.tags || []).reduce(
                (result, tag) => {
                  result[tag.name] = tag.value;

                  return result;
                },
                {}
              );

              return {
                id: tx.id,
                tags
              };
            });
          });

        if (ops.fetchContent) {
          txs = await Promise.all(
            txs.map(tx => {
              return arweave.transactions.get(tx.id).then(async txData => {
                ops.type = ops.type || "json";

                const isBinary = ops.type === "binary";
                const shouldParse = ops.type === "json";

                let content = txData.get("data", {
                  decode: true,
                  string: !isBinary
                } as any) as any;

                if (shouldParse) {
                  content = JSON.parse(content);
                }

                return {
                  ...tx,
                  content
                };
              });
            })
          );
        }

        return txs;
      });
    }
  }));

export default Fetch;
