import { when } from "mobx";
import { types, flow } from "mobx-state-tree";
import { maxBy } from "lodash";
import arweave from "src/arweave";

const User = types
  .model("User", {
    address: types.maybe(types.string),
    username: types.maybe(types.string)
  })
  .views(self => ({
    get tinyAddress() {
      if (!self.address) return "";

      return `${self.address.substring(0, 4)}..`;
    }
  }))
  .views(self => ({
    get displayName() {
      return self.username || self.tinyAddress || "not found";
    }
  }))
  .actions(self => ({
    getUsername: flow(function* getUsername() {
      const ids: string[] = yield arweave.arql({
        op: "and",
        expr1: {
          op: "equals",
          expr1: "App-Name",
          expr2: "arweave-id"
        },
        expr2: {
          op: "equals",
          expr1: "from",
          expr2: self.address
        },
        expr3: {
          op: "equals",
          expr1: "Type",
          expr2: "Name"
        }
      });

      const items: any[] = yield Promise.all(
        ids.map(id => {
          return arweave.transactions.get(id).then(tx => {
            const name = tx.get("data", { decode: true, string: true });
            const tags = tx.tags.map(tag => {
              const key = tag.get("name", { decode: true, string: true });
              const value = tag.get("value", { decode: true, string: true });

              return {
                key,
                value
              };
            });

            const createdAtTag = tags.find(tag => tag.key === "Unix-Time") || {
              value: 0
            };

            return {
              name,
              createdAt: createdAtTag.value
            };
          });
        })
      );

      const item = maxBy(items, o => Number(o.createdAt));

      if (item) {
        self.username = item.name;
      }
    })
  }))
  .actions(self => ({
    afterCreate() {
      when(() => !!self.address, self.getUsername);
    }
  }));

export default User;
