import Router from "next/router";
import { observer } from "mobx-react";
import Item from "src/components/Item";
import Tabs from "src/components/Tabs";
import app from "src/stores/app";
import forum from "src/stores/forum";

const Categories = observer(() => {
  const categories = Array.from(forum.categories.values());
  const { colors } = app;

  return (
    <>
      <div className="container">
        <Tabs direction="column">
          <div className="item">
            <Item textColor={colors.mutedText}>Categories</Item>
          </div>

          {categories.map(category => {
            const isActive = app.pathData.id === category.id;

            return (
              <div className={`item ${isActive ? "active" : ""}`}>
                <Item onClick={() => Router.push(`/#/c/${category.id}`)}>
                  {category.name}
                </Item>
              </div>
            );
          })}
        </Tabs>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          text-align: center;
          flex-direction: column;
          background-color: ${colors.foreground};
          border: 1px solid ${colors.border};
        }

        .item {
          padding: 10px;
        }

        .active {
          background-color: red;
        }
      `}</style>
    </>
  );
});

export default Categories;
