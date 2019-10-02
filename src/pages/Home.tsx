import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { flatMap } from "lodash";
import Loading from "src/components/Loading";
import Item from "src/components/Item";
import Post from "src/components/Post";
import Categories from "src/components/Categories";
import PostModel from "src/models/Post";
import app from "src/stores/app";
import forum from "src/stores/forum";

export default observer(() => {
  const { categoryId } = app.pathData;
  let posts: Instance<typeof PostModel>[] = [];

  if (categoryId) {
    if (!forum.categories.has(categoryId)) {
      return <h1>loading</h1>;
    }

    posts = Array.from(
      forum.categories.get(categoryId).postsProcessed.values()
    );
  } else {
    const categories = Array.from(forum.categories.values());
    posts = flatMap(categories, category =>
      Array.from(category.postsProcessed.values())
    );
  }

  posts = posts.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  // const showLoading = true;
  const showLoading =
    (forum.fCategories.status === "PENDING" ||
      forum.fPosts.status === "PENDING") &&
    posts.length === 0;
  const isEmpty = !showLoading && posts.length === 0;

  return (
    <>
      <div className="container">
        <div className="padder">
          <div className="postsContainer">
            {showLoading ? (
              <Loading size="100px" />
            ) : isEmpty ? (
              <Item style={{ fontSize: "50px", whiteSpace: "normal" }}>
                no posts found
              </Item>
            ) : (
              posts.map(post => {
                return (
                  <div className="postContainer">
                    <Post key={post.id} store={post} showDescription={true} />
                  </div>
                );
              })
            )}
          </div>
          <div className="categoriesContainer">
            <Categories />
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-around;
          width: 100vw;
          margin-top: ${app.size === "large" ? "5vh" : "2vh"};
          min-height: 90vh;
        }

        .padder {
          display: flex;
          justify-content: space-between;
          flex-direction: ${app.size === "large" ? "row" : "column-reverse"};
          width: ${app.size === "large" ? "90%" : "100%"};
        }

        .postsContainer {
          display: flex;
          flex-direction: column;
          justify-content: ${showLoading || isEmpty ? "center" : "flex-start"};
          align-items: center;
          width: ${app.size === "large" ? "70%" : "100%"};
          height: 100%;
        }

        .postContainer {
          width: 100%;
          margin-bottom: 10px;
        }

        .categoriesContainer {
          display: flex;
          flex-direction: column;
          width: ${app.size === "large" ? "25%" : "100%"};
        }
      `}</style>
    </>
  );
});
