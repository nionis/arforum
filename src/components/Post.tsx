import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { format } from "timeago.js";
import Item from "src/components/Item";
import Votes from "src/components/Votes";
import Border from "src/components/Border";
import PostModel from "src/models/Post";
import app, { goto } from "src/stores/app";

interface IPost {
  store: Instance<typeof PostModel>;
}

const Post = observer(({ store }: IPost) => {
  const { colors } = app;
  const description = store.text.substring(0, 10);
  const commentsSize = `${store.comments.size} ${
    store.comments.size === 1 ? "comment" : "comments"
  }`;
  const category = `/c/${store.category}`;
  const displayName = store.from.displayName;
  const ago = format(store.createdAt);

  return (
    <>
      <div className="container">
        <Border right>
          <Votes store={store} />
        </Border>
        <div className="content">
          <Item onClick={() => goto.post(store.category, store.id)}>
            <span>{store.title}</span>
          </Item>
          <Item>
            <span>{description}</span>
          </Item>
          <span className="comment">
            <Item onClick={() => goto.post(store.category, store.id)}>
              {commentsSize}&nbsp;
            </Item>
            <Item onClick={() => goto.category(store.category)}>
              {category}&nbsp;
            </Item>
            {app.size === "large" ? (
              <>
                <Item textColor={colors.mutedText}>by&nbsp;</Item>
                <Item onClick={() => goto.user(store.from.address)}>
                  {displayName}&nbsp;
                </Item>
                <Item textColor={colors.mutedText}>{ago}</Item>
              </>
            ) : null}
          </span>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: flex-start;
          text-align: center;
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
          padding-left: 10px;
          overflow: hidden;
        }

        .comment {
          display: flex;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>
    </>
  );
});

export default Post;
