import { types, flow, Instance } from "mobx-state-tree";
import Primitive from "src/models/Primitive";
import fetches from "src/stores/fetches";
import transaction from "src/stores/transactions";
import User from "src/models/User";
import Request from "src/models/request/Request";
import Vote from "src/models/Vote";
import account from "src/stores/account";
import { getNow, pickLatest, vote as tfVote } from "src/utils";
import { appId } from "src/env";
import arweave from "src/arweave";

const Votes = types
  .compose(
    "Votes",
    Primitive,
    types.model("Votes", {
      fVotes: types.optional(Request, {}),
      votes: types.map(Vote)
    })
  )
  .views(self => ({
    get results() {
      const allVotes = Array.from(self.votes.values());
      const users = allVotes.reduce<{
        [key: string]: Instance<typeof Vote>;
      }>((result, vote) => {
        // if user votes his own post it doesnt count
        if (vote.from.address === account.address) {
          return result;
        }

        // get latest vote of a user
        if (result[vote.from.id]) {
          const oldVote = result[vote.from.id];

          if (oldVote.createdAt < vote.createdAt) {
            result[vote.from.id] = vote;
          }
        } else {
          result[vote.from.id] = vote;
        }

        return result;
      }, {});

      const votes = Object.values(users);

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
    vote: flow(function* vote(
      type: Instance<typeof Vote>["type"],
      target: string
    ) {
      const now = getNow();

      const ops =
        type === "upvote"
          ? {
              target,
              quantity: arweave.ar.arToWinston("0.10")
            }
          : {
              reward: arweave.ar.arToWinston("0.10")
            };

      transaction.add(
        tfVote.toTransaction({
          type,
          item: self.id,
          createdAt: now
        }),
        {
          title: type,
          ...ops
        }
      );
    })
  }));

export default Votes;
