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
  const commentsSize = `${store.comments.size} ${
    store.comments.size === 1 ? "comment" : "comments"
  }`;
  const category =
    "/a/categorycategoryweeeeeeeeeeeeeeeeeeecategorycategorycategorycategorycategorycategorycategorycategorycategorycategorycategorycategory";
  const user = "by Beeezle3M ago";

  return (
    <>
      <div className="container box">
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
          <Item textColor={colors.mutedText}>
            <span>{`${commentsSize} ${category} ${user}`}</span>
          </Item>
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
      `}</style>
    </>
  );
});

export default Post;
