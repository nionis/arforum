import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import Loading from "src/components/Loading";
import Item from "src/components/Item";
import PostModel from "src/models/Post";
import CommentModel from "src/models/Comment";
import app from "src/stores/app";
import account from "src/stores/account";

interface IVotes {
  store: Instance<typeof PostModel> | Instance<typeof CommentModel>;
}

const Votes = observer(({ store }: IVotes) => {
  const { results, usersVote } = store;
  const votedUp = usersVote && usersVote.type === "upvote";
  const votedDown = usersVote && usersVote.type === "downvote";
  const { colors } = app;
  const disabled = store.from.address === account.address;
  const loading = store.fVotes.status === "PENDING";

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="loadingContainer">
            <Loading />
          </div>
        ) : null}

        <div className="votesContainer">
          <Item
            onClick={
              disabled || votedUp
                ? undefined
                : () => store.vote("upvote", store.from.address)
            }
            textColor={votedUp ? colors.upvote : colors.mutedText}
          >
            <KeyboardArrowUp />
          </Item>
          <Item>
            <span>{results.voteScore}</span>
          </Item>
          <Item
            onClick={
              disabled || votedDown
                ? undefined
                : () => store.vote("downvote", store.from.address)
            }
            textColor={votedDown ? colors.downvote : colors.mutedText}
          >
            <KeyboardArrowDown />
          </Item>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          text-align: center;
          width: 30px;
          height: 100%;
        }

        .loadingContainer {
          position: absolute;
          width: 30px;
        }

        .votesContainer {
          display: flex;
          justify-content: space-around;
          text-align: center;
          flex-direction: column;
          font-size: 13px;
          height: 100%;
          opacity: ${loading ? "0.5" : "1"};
        }
      `}</style>
    </>
  );
});

export default Votes;
