import { observer } from "mobx-react";
import { WbSunny } from "@material-ui/icons";
import Login, { store as loginStore } from "src/components/Login";
import Tabs from "src/components/Tabs";
import Item from "src/components/Item";
import app, { goto } from "src/stores/app";
import account from "src/stores/account";
import React from "react";

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
  const { colors, size } = app;

  return (
    <>
      {/* <Login /> */}
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
        <div className="dropdown">
          <div className="title">
            {" "}
            <div className="text">Tranactions</div>
            <div className="status">ID</div>
            <div className="status">Status</div>
          </div>
          <div className="dropdownTab">
            {" "}
            <div className="text">Upvote</div>
            <div className="status">0xe9d7ak3r...</div>
            <div className="status">Done</div>{" "}
          </div>
          <div className="dropdownTab">
            {" "}
            <div className="text">Downvote</div>
            <div className="status">0xe9d7ak3r...</div>
            <div className="status">Pending</div>{" "}
          </div>
          <div className="dropdownTab">
            {" "}
            <div className="text">Create Post</div>
            <div className="status">0xe9d7ak3r...</div>
            <div className="status">Failed</div>{" "}
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

        .dropdown {
          position: absolute;
          width: ${size === "large" ? "400px" : "100%"};
          background: ${colors.foreground};
          top: 45px;
          right: 0;
        }

        .dropdownTab {
          height: 50px;
          color: ${colors.normalText};
          border: 1px solid ${colors.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }
        .title {
          border: 1px solid ${colors.border};
          height: 50px;
          color: ${colors.normalText};
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          text-align: center;
          font-size: 18px;
          padding-bottom: 5px;
        }
        .text {
          width: 120px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          padding-left: 10px;
        }
        .status {
          width: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
      `}</style>
    </>
  );
});

export default Header;
