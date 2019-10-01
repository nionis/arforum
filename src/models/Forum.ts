import { types, flow } from "mobx-state-tree";
import Transaction from "src/models/request/Transaction";
import Category from "src/models/Category";
import User from "src/models/User";
import fetches from "src/stores/fetches";
import { id, getNow, Reference, category as tfCategory } from "src/utils";
import { appId, environment } from "src/env";

const Forum = types
  .model({
    id,
    categories: types.map(Reference(Category))
  })
  .actions(self => ({
    getCategories: flow(function* getCategories({
      categoryId,
      month
    }: {
      categoryId?: string;
      month?: number;
    }) {
      const singleCategoryQuery = categoryId
        ? `{ name: "id", value: "${categoryId}" }`
        : "";

      const specificMonth =
        typeof month !== "undefined"
          ? `{ name: "months", value: "${month}" }`
          : "";

      const categoriesRaw: any[] = yield fetches.add({
        query: `
          query Categories {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "environment", value: "${environment}" }
                { name: "type", value: "category" }
                ${singleCategoryQuery}
                ${specificMonth}
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
          createdAt: now
        })
      );
    })
  }));

export default Forum;
