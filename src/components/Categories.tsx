import { observer } from "mobx-react";
import Border from "src/components/Border";
import Item from "src/components/Item";
import Button from "src/components/Button";
import Tabs from "src/components/Tabs";
import Loading from "src/components/Loading";
import app, { goto } from "src/stores/app";
import forum from "src/stores/forum";

const Categories = observer(() => {
  const categories = Array.from(forum.categories.values());
  const { colors } = app;
  const { categoryId } = app.pathData;

  return (
    <>
      <div className="container">
        <div className="createCategory">
          {!categoryId ? (
            <Button
              onClick={goto.createCategory}
              style={{ width: "100%", padding: "10px", height: "50px" }}
            >
              Create Category
            </Button>
          ) : (
            <Button
              onClick={() => goto.createPost(categoryId)}
              style={{ width: "100%", padding: "10px", height: "50px" }}
            >
              Create Post
            </Button>
          )}
        </div>
        <Border width="1px">
          <div className="categories">
            <Tabs direction="column">
              <Item textColor={colors.mutedText} style={{ padding: "10px" }}>
                Categories&nbsp;
                {forum.fCategories.status === "PENDING" ? (
                  <Loading size="15px" />
                ) : null}
              </Item>
              <Border
                key="all"
                left={!categoryId}
                disabled={!!categoryId}
                color={colors.accent}
                width="2px"
                style={{ padding: "10px" }}
              >
                <Item onClick={() => goto.home()}>all</Item>
              </Border>

              {categories.map(category => {
                const isActive: boolean =
                  app.pathData.categoryId === category.id;

                return (
                  <Border
                    key={category.id}
                    left={isActive}
                    disabled={!isActive}
                    color={colors.accent}
                    width="2px"
                    style={{ padding: "10px" }}
                  >
                    <Item onClick={() => goto.category(category.id)}>
                      {category.name}
                    </Item>
                  </Border>
                );
              })}
            </Tabs>
          </div>
        </Border>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          text-align: center;
          flex-direction: column;
        }

        .createCategory {
          margin-bottom: 10px;
        }

        .categories {
          background-color: ${colors.foreground};
          border: 1px solid ${colors.border};
        }

        .active {
          background-color: red;
        }
      `}</style>
    </>
  );
});

export default Categories;
