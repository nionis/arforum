import { observer } from "mobx-react";
import Item from "src/components/Item";
import Link from "src/components/Link";
import UserModel from "src/models/User";
import app from "src/stores/app";
import account from "src/stores/account";

const { userId } = app.pathData;
const isAccount = userId === account.address;
const user = isAccount ? account : UserModel.create({ address: userId });

const User = observer(() => {
  const { colors } = app;

  return (
    <>
      <div className="container">
        <div className="padder">
          <Item>Hey {user.username || user.address}!</Item>
          {user.username ? (
            <Item textColor={colors.mutedText}>address: {user.address}</Item>
          ) : null}
          {user.username ? (
            <div className="setupUsername">
              <Item>Setup username using&nbsp;</Item>
              <Link
                href="https://arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0"
                target="_blank"
              >
                arweaveID
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-around;
          width: 100vw;
          margin-top: ${app.size === "large" ? "5vh" : "2vh"};
        }

        .padder {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: ${app.size === "large" ? "90%" : "100%"};
          height: 100%;
        }

        .setupUsername {
          display: flex;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
});

export default User;
