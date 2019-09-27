import { observer } from "mobx-react";
import { WbSunny } from "@material-ui/icons";
import Tabs from "src/components/Tabs";
import Item from "src/components/Item";
import app from "src/stores/app";
import user from "src/stores/user";

const DisplayName = observer(() => {
  if (!user.loggedIn) return <span>login</span>;
  if (user.loggedIn && user.username) return <span>{user.username}</span>;

  const address = user.address.substring(0, 4);
  return <span>{address}..</span>;
});

const Header = observer(() => {
  const { colors } = app;

  return (
    <>
      <div className="container">
        <div className="innerBox">
          <Item>
            <span>arforum</span>
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
