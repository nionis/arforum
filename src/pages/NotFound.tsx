import { observer } from "mobx-react";
import Item from "src/components/Item";
import Button from "src/components/Button";
import { goto } from "src/stores/app";

const NotFound = observer(() => (
  <>
    <div className="container">
      <Item>
        <h1>404</h1>
      </Item>
      <Item>oups! page not found</Item>
      <div className="button">
        <Button onClick={goto.home}>head back</Button>
      </div>
    </div>

    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 90vh;
      }

      .button {
        margin-top: 20px;
      }
    `}</style>
  </>
));

export default NotFound;
