/*
  A model which inherits from src/models/request/Request.ts.
  Provides sugar when fetching data from arweave.
  - fetch ids & tags using graphql
  - if toggled on, fetch content data using arql
  - return data
*/
import { types } from "mobx-state-tree";
import arweave from "src/arweave";
import Request from "src/models/request/Request";
import { IFetchResult, IRunOps } from "src/models/request/types";
import seq from "promise-sequential";

const Fetch = types
  .compose(
    "Fetch",
    Request,
    types.model({})
  )
  .actions(self => ({
    run: <R>(ops: IRunOps) => {
      return self.track<IFetchResult<R>[]>(async () => {
        const ids = await arweave.arql(ops.query);

        const data: any[] = await seq(
          ids.map(id => () => {
            return arweave.transactions.get(id).then(async tx => {
              const from = await arweave.wallets.ownerToAddress(
                tx.get("owner")
              );

              const tags = {
                from
              };
              (tx.get("tags") as any).forEach(tag => {
                const key = tag.get("name", { decode: true, string: true });
                const value = tag.get("value", { decode: true, string: true });

                tags[key] = value;
              });

              const contentRaw = tx.get("data", {
                decode: true,
                string: true
              } as any) as any;

              const content =
                ops.contentType === "application/json"
                  ? JSON.parse(contentRaw)
                  : contentRaw;

              return {
                id,
                content,
                tags
              };
            });
          })
        );

        return data;
      });
    }
  }));

export default Fetch;
