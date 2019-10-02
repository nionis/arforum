import { observer } from "mobx-react";
import Item from "src/components/Item";
import app from "src/stores/app";
import transactions from "src/stores/transactions";

const Transactions = observer(() => {
  const { colors, size } = app;
  const txs = Array.from(transactions.store.values()).reverse();

  return (
    <>
      <div className="container">
        <div className="title">
          {" "}
          <div className="text">Tranactions</div>
          <div className="status">ID</div>
          <div className="status">Status</div>
        </div>
        <div className="transactions">
          {txs.map(tx => (
            <div className="dropdownTab">
              {" "}
              <div className="text">{tx.title || "Other"}</div>
              <div className="status">{tx.id}</div>
              <div className="status">{tx.status}</div>{" "}
            </div>
          ))}
          {transactions.store.size === 0 ? (
            <Item textColor={colors.mutedText}>no transactions found</Item>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          position: absolute;
          width: ${size === "large" ? "40vw" : "100vw"};
          background: ${colors.foreground};
          top: 5vh;
          right: 0;
          min-height: 200px;
          box-shadow: 1px 1px 20px 0px ${colors.shadow};
          z-index: 2;
        }

        .transactions {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: ${txs.length ? "flex-start" : "center"};
          align-items: center;
          text-align: center;
        }

        .dropdownTab {
          display: flex;
          color: ${colors.normalText};
          border: 1px solid ${colors.border};
          justify-content: space-between;
          align-items: center;
          text-align: center;
          padding: 10px;
          width: 100%;
        }

        .title {
          border: 1px solid ${colors.border};
          color: ${colors.normalText};
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          text-align: center;
          font-size: 18px;
          padding: 10px;
        }

        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          flex: 1;
        }

        .status {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex: 1;
        }
      `}</style>
    </>
  );
});

export default Transactions;
