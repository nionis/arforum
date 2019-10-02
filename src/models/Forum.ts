import { types, flow, Instance } from "mobx-state-tree";
import Category from "src/models/Category";
import User from "src/models/User";
import Request from "src/models/request/Request";
import Post from "src/models/Post";
import transactions from "src/stores/transactions";
import seq from "promise-sequential";
import fetches from "src/stores/fetches";
import {
  id,
  getNow,
  Reference,
  category as tfCategory,
  post as tfPost
} from "src/utils";
import { appId } from "src/env";

const Forum = types
  .model({
    id,
    fCategories: types.optional(Request, {}),
    fPosts: types.optional(Request, {}),
    categories: types.map(Reference(Category))
  })
  .actions(self => ({
    setCategory(category: Instance<typeof Category>) {
      self.categories.set(category.id, category);
    }
  }))
  .actions(self => ({
    quickFetch: async () => {
      await self.fCategories.track(async () => {
        const categories: any[] = (await fetches.add({
          query: {
            op: "and",
            expr1: {
              op: "equals",
              expr1: "appId",
              expr2: appId
            },
            expr2: {
              op: "equals",
              expr1: "modelType",
              expr2: "category"
            }
          },
          contentType: "application/json"
        })) as any;

        categories.forEach(category => {
          try {
            if (!self.categories.has(category.id)) {
              const normalized = tfCategory.fromTransaction(category);

              self.setCategory(
                Category.create({
                  ...normalized,
                  from: User.create({
                    id: normalized.from
                  }) as any
                })
              );
            }
          } catch (err) {
            console.error(err);
          }
        });

        return categories;
      });

      await self.fPosts.track(async () => {
        const posts: any[] = (await fetches.add({
          query: {
            op: "and",
            expr1: {
              op: "equals",
              expr1: "appId",
              expr2: appId
            },
            expr2: {
              op: "equals",
              expr1: "modelType",
              expr2: "post"
            }
          },
          contentType: "application/json"
        })) as any;

        posts.forEach(post => {
          try {
            const normalized = tfPost.fromTransaction(post);
            const category = self.categories.get(normalized.category);

            if (!category.posts.has(normalized.id)) {
              category.setPost(
                Post.create({
                  ...normalized,
                  from: User.create({
                    id: normalized.from
                  }) as any
                })
              );
            }

            const store = category.posts.get(normalized.id);

            store.setContent(normalized.content);
            store.from.getUsername();
          } catch (err) {
            console.error(err);
          }
        });

        return posts;
      });
    },

    postFetch: async () => {
      const posts = Array.from(self.categories.values()).reduce(
        (result, category) => {
          const posts = Array.from(category.posts.values());

          result = result.concat(posts);

          return result;
        },
        []
      );

      return seq(posts.map(post => post.quickFetch));
    },

    createCategory: flow(function* createCategory(
      name: string,
      description: string
    ) {
      const now = getNow();

      transactions.add(
        tfCategory.toTransaction({
          name,
          description,
          createdAt: now
        }),
        {
          title: "category"
        }
      );
    })
  }));

export default Forum;
