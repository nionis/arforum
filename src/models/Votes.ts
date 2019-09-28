import { types, flow, Instance } from "mobx-state-tree";
import gql from "graphql-tag";
import arweave, { graphql } from "src/arweave";
import Primitive from "src/models/Primitive";
import Transaction from "src/models/Transaction";
import account from "src/stores/account";
import { randomId, getNow, addTags, pickLatest } from "src/utils";
import { forumId } from "src/env";

const Vote = types.compose(
  "Vote",
  Primitive,
  types.model({
    id: types.identifier,
    type: types.enumeration(["upvote", "downvote"])
  })
);

const Votes = types
  .compose(
    "Votes",
    Primitive,
    types.model("Votes", {
      votes: types.map(Vote)
    })
  )
  .views(self => ({
    get results() {
      const votes = Array.from(self.votes.values());

      return votes.reduce(
        (results, vote) => {
          if (vote.type === "upvote") {
            results.upvotes++;
            results.voteScore++;
          } else if (vote.type === "downvote") {
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
    },

    get usersVote(): Instance<typeof Vote> | undefined {
      const votes = Array.from(self.votes.values()).filter(vote => {
        return vote.from.address === account.address;
      });

      if (!votes.length) return undefined;

      return pickLatest(votes)[0];
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
                  { name: "item", value: "${self.id}" }
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

      votes.forEach(vote => {
        if (self.votes.has(vote.id)) return;

        try {
          self.votes.set(
            vote.id,
            Vote.create({
              ...vote,
              from: { address: vote.from }
            })
          );
        } catch (err) {
          console.error(err);
        }
      });
    }),

    vote: flow(function* vote(type: Instance<typeof Vote>["type"]) {
      if (!account.loggedIn) {
        throw Error("user is not logged in");
      }

      const id = randomId();
      const now = getNow();

      const transaction: any = yield arweave
        .createTransaction(
          {
            data: JSON.stringify({
              id,
              item: self.id,
              type,
              updatedAt: now,
              createdAt: now
            })
          },
          account.jwk
        )
        .then(tx => {
          return addTags(tx, {
            type: "vote",
            item: self.id,
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
      self.getVotes();
    }
  }));

export default Votes;
