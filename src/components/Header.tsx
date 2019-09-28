import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import Modal from "@material-ui/core/Modal";
import { WbSunny } from "@material-ui/icons";
import Login from "src/components/Login";
import Tabs from "src/components/Tabs";
import Item from "src/components/Item";
import app, { goto } from "src/stores/app";
import account from "src/stores/account";

const store = types
  .model("Header", {
    opened: false
  })
  .actions(self => ({
    open() {
      self.opened = true;
    },

    close() {
      console.log("here");
      self.opened = false;
    }
  }))
  .create();

const DisplayName = observer(() => {
  const { colors } = app;

  if (!account.loggedIn) {
    return (
      <Item onClick={store.open} textColor={colors.mutedText}>
        login
      </Item>
    );
  }

  return (
    <Item
      onClick={() => goto.user(account.address)}
      textColor={colors.mutedText}
    >
      {account.displayName}
    </Item>
  );
});

const Header = observer(() => {
  const { colors } = app;

  return (
    <>
      <Modal
        open={store.opened}
        onClose={store.close}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Login onClose={store.close} />
      </Modal>
      <div className="container">
        <div className="innerBox">
          <Item onClick={() => goto.home()} style={{ fontWeight: "bold" }}>
            <span>ARforum</span>
          </Item>
          <div className="rightBox">
            <Tabs>
              <Item
                onClick={app.swapTheme}
                textColor={colors.mutedText}
                style={{ paddingTop: "4px" }}
              >
                <WbSunny />
              </Item>
              <Item textColor={colors.mutedText}>
                <DisplayName />
              </Item>
            </Tabs>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          width: 100vw;
          height: 5vh;
          background-color: ${colors.foreground};
          box-shadow: 1px 1px 20px 0px ${colors.shadow};
        }

        .innerBox {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          height: 100%;
        }

        .rightBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100px;
          height: 100%;
        }
      `}</style>
    </>
  );
});

export default Header;
