import { observer } from "mobx-react";
import user from "src/stores/user";

const DisplayName = observer(() => {
  if (!user.loggedIn) return <span>login</span>;
  if (user.loggedIn && user.username) return <span>{user.username}</span>;

  return <span>{user.address}</span>;
});

const Header = observer(() => {
  return (
    <>
      <div className="container">
        <div className="innerBox">
          <span>arforum</span>
          <DisplayName />
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          width: 100vw;
          height: 5vh;
        }

        .innerBox {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          height: 100%;
        }
      `}</style>
    </>
  );
});

export default Header;
