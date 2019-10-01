import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Post from "src/models/Post";
import fetches from "src/stores/fetches";
import Transaction from "src/models/request/Transaction";
import { randomId, getNow, Reference, post as tfPost } from "src/utils";
import { appId } from "src/env";

const Category = types
  .compose(
    "Category",
    Primitive,
    HasOwner,
    types.model({
      description: "",
      posts: types.map(Reference(Post))
    })
  )
  .views(self => ({
    get name() {
      return self.id;
    }
  }))
  .actions(self => ({
    getPosts: flow(function* getPosts() {
      const postsRaw: any[] = yield fetches.add({
        query: `
          query Posts {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "type", value: "post" }
                { name: "category", value: "${self.id}" }
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
        fetchContent: true,
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
      const id = randomId();
      const now = getNow();

      return Transaction.create().run(
        tfPost.toTransaction({
          id,
          title,
          text,
          createdAt: now,
          category: self.id,
          editOf: undefined
        })
      );
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.getPosts();
    }
  }));

export default Category;
