import { types, flow } from "mobx-state-tree";
import gql from "graphql-tag";
import arweave, { graphql } from "src/arweave";
import Primitive from "src/models/Primitive";
import Post from "src/models/Post";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { randomId, getNow, addTags } from "src/utils";
import { forumId } from "src/env";

const Category = types
  .compose(
    "Category",
    Primitive,
    types.model({
      posts: types.map(Post)
    })
  )
  .views(self => ({
    get name() {
      return self.id;
    }
  }))
  .actions(self => ({
    getPosts: flow(function* getPosts() {
      const ids: string[] = yield graphql
        .query({
          query: gql`
            query Posts {
              transactions(
                tags: [
                  { name: "appId", value: "${forumId}" }
                  { name: "type", value: "post" }
                  { name: "category", value: "${self.id}" }
                ]
              ) {
                id
              }
            }
          `
        })
        .then(res => res.data.transactions.map(tx => tx.id));

      const posts: any[] = yield Promise.all(
        ids.map(id => {
          return arweave.transactions.get(id).then(tx => {
            return JSON.parse(tx.get("data", { decode: true, string: true }));
          });
        })
      );

      posts.forEach(post => {
        try {
          if (self.posts.has(post.id)) {
            const _post = self.posts.get(post.id);

            if (_post.updatedAt > post.updateAt) return;
          } else {
            self.posts.set(
              post.id,
              Post.create({
                ...post,
                categoryId: self.id
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createPost: flow(function* createPost(title: string, text: string) {
      if (!user.loggedIn) {
        throw Error("user is not logged in");
      }

      const id = randomId();
      const now = getNow();

      const transaction: any = yield arweave
        .createTransaction(
          {
            data: JSON.stringify({
              id,
              title,
              text,
              previousIds: [],
              updatedAt: now,
              createdAt: now
            })
          },
          user.jwk
        )
        .then(tx => {
          return addTags(tx, {
            type: "post",
            category: self.id,
            id,
            createdAt: now,
            updatedAt: now
          });
        });

      return Transaction.create().run(transaction);
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.getPosts();
    }
  }));

export default Category;
