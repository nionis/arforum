import { types, flow } from "mobx-state-tree";
import Category from "src/models/Category";
import User from "src/models/User";
import Post from "src/models/Post";
import transactions from "src/stores/transactions";
import fetches from "src/stores/fetches";
import {
  id,
  getNow,
  Reference,
  category as tfCategory,
  toMs,
  queryApp,
  timestamps
} from "src/utils";

const Forum = types
  .model({
    id,
    categories: types.map(Reference(Category))
  })
  .actions(self => ({
    shallowFetch: flow(function* shallowFetch() {
      const {
        categories,
        posts
      }: {
        categories: any[];
        posts: any[];
      } = yield fetches.add({
        query: `
          query Categories {
            transactions(
              tags: [
                ${queryApp}
                { name: "type", value: "category" }
              ]
            ) {
              id
              name: tagValue(tagName: "name")

              posts: linkedFromTransactions(byForeignTag: "category", tags: [
                ${queryApp}
                { name: "type", value: "post" }
              ]) {
                id
                from: tagValue(tagName: "from")
                title: tagValue(tagName: "title")
                ${timestamps}

                commentsCount: countLinkedFromTransactions(byForeignTag: "post", tags: [
                  ${queryApp}
                  { name: "type", value: "comment" }
                ])
              }
            }
          }
        `,
        getData: res => {
          const data: any[] = res.data.transactions;

          const categories = data.map(category => ({
            id: category.id,
            name: category.name
          }));

          const posts = data.reduce((result, category) => {
            result = result.concat(
              category.posts.map(post => ({
                category: category.id,
                ...post
              }))
            );

            return result;
          }, []);

          return {
            categories,
            posts
          };
        },
        fetchContent: false,
        type: "json"
      });

      categories.forEach(category => {
        try {
          if (!self.categories.has(category.id)) {
            self.categories.set(
              category.id,
              Category.create({
                id: category.id,
                name: category.name
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      });

      posts.forEach(post => {
        try {
          const category = self.categories.get(post.category);

          if (!category.posts.has(post.id)) {
            const postStore = Post.create({
              id: post.id,
              title: post.title,
              category: post.category,
              commentsCountRemote: post.commentsCount,
              from: User.create({
                id: post.from
              }) as any,
              createdAt: toMs(post)
            });

            category.setPost(postStore);

            postStore.from.getUsername();
          }
        } catch (err) {
          console.error(err);
        }
      });
    }),

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
        })
      );
    })
  }));

export default Forum;
