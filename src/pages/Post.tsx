import { computed } from "mobx";
import { observer } from "mobx-react";
import Post from "src/components/Post";
import CreateComment from "src/components/CreateComment";
import Comment from "src/components/Comment";
import app from "src/stores/app";
import forum from "src/stores/forum";

const $post = computed(() => {
  const { categoryId, postId } = app.pathData;
  const category = forum.categories.get(categoryId);
  if (!category) return undefined;

  const post = category.posts.get(postId);
  if (!post) return undefined;

  return post;
});

export default observer(() => {
  const { categoryId, postId } = app.pathData;

  const post = $post.get();
  if (!post) return <h1>loading</h1>;

  const comments: any = Array.from(post.comments.values());

  return (
    <>
      <div className="container">
        <div className="padder">
          <Post store={post} showEdit={!!postId} />
          <CreateComment post={post} />
          {comments.map(comment => {
            return <Comment store={comment} />;
          })}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-around;
          width: 100vw;
          margin-top: ${app.size === "large" ? "5vh" : "2vh"};
        }

        .padder {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: ${app.size === "large" ? "90%" : "100%"};
          height: 100%;
        }
      `}</style>
    </>
  );
});
