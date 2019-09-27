import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import Item from "src/components/Item";
import Votes from "src/components/Votes";
import Box from "src/components/Border";
import PostModel from "src/models/Post";
import app from "src/stores/app";

interface IPost {
  store: Instance<typeof PostModel>;
}

const Post = observer(({ store }: IPost) => {
  const { colors } = app;
  const description = store.text.substring(0, 10);

  return (
    <>
      <div className="container">
        <Box right>
          <Votes store={store} />
        </Box>
        <div className="content">
          <Item>
            <span>{store.title}</span>
          </Item>
          <Item textColor={colors.mutedText}>
            <span>{description}</span>
          </Item>
          <div className="comments">
            <Item textColor={colors.mutedText}>
              <span>
                {store.comments.size}{" "}
                {store.comments.size === 1 ? "comment" : "comments"}
              </span>
            </Item>
            {app.size === "large" ? (
              <>
                {" "}
                <Item textColor={colors.mutedText}>
                  <span>
                    /a/categorycategoryweeeeeeeeeeeeeeeeeeecategorycategorycategorycategorycategorycategorycategorycategorycategorycategorycategorycategory
                  </span>
                </Item>{" "}
                <Item textColor={colors.mutedText}>
                  <span>by Beeezle3M ago</span>
                </Item>
              </>
            ) : null}
          </div>
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
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          background-color: ${colors.foreground};
          border: 1px solid ${colors.border};
        }

        .content {
          display: flex;
          justify-content: space-evenly;
          text-align: left;
          flex-direction: column;
          padding-left: 10px;
        }

        .comments {
          display: flex;
          justify-content: space-evenly;
          text-align: center;
        }
      `}</style>
    </>
  );
});

export default Post;
