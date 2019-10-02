import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { types, Instance, unprotect } from "mobx-state-tree";
import { format } from "timeago.js";
import { Edit } from "@material-ui/icons";
import Editor from "src/components/Editor";
import Button from "src/components/Button";
import Item from "src/components/Item";
import Votes from "src/components/Votes";
import Border from "src/components/Border";
import Link from "src/components/Link";
import PostModel from "src/models/Post";
import account from "src/stores/account";
import app, { goto } from "src/stores/app";
import forum from "src/stores/forum";

const UiStore = types
  .model("Post", {
    editing: false
  })
  .volatile(self => ({
    contentState: undefined
  }))
  .actions(self => {
    unprotect(self);

    return {};
  });

interface IPost {
  store: Instance<typeof PostModel>;
  showDescription?: boolean;
  showEdit?: boolean;
}

const Post = observer(({ store, showDescription, showEdit }: IPost) => {
  const [uiStore] = useState(UiStore.create());
  useEffect(() => {
    uiStore.contentState = store.content || {};
  }, []);

  const { colors } = app;
  const description = "";
  const commentsSize = `${store.comments.size} ${
    store.comments.size === 1 ? "comment" : "comments"
  }`;
  const category = forum.categories.get(store.category);
  const categoryUrl = `/c/${category ? category.displayName : store.category}`;
  const displayName = store.from.displayName;
  const ago = format(store.createdAt);
  const editable =
    showEdit && store.from.address === account.address && store.type === "text";

  return (
    <>
      <div className="container">
        <Border right>
          <Votes store={store} />
        </Border>
        <div className="content">
          <Item onClick={() => goto.post(store.category, store.id)}>
            {!showDescription && store.type === "link" ? (
              <Link href={store.content}>{store.title}</Link>
            ) : (
              <span>{store.title}</span>
            )}
          </Item>
          <Item textColor={showDescription ? colors.mutedText : undefined}>
            {showDescription ? (
              <span>{description}</span>
            ) : store.type === "text" ? (
              <Editor
                readOnly={!uiStore.editing}
                state={uiStore.editing ? uiStore.contentState : store.content}
                onChange={contentState => {
                  uiStore.contentState = contentState;
                }}
              />
            ) : store.type === "media" ? (
              <img src={store.content} alt={store.title} />
            ) : null}
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
            {uiStore.editing ? (
              <Button onClick={() => store.updateContent(uiStore.contentState)}>
                SUBMIT
              </Button>
            ) : null}
          </span>
        </div>
        {editable ? (
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
