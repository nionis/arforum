import { types, flow } from "mobx-state-tree";
import arweave, { graphql } from "src/arweave";
import Votes from "src/models/Votes";
import History from "src/models/History";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import { getNow, randomId } from "src/utils";
import { forumId } from "src/env";

const Post = types
  .compose(
    "Post",
    Votes,
    History,
    types.model({
      id: types.identifier,
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

      const id = randomId();
      const updatedAt = getNow();
      const previousIds = [].concat(self.previousIds, [self.id]);

      const transaction: any = yield arweave.createTransaction(
        {
          data: JSON.stringify({
            id,
            title: self.title,
            text,
            previousIds,
            updatedAt,
            createdAt: self.createdAt
          })
        },
        user.jwk
      );

      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("appId", forumId);
      transaction.addTag("type", "post");
      transaction.addTag("category", self.id);
      transaction.addTag("id", id);
      transaction.addTag("createdAt", self.createdAt);
      transaction.addTag("updatedAt", updatedAt);

      console.log(transaction);

      return Transaction.create().run(transaction);
    })
  }));

export default Post;
