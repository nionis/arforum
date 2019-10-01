import { observer } from "mobx-react";
import { types, Instance, unprotect } from "mobx-state-tree";
import { format } from "timeago.js";
import ReactMarkdown from "react-markdown";
import { Edit } from "@material-ui/icons";
import Item from "src/components/Item";
import Votes from "src/components/Votes";
import Border from "src/components/Border";
import PostModel from "src/models/Post";
import account from "src/stores/account";
import app, { goto } from "src/stores/app";

const uiStore = types
  .model("Post", {
    editing: false
  })
  .actions(self => {
    unprotect(self);
    return {};
  })
  .create();

interface IPost {
  store: Instance<typeof PostModel>;
  showDescription?: boolean;
}

const Post = observer(({ store, showDescription }: IPost) => {
  const { colors } = app;
  const description = store.text.substring(0, 10);
  const commentsSize = `${store.commentsCount} ${
    store.commentsCount === 1 ? "comment" : "comments"
  }`;
  const categoryUrl = `/c/${store.category}`;
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
          <Item textColor={showDescription ? colors.mutedText : undefined}>
            {showDescription ? (
              <span>{description}</span>
            ) : (
              <ReactMarkdown source={store.text} />
            )}
          </Item>
          <span className="comment">
            <Item onClick={() => goto.post(store.category, store.id)}>
              {commentsSize}&nbsp;
            </Item>
            <Item onClick={() => goto.category(store.category)}>
              {categoryUrl}&nbsp;
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
        {store.from.address === account.address ? (
          <div className="edit">
            <Item onClick={() => (uiStore.editing = true)}>
              <Edit />
            </Item>
          </div>
        ) : null}
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
          padding-top: 10px;
          padding-bottom: 10px;
          overflow: hidden;
          flex: 1 0 0;
        }

        .comment {
          display: flex;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .edit {
          padding-right: 10px;
          padding-top: 10px;
        }
      `}</style>
    </>
  );
});

export default Post;
