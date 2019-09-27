import { types, flow } from "mobx-state-tree";
import arweave from "src/arweave";
import Primitive from "src/models/Primitive";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { getNow, addTags } from "src/utils";

const Comment = types
  .compose(
    "Comment",
    Primitive,
    Votes,
    History,
    types.model({
      postId: types.maybe(types.string),
      text: types.maybe(types.string),
      replies: types.array(types.reference(types.late(() => Comment)))
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
            type: "comment",
            post: self.postId,
            id: self.id,
            createdAt: self.createdAt,
            updatedAt: updatedAt
          });
        });

      return Transaction.create().run(transaction);
    })
  }));

export default Comment;
