import { types, flow, Instance } from "mobx-state-tree";
import gql from "graphql-tag";
import Transaction from "src/models/Transaction";
import user from "src/stores/user";
import arweave, { graphql } from "src/arweave";
import { randomId, getNow } from "src/utils";
import { forumId } from "src/env";

const Vote = types.model("Vote", {
  id: types.identifier,
  type: types.enumeration(["UPVOTE", "DOWNVOTE"])
});

const Votes = types
  .model("Votes", {
    id: types.identifier,
    votes: types.map(Vote)
  })
  .views(self => ({
    get results() {
      const votes = Array.from(self.votes.values());

      return votes.reduce(
        (results, vote) => {
          if (vote.type === "UPVOTE") {
            results.upvotes++;
            results.voteScore++;
          } else if (vote.type === "DOWNVOTE") {
            results.downvotes++;
            results.voteScore--;
          }

          return results;
        },
        {
          voteScore: 0,
          upvotes: 0,
          downvotes: 0
        }
      );
    }
  }))
  .actions(self => ({
    getVotes: flow(function* getVotes() {
      const ids: string[] = yield graphql
        .query({
          query: gql`
            query Votes {
              transactions(
                tags: [
                  { name: "appId", value: "${forumId}" }
                  { name: "type", value: "vote" }
                  { name: "post", value: "${self.id}" }
                ]
              ) {
                id
              }
            }
          `
        })
        .then(res => res.data.transactions.map(tx => tx.id));

      const votes: any[] = yield Promise.all(
        ids.map(id => {
          return arweave.transactions.get(id).then(tx => {
            return JSON.parse(tx.get("data", { decode: true, string: true }));
          });
        })
      );

      votes.forEach(vote => {
        if (self.votes.has(vote.id)) return;

        self.votes.set(vote.id, Vote.create({ id: vote.id, type: vote.type }));
      });
    }),

    vote: flow(function* vote(type: Instance<typeof Vote>["type"]) {
      if (!user.loggedIn) {
        throw Error("user is not logged in");
      }

      const id = randomId();
      const now = getNow();

      const transaction: any = yield arweave.createTransaction(
        {
          data: JSON.stringify({
            id,
            post: self.id,
            type,
            updatedAt: now,
            createdAt: now
          })
        },
        user.jwk
      );

      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("appId", forumId);
      transaction.addTag("type", "vote");
      transaction.addTag("post", self.id);
      transaction.addTag("id", id);
      transaction.addTag("createdAt", now);
      transaction.addTag("updatedAt", now);

      console.log(transaction);

      return Transaction.create().run(transaction);
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.getVotes();
    }
  }));

export default Votes;
