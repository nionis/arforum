import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { format } from "timeago.js";
import ReactMarkdown from "react-markdown";
import Border from "src/components/Border";
import Votes from "src/components/Votes";
import CommentModel from "src/models/Comment";
import app from "src/stores/app";
import Item from "./Item";

interface IComment {
  store: Instance<typeof CommentModel>;
}

const Comment = observer(({ store }: IComment) => {
  const { colors } = app;
  const itemStyle = {
    padding: "10px"
  };

  return (
    <>
      <div className="container">
        <Border right>
          <Votes store={store} />
        </Border>
        <div className="content">
          <Border bottom>
            <Item style={itemStyle}>
              {store.from.displayName}{" "}
              <Item
                style={{ display: "inline-flex" }}
                textColor={colors.mutedText}
              >
                {format(store.createdAt)}
              </Item>
            </Item>
          </Border>
          <Item textColor={colors.mutedText} style={itemStyle}>
            <ReactMarkdown source={store.text} />
          </Item>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: flex-start;
          text-align: left;
          flex-direction: row;
          width: 100%;
          min-height: 10vh;
          background-color: ${colors.foreground};
          border: 1px solid ${colors.border};
        }

        .content {
          display: flex;
          justify-content: space-evenly;
          text-align: left;
          flex-direction: column;
          width: 100%;
        }
      `}</style>
    </>
  );
});

export default Comment;
