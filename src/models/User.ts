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
      const items: any[] = yield fetches
        .add({
          query: `
            query Names {
              transactions(
                tags: [
                  { name: "App-Name", value: "arweave-id" }
                  { name: "from", value: "${self.address}" }
                  { name: "modelType", value: "name" }
                ]
              ) {
                id
                unixTime: tagValue(tagName: "Unix-Time")
              }
            }
          `,
          getData: res => res.data.transactions,
          type: "text",
          fetchContent: true
        })
        .then((items: any) => {
          return (items || []).map(item => {
            return {
              name: item.content,
              createdAt: Number(item.unixTime)
            };
          });
        });

      const item = maxBy(items, o => o.createdAt);

      if (item) {
        self.username = item.name;
      }
    })
  }));

export default User;
