import { CSSProperties } from "react";
import Item from "src/components/Item";
import app from "src/stores/app";

interface IButton {
  children: any;
  onClick?: () => any;
  style?: CSSProperties;
}

const Button = ({ children, onClick, style }: IButton) => {
  const { colors } = app;

  return (
    <>
      <Item textColor="white" accentColor="white" onClick={onClick}>
        <div style={style}>{children}</div>
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
        }

        div:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default Button;
