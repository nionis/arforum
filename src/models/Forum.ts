import { types, flow } from "mobx-state-tree";
import Transaction from "src/models/request/Transaction";
import Fetch from "src/models/request/Fetch";
import Category from "src/models/Category";
import {
  id,
  getNow,
  Reference,
  category as tfCategory,
  category
} from "src/utils";
import { appId, environment } from "src/env";
import User from "./User";

const Forum = types
  .model({
    id,
    categories: types.map(Reference(Category))
  })
  .actions(self => ({
    getCategories: flow(function* getCategories({
      categoryId
    }: {
      categoryId?: string;
    }) {
      const singleCategoryQuery = categoryId
        ? `{ name: "id", value: "${categoryId}" }`
        : "";

      const categoriesRaw: any[] = yield Fetch.create().run({
        query: `
          query Categories {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "environment", value: "${environment}" }
                { name: "type", value: "category" }
                ${singleCategoryQuery}
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
        fetchContent: false,
        type: "text"
      });

      const categories = categoriesRaw.map(tfCategory.fromTransaction);

      if (!categories) return;

      categories.forEach(cat => {
        if (self.categories.has(cat.id)) return;

        try {
          self.categories.set(
            cat.id,
            Category.create({
              ...cat,
              from: User.create({ id: cat.from }) as any
            })
          );
        } catch (err) {
          console.error(err);
        }

        return categories;
      });
    }),

    createCategory: flow(function* createCategory(name: string) {
      const id = name;
      const now = getNow();

      return Transaction.create().run(
        tfCategory.toTransaction({
          id,
          description: "",
          updatedAt: now,
          createdAt: now
        })
      );
    })
  }));

export default Forum;
