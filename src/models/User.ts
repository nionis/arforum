import { when } from "mobx";
import { types, flow } from "mobx-state-tree";
import { maxBy } from "lodash";
import fetches from "src/stores/fetches";
import { id } from "src/utils";

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
      console.log("getUsername", self.address);

      const items: any[] = yield fetches
        .add({
          query: `
            query Votes {
              transactions(
                tags: [
                  { name: "App-Name", value: "arweave-id" }
                  { name: "from", value: "${self.address}" }
                  { name: "Type", value: "name" }
                ]
              ) {
                id
                tags {
                  name
                  value
                }
              }
            }
          `,
          getTxs: res => res.data.transactions,
          type: "text",
          fetchContent: true
        })
        .then((items: any) => {
          console.log(items);
          return (items || []).map(item => {
            return {
              name: item.content,
              createdAt: Number(item.tags["Unix-Time"])
            };
          });
        });

      const item = maxBy(items, o => o.createdAt);
      console.log("getUsername", item);

      if (item) {
        self.username = item.name;
      }
    })
  }))
  .actions(self => ({
    afterCreate() {
      if (self.address) {
        self.getUsername();
      } else {
        const dispatch = when(
          () => !!self.address,
          () => {
            self.getUsername().then(() => dispatch());
          }
        );
      }
    }
  }));

export default User;
