import { observer } from "mobx-react";
import { WbSunny } from "@material-ui/icons";
import Login, { store as loginStore } from "src/components/Login";
import Tabs from "src/components/Tabs";
import Item from "src/components/Item";
import app, { goto } from "src/stores/app";
import account from "src/stores/account";

const DisplayName = observer(() => {
  const { colors } = app;

  if (!account.loggedIn) {
    return (
      <Item onClick={loginStore.open} textColor={colors.mutedText}>
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
      <Login />
      <div className="container">
        <div className="innerBox">
          <Item onClick={() => goto.home()} style={{ fontWeight: "bold" }}>
            <span>ARforum</span>
          </Item>
          <div className="rightBox">
            <Tabs space="10px">
              <Item
                onClick={app.swapTheme}
                textColor={colors.mutedText}
                style={{ paddingTop: "4px" }}
              >
                <WbSunny />
              </Item>
              {account.loggedIn ? (
                <Item textColor={colors.mutedText}>
                  <span>{account.balancePretty} AR</span>
                </Item>
              ) : null}
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
          height: 100%;
        }
      `}</style>
    </>
  );
});

export default Header;
