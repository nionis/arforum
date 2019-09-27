import { observer } from "mobx-react";
import Item from "src/components/Item";
import app from "src/stores/app";
import forum from "src/stores/forum";

const Categories = observer(() => {
  const categories = Array.from(forum.categories.values());
  const { colors } = app;

  return (
    <>
      <div className="container">
        <div
          className="item"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <Item textColor={colors.mutedText}>Categories</Item>
        </div>

        {categories.map(category => {
          return (
            <div className="item">
              <Item>{category.name}</Item>
            </div>
          );
        })}
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
