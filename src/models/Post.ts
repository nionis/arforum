import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import fetches from "src/stores/fetches";
import HasOwner from "src/models/HasOwner";
import User from "src/models/User";
import Votes from "src/models/Votes";
import Editable from "src/models/Editable";
import Comment from "src/models/Comment";
import Transaction from "src/models/request/Transaction";
import { getNow, comment as tfComment, post as tfPost } from "src/utils";
import { appId } from "src/env";

const Post = types
  .compose(
    "Post",
    Primitive,
    HasOwner,
    Votes,
    Editable,
    types.model({
      category: types.string,
      title: "",
      text: "",
      comments: types.map(Comment),
      commentsCountRemote: 0
    })
  )
  .views(self => ({
    get commentsCount() {
      return self.comments.size || self.commentsCountRemote;
    }
  }))
  .actions(self => ({
    updateText: flow(function* updateText(text: string) {
      const now = getNow();
      const editOf = self.id;

      Transaction.create().run(
        tfPost.toTransaction({
          title: self.title,
          text,
          editOf,
          createdAt: now,
          category: self.category
        })
      );
    }),

    getComments: flow(function* getComments() {
      const commentsRaw: any[] = yield fetches.add({
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
        getData: res => res.data.transactions,
        fetchContent: true,
        type: "text"
      });

      const comments = commentsRaw.map(tfComment.fromTransaction);

      comments.forEach(comment => {
        try {
          self.comments.set(
            comment.id,
            Comment.create({
              ...comment,
              from: User.create({ id: comment.from }) as any
            })
          );
        } catch (err) {
          console.error(err);
        }
      });
    }),

    createComment: flow(function* createComment(text: string) {
      const now = getNow();

      return Transaction.create().run(
        tfComment.toTransaction({
          text,
          createdAt: now,
          post: self.id,
          editOf: undefined,
          replyOf: undefined
        })
      );
    })
  }));

export default Post;
