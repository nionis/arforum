import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";
import Votes from "src/models/Votes";
import Transaction from "src/models/request/Transaction";
import Editable from "src/models/Editable";
import { getNow, comment as tfComment } from "src/utils";

const Comment = types
  .compose(
    "Comment",
    Primitive,
    HasOwner,
    Votes,
    Editable,
    types
      .model({
        post: types.string,
        replyOf: types.maybe(types.string)
      })
      .volatile(self => ({
        content: undefined
      }))
  )
  .actions(self => ({
    updateContent: flow(function* updateContent(content: any) {
      const now = getNow();
      const editOf = self.id;

      Transaction.create().run(
        tfComment.toTransaction({
          content,
          createdAt: now,
          post: self.id,
          editOf: editOf,
          replyOf: undefined
        })
      );
    }),

    reply: flow(function* reply(content: any) {
      const now = getNow();

      Transaction.create().run(
        tfComment.toTransaction({
          content,
          createdAt: now,
          post: self.post,
          editOf: undefined,
          replyOf: self.id
        })
      );
    })
  }));

export default Comment;
