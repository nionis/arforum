import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import Fetch from "src/models/request/Fetch";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Comment from "src/models/Comment";
import Transaction from "src/models/request/Transaction";
import { randomId, getNow, comment as tfComment, comment } from "src/utils";
import { appId } from "src/env";

const Post = types
  .compose(
    "Post",
    Primitive,
    HasOwner,
    Votes,
    History,
    types.model({
      category: types.string,
      title: "",
      text: "",
      comments: types.map(Comment)
    })
  )
  .actions(self => ({
    updateText: flow(function* updateText(text: string) {
      const updatedAt = getNow();
      const previousIds = [].concat(self.previousIds, [self.id]);

      // return Transaction.create().run(
      //   {
      //     id: self.id,
      //     title: self.title,
      //     text,
      //     previousIds,
      //     updatedAt,
      //     createdAt: self.createdAt
      //   },
      //   {
      //     type: "post",
      //     category: self.categoryId,
      //     id: self.id,
      //     createdAt: self.createdAt,
      //     updatedAt: updatedAt
      //   }
      // );
    }),

    getComments: flow(function* getComments() {
      const commentsRaw: any[] = yield Fetch.create().run({
        query: `
          query Comments {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "type", value: "comment" }
                { name: "post", value: "${self.id}" }
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

      const comments = commentsRaw.map(tfComment.fromTransaction);

      comments.forEach(comment => {
        try {
          if (self.comments.has(comment.id)) {
            const _comment = self.comments.get(comment.id);

            if (_comment.updatedAt > comment.updatedAt) return;
          } else {
            self.comments.set(
              comment.id,
              Comment.create({
                ...comment,
                from: User.create({ id: comment.from }) as any
              })
            );
          }
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createComment: flow(function* createComment(text: string) {
      const id = randomId();
      const now = getNow();

      return Transaction.create().run(
        tfComment.toTransaction({
          id,
          text,
          updatedAt: now,
          createdAt: now,
          post: self.id
        })
      );
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.getComments();
    }
  }));

export default Post;
