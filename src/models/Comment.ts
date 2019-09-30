import { types, flow } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import HasOwner from "src/models/HasOwner";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Transaction from "src/models/request/Transaction";
import account from "src/stores/account";
import { getNow } from "src/utils";

const Comment = types
  .compose(
    "Comment",
    Primitive,
    HasOwner,
    Votes,
    History,
    types.model({
      post: types.string,
      text: ""
      // replies: types.array(types.reference(types.late(() => Comment)))
    })
  )
  .actions(self => ({
    updateText: flow(function* updateText(text: string) {
      if (!account.loggedIn) {
        throw Error("user is not logged in");
      }

      const updatedAt = getNow();
      const previousIds = [].concat(self.previousIds, [self.id]);

      // return Transaction.create().run(
      //   JSON.stringify({
      //     id: self.id,
      //     text,
      //     previousIds,
      //     updatedAt,
      //     createdAt: self.createdAt
      //   }),
      //   {
      //     type: "comment",
      //     post: self.postId,
      //     id: self.id,
      //     createdAt: self.createdAt,
      //     updatedAt: updatedAt
      //   }
      // );
    })
  }));

export default Comment;
