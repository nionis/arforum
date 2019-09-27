import { CSSProperties } from "react";
import { observer } from "mobx-react";
import app from "src/stores/app";

interface IItemProps {
  children?: any;
  onClick?: () => any;
  textColor?: string;
  accentColor?: string;
  style?: CSSProperties;
}

const Item = observer(
  ({ children, onClick, textColor, accentColor, style }: IItemProps) => {
    const { colors } = app;

    const hasHover = !!onClick;
    textColor = textColor || colors.normalText;
    accentColor = accentColor || colors.accent;

    return (
      <>
        <div onClick={onClick} style={style}>
          {children}
        </div>

        <style jsx>{`
          div {
            color: ${textColor};
            cursor: default;
          }

          div:hover {
            color: ${!hasHover ? textColor : accentColor};
            cursor: ${!hasHover ? "default" : "pointer"};
          }
        `}</style>
      </>
    );
  }
);

export default Item;
