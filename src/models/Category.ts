import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import Fetch from "src/models/request/Fetch";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Post from "src/models/Post";
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
      const postsRaw: any[] = yield Fetch.create().run({
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
          if (self.posts.has(post.id)) {
            const _post = self.posts.get(post.id);

            if (_post.updatedAt > post.updatedAt) return;
          } else {
            self.posts.set(
              post.id,
              Post.create({
                ...post,
                from: User.create({ id: post.from }) as any
              })
            );
          }
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
          updatedAt: now,
          category: self.id
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
