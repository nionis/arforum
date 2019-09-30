import { types, flow, Instance } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import Fetch from "src/models/request/Fetch";
import Transaction from "src/models/request/Transaction";
import User from "src/models/User";
import Vote from "src/models/Vote";
import account from "src/stores/account";
import { randomId, getNow, pickLatest, vote as tfVote } from "src/utils";
import { appId } from "src/env";

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
      const votesRaw: any[] = yield Fetch.create().run({
        query: `
          query Votes {
            transactions(
              tags: [
                { name: "appId", value: "${appId}" }
                { name: "type", value: "vote" }
                { name: "item", value: "${self.id}" }
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

      const votes = votesRaw.map(tfVote.fromTransaction);

      votes.forEach(vote => {
        if (self.votes.has(vote.id)) return;

        try {
          self.votes.set(
            vote.id,
            Vote.create({
              ...vote,
              from: User.create({ id: vote.from }) as any
            })
          );
        } catch (err) {
          console.error(err);
        }
      });
    }),

    vote: flow(function* vote(type: Instance<typeof Vote>["type"]) {
      const id = randomId();
      const now = getNow();

      return Transaction.create().run(
        tfVote.toTransaction({
          id,
          type,
          item: self.id,
          updatedAt: now,
          createdAt: now
        })
      );
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.getVotes();
    }
  }));

export default Votes;
