import { types, flow } from "mobx-state-tree";
import gql from "graphql-tag";
import arweave, { graphql } from "src/arweave";
import Primitive from "src/models/Primitive";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Comment from "src/models/Comment";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { randomId, getNow, addTags } from "src/utils";
import { forumId } from "src/env";

const Post = types
  .compose(
    "Post",
    Primitive,
    Votes,
    History,
    types.model({
      categoryId: types.maybe(types.string),
      title: types.maybe(types.string),
      text: types.maybe(types.string),
      comments: types.map(Comment)
    })
  )
  .actions(self => ({
    updateText: flow(function* updateText(text: string) {
      if (!user.loggedIn) {
        throw Error("user is not logged in");
      }

      const updatedAt = getNow();
      const previousIds = [].concat(self.previousIds, [self.id]);

      const transaction: any = yield arweave
        .createTransaction(
          {
            data: JSON.stringify({
              id: self.id,
              title: self.title,
              text,
              previousIds,
              updatedAt,
              createdAt: self.createdAt
            })
          },
          user.jwk
        )
        .then(tx => {
          return addTags(tx, {
            type: "post",
            category: self.categoryId,
            id: self.id,
            createdAt: self.createdAt,
            updatedAt: updatedAt
          });
        });

      return Transaction.create().run(transaction);
    }),

    getComments: flow(function* getComments() {
      const ids: string[] = yield graphql
        .query({
          query: gql`
            query Comments {
              transactions(
                tags: [
                  { name: "appId", value: "${forumId}" }
                  { name: "type", value: "comment" }
                  { name: "post", value: "${self.id}" }
                ]
              ) {
                id
              }
            }
          `
        })
        .then(res => res.data.transactions.map(tx => tx.id));

      const comments: any[] = yield Promise.all(
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

      comments.forEach(comment => {
        try {
          if (self.comments.has(comment.id)) {
            const _comment = self.comments.get(comment.id);

            if (_comment.updatedAt > comment.updateAt) return;
          } else {
            self.comments.set(
              comment.id,
              Comment.create({
                ...comment,
                post: self.id
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createComment: flow(function* createComment(text: string) {
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
            type: "comment",
            post: self.id,
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
      self.getComments();
    }
  }));

export default Post;
