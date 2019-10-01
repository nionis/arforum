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
import { IFetchResult, IRunOps } from "src/models/request/types";

const Fetch = types
  .compose(
    "Fetch",
    Request,
    types.model({})
  )
  .actions(self => ({
    run: <R>(ops: IRunOps) => {
      return self.track<IFetchResult<R>[]>(async () => {
        let data = await graphql(ops.query, ops.variables).then(ops.getData);

        // .then(txs => {
        //   return txs.map(tx => {
        //     const tags = (tx.tags || []).reduce((result, tag) => {
        //       result[tag.name] = tag.value;

        //       return result;
        //     }, {});

        //     return {
        //       ...tx,
        //       tags
        //     };
        //   });
        // });

        if (ops.fetchContent) {
          data = await Promise.all(
            data.map(data => {
              return arweave.transactions.get(data.id).then(async tx => {
                ops.type = ops.type || "json";

                const isBinary = ops.type === "binary";
                const shouldParse = ops.type === "json";

                let content = tx.get("data", {
                  decode: true,
                  string: !isBinary
                } as any) as any;

                if (shouldParse) {
                  content = JSON.parse(content);
                }

                return {
                  ...data,
                  content
                };
              });
            })
          );
        }

        return data;
      });
    }
  }));

export default Fetch;
