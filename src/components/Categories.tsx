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
            return (
              <div className="item">
                <Item>{category.name}</Item>
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
      `}</style>
    </>
  );
});

export default Categories;
