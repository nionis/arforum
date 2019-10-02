import { when } from "mobx";
import { types, flow } from "mobx-state-tree";
import { maxBy } from "lodash";
import fetches from "src/stores/fetches";
import { id, toTiny } from "src/utils";

const User = types
  .model("User", {
    id,
    username: types.maybe(types.string)
  })
  .views(self => ({
    get address() {
      return self.id;
    }
  }))
  .views(self => ({
    get displayName() {
      return self.username || toTiny(self.address) || "not found";
    }
  }))
  .actions(self => ({
    getUsername: flow(function* getUsername() {
      const names: any[] = yield fetches.add({
        query: {
          op: "and",
          expr1: {
            op: "equals",
            expr1: "App-Name",
            expr2: "arweave-id"
          },
          expr2: {
            op: "and",
            expr1: {
              op: "equals",
              expr1: "Type",
              expr2: "name"
            },
            expr2: {
              op: "equals",
              expr1: "from",
              expr2: self.address
            }
          }
        },
        contentType: "text/plain"
      });

      const item = maxBy(names, o => Number(o.tags["Unix-Time"]));

      if (item) {
        self.username = item.content;
      }
    })
  }));

export default User;
