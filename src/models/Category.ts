import { types, flow, Instance } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Post from "src/models/Post";
import fetches from "src/stores/fetches";
import transactions from "src/stores/transactions";
import { getNow, Reference, post as tfPost } from "src/utils";
import { appId } from "src/env";

const Category = types
  .compose(
    "Category",
    Primitive,
    HasOwner,
    types.model({
      name: "",
      description: "",
      posts: types.map(Reference(Post))
    })
  )
  .views(self => ({
    displayName() {
      return self.name || `${self.id.substring(0, 4)}..`;
    }
  }))
  .actions(self => ({
    setPost(post: Instance<typeof Post>) {
      self.posts.set(post.id, post);

      return self.posts.get(post.id);
    }
  }))

  .actions(self => ({
    getPosts: flow(function* getPosts({
      shallow,
      month
    }: {
      shallow: boolean;
      month?: number;
    }) {
      const specificMonth =
        typeof month !== "undefined"
          ? `{ name: "months", value: "${month}" }`
          : "";

      const postsRaw: any[] = yield fetches.add({
        query: `
          query Posts {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "type", value: "post" }
                { name: "category", value: "${self.id}" }
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
        getData: res => res.data.transactions,
        fetchContent: !shallow,
        type: "text"
      });

      const posts = postsRaw.map(tfPost.fromTransaction);

      posts.forEach(post => {
        try {
          self.posts.set(
            post.id,
            Post.create({
              ...post,
              from: User.create({ id: post.from }) as any
            })
          );
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createPost: flow(function* createPost(title: string, text: string) {
      const now = getNow();

      transactions.add(
        tfPost.toTransaction({
          title,
          text,
          createdAt: now,
          category: self.id,
          editOf: undefined
        })
      );
    })
  }));

export default Category;
