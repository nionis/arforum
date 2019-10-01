import { observer } from "mobx-react";
import Border from "src/components/Border";
import Item from "src/components/Item";
import Button from "src/components/Button";
import Tabs from "src/components/Tabs";
import app, { goto } from "src/stores/app";
import forum from "src/stores/forum";

const Categories = observer(() => {
  const categories = Array.from(forum.categories.values());
  const { colors } = app;

  return (
    <>
      <div className="container">
        <div className="createCategory">
          <Button
            onClick={() => forum.createCategory("puppies")}
            // onClick={goto.createCategory}
            style={{ width: "100%", padding: "10px", height: "50px" }}
          >
            Create Category
          </Button>
        </div>
        <Border width="1px">
          <div className="categories">
            <Tabs direction="column">
              <Item textColor={colors.mutedText} style={{ padding: "10px" }}>
                Categories
              </Item>

              {categories.map(category => {
                const isActive: boolean =
                  app.pathData.categoryId === category.id;

                return (
                  <Border
                    left={isActive}
                    disabled={!isActive}
                    color={colors.accent}
                    width="2px"
                    style={{ padding: "10px" }}
                  >
                    <Item
                      onClick={() =>
                        category.createPost("hello world", "bye world")
                      }
                    >
                      {/* <Item onClick={() => goto.category(category.id)}> */}
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
