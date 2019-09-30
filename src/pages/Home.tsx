import { observer } from "mobx-react";
import { Instance } from "mobx-state-tree";
import { flatMap } from "lodash";
import PostModel from "src/models/Post";
import app from "src/stores/app";
import forum from "src/stores/forum";
import Post from "src/components/Post";
import Categories from "src/components/Categories";

const { categoryId } = app.pathData;

if (categoryId) {
  forum.getCategories({ categoryId });
} else {
  forum.getCategories({});
}

export default observer(() => {
  const { categoryId } = app.pathData;
  let posts: Instance<typeof PostModel>[] = [];

  if (categoryId) {
    if (!forum.categories.has(categoryId)) {
      return <h1>loading</h1>;
    }

    posts = Array.from(forum.categories.get(categoryId).posts.values());
  } else {
    const categories = Array.from(forum.categories.values());
    posts = flatMap(categories, category =>
      Array.from(category.posts.values())
    );
  }

  return (
    <>
      <div className="container">
        <div className="padder">
          <div className="postsContainer">
            {posts.map(post => {
              return <Post key={post.id} store={post} />;
            })}
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
        }

        .padder {
          display: flex;
          justify-content: space-between;
          flex-direction: ${app.size === "large" ? "row" : "column-reverse"};
          width: ${app.size === "large" ? "90%" : "100%"};
          height: 100%;
        }

        .postsContainer {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          width: ${app.size === "large" ? "70%" : "100%"};
          height: 100%;
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
