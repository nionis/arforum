import { observer } from "mobx-react";
import Modal from "@material-ui/core/Modal";
import Border from "src/components/Border";
import Item from "src/components/Item";
import Tabs from "src/components/Tabs";
import ModalModel from "src/models/Modal";
import app, { goto } from "src/stores/app";
import forum from "src/stores/forum";

const store = ModalModel.create();

const Categories = observer(() => {
  const categories = Array.from(forum.categories.values());
  const { colors } = app;

  return (
    <>
      {/* <Modal
        open={store.opened}
        onClose={store.close}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Login onClose={store.close} />
      </Modal> */}

      <div className="container">
        <Tabs direction="column">
          <div className="item">
            <Item onClick={() => forum.createCategory(String(Math.random()))}>
              Create Category
            </Item>
          </div>
          <div className="item">
            <Item textColor={colors.mutedText}>Categories</Item>
          </div>

          {categories.map(category => {
            const isActive: boolean = app.pathData.categoryId === category.id;

            return (
              <Border
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
