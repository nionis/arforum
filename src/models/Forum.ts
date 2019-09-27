import { types, flow } from "mobx-state-tree";
import gql from "graphql-tag";
import arweave, { graphql } from "src/arweave";
import Primitive from "src/models/Primitive";
import Category from "src/models/Category";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { getNow, addTags } from "src/utils";
import { forumId } from "src/env";

const Forum = types
  .compose(
    "Forum",
    Primitive,
    types.model({
      categories: types.map(Category)
    })
  )
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

      const categories: any[] = yield Promise.all(
        ids.map(id => {
          return arweave.transactions.get(id).then(async tx => {
            const owner = tx.get("owner");
            const from = await arweave.wallets.ownerToAddress(owner);

            const data = JSON.parse(
              tx.get("data", { decode: true, string: true })
            );

            return {
              ...data,
              from
            };
          });
        })
      );

      categories.forEach(cat => {
        if (self.categories.has(cat.id)) return;

        try {
          self.categories.set(cat.id, Category.create(cat));
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createCategory: flow(function* createCategory(name: string) {
      if (!user.loggedIn) {
        throw Error("user is not logged in");
      }

      const id = name;
      const now = getNow();

      const transaction: any = yield arweave
        .createTransaction(
          {
            data: JSON.stringify({
              id,
              updatedAt: now,
              createdAt: now
            })
          },
          user.jwk
        )
        .then(tx => {
          return addTags(tx, {
            type: "category",
            id,
            updatedAt: now,
            createdAt: now
          });
        });

      return Transaction.create().run(transaction);
    })
  }));

export default Forum;
