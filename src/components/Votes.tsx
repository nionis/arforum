import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import Item from "src/components/Item";
import VotesModel from "src/models/Votes";
import app from "src/stores/app";

interface IVotes {
  store: Instance<typeof VotesModel>;
}

const Votes = observer(({ store }: IVotes) => {
  const { results, usersVote } = store;
  const votedUp = usersVote && usersVote.type === "upvote";
  const votedDown = usersVote && usersVote.type === "downvote";
  const { colors } = app;

  return (
    <>
      <div>
        <Item
          onClick={votedUp ? undefined : () => store.vote("upvote")}
          textColor={votedUp ? colors.upvote : colors.mutedText}
        >
          <KeyboardArrowUp />
        </Item>
        <Item>
          <span>{results.voteScore}</span>
        </Item>
        <Item
          onClick={votedDown ? undefined : () => store.vote("downvote")}
          textColor={votedDown ? colors.downvote : colors.mutedText}
        >
          <KeyboardArrowDown />
        </Item>
      </div>

      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          text-align: center;
          flex-direction: column;
          width: 30px;
          height: 100%;
          font-size: 13px;
        }
      `}</style>
    </>
  );
});

export default Votes;
