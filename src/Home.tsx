import { observer } from "mobx-react";
import user from "src/stores/user";
import forum from "src/stores/forum";
import jwk from "../arweave-keyfile.json";

user.setJwk(jwk).then(() => {
  user.getUsername();
});

export default observer(() => {
  const categories = Array.from(forum.categories.values());

  const userInfo = JSON.stringify(
    {
      address: user.address,
      username: user.username,
      loggedIn: user.loggedIn
    },
    null,
    2
  );

  return (
    <div>
      <pre>{userInfo}</pre>
      {user.loggedIn ? (
        <>
          <button onClick={forum.getCategories}>fetchCategories</button>
          <button onClick={() => forum.createCategory("news")}>
            createCategories
          </button>
        </>
      ) : null}
      <h3>categories</h3>
      {categories.map(category => {
        return (
          <>
            <h4>{category.name}</h4>
            <button onClick={() => category.createPost("title", "text")}>
              createPost
            </button>
            <hr />
            {Array.from(category.posts.values()).map(post => {
              return (
                <>
                  <button onClick={() => post.vote("UPVOTE")}>+</button>
                  <button onClick={() => post.vote("DOWNVOTE")}>-</button>
                  <pre>
                    {JSON.stringify(
                      {
                        title: post.title,
                        text: post.text,
                        ...post.results
                      },
                      null,
                      2
                    )}
                  </pre>
                  update text
                  <input
                    type="text"
                    onDoubleClick={e => post.updateText(e.target["value"])}
                  />
                  <hr />
                </>
              );
            })}
          </>
        );
      })}
    </div>
  );
});
