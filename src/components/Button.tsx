import { CSSProperties } from "react";
import Item from "src/components/Item";
import app from "src/stores/app";
import Loading from "./Loading";

interface IButton {
  children: any;
  onClick?: () => any;
  disabled?: boolean;
  style?: CSSProperties;
  loading?: boolean;
}

const Button = ({ children, disabled, onClick, style, loading }: IButton) => {
  const { colors } = app;

  return (
    <>
      <Item textColor="white" accentColor="white" onClick={onClick}>
        {loading ? (
          <div style={style}>
            <Loading alwaysWhite={true} />
          </div>
        ) : (
          <div style={style}>{children}</div>
        )}
      </Item>

      <style jsx>{`
        div {
          display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          font-size: 14px;
          padding: 5px;
          width: 100px;
          border-radius: 4px;
          background-color: ${colors.accent};
          opacity: ${disabled ? "0.9" : "1"};
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }

        div:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default Button;
