import { observer } from "mobx-react";
import { flatMap } from "lodash";
import app from "src/stores/app";
import user from "src/stores/user";
import forum from "src/stores/forum";
import jwk from "../arweave-keyfile.json";
import Post from "src/components/Post";
import Categories from "src/components/Categories";

user.setJwk(jwk).then(() => {
  user.getUsername();
  forum.getCategories();
});

export default observer(() => {
  const categories = Array.from(forum.categories.values());
  const posts = flatMap(categories, category =>
    Array.from(category.posts.values())
  );

  return (
    <>
      <div className="container">
        <div className="padder">
          <div className="postsContainer">
            {posts.map(post => {
              return <Post store={post} />;
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
