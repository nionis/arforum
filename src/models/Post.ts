import { types, flow } from "mobx-state-tree";
import arweave from "src/arweave";
import Primitive from "src/models/Primitive";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { getNow, randomId, addTags } from "src/utils";

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
      createdAt: types.maybe(types.number),
      updatedAt: types.maybe(types.number)
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
    })
  }));

export default Post;
