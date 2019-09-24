import { types, flow } from "mobx-state-tree";
import gql from "graphql-tag";
import Category from "src/models/Category";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import arweave, { graphql } from "src/arweave";
import { getNow } from "src/utils";
import { forumId } from "src/env";

const Forum = types
  .model("Forum", {
    id: types.identifier,
    categories: types.map(Category)
  })
  .actions(self => ({
    getCategories: flow(function* getCategories() {
      const ids: string[] = yield graphql
        .query({
          query: gql`
            query Categories {
              transactions(
                tags: [
                  { name: "appId", value: "${forumId}" }
                  { name: "type", value: "category" }
                ]
              ) {
                id
              }
            }
          `
        })
        .then(res => res.data.transactions.map(tx => tx.id));

      // TODO: throttle
      const categories: any[] = yield Promise.all(
        ids.map(id => {
          return arweave.transactions.get(id).then(tx => {
            return JSON.parse(tx.get("data", { decode: true, string: true }));
          });
        })
      );

      categories.forEach(cat => {
        if (self.categories.has(cat.id)) return;

        self.categories.set(cat.id, Category.create({ id: cat.id }));
      });
    }),

    createCategory: flow(function* createCategory(name: string) {
      if (!user.loggedIn) {
        throw Error("user is not logged in");
      }

      const id = name;
      const now = getNow();

      const transaction: any = yield arweave.createTransaction(
        {
          data: JSON.stringify({
            id,
            updatedAt: now,
            createdAt: now
          })
        },
        user.jwk
      );

      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("appId", forumId);
      transaction.addTag("type", "category");
      transaction.addTag("id", id);
      transaction.addTag("createdAt", now);
      transaction.addTag("updatedAt", now);

      console.log(transaction);

      return Transaction.create().run(transaction);
    })
  }));

export default Forum;
